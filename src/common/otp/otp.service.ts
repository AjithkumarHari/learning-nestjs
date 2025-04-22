import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as Email from 'email-templates';
import { join } from 'path';

@Injectable()
export class OtpService {
    private otps = new Map<string, string>();

    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    private emailInstance = new (Email as any)({
        message: {
            from: `Nest App <${process.env.EMAIL_USER}>`,
        },
        send: true,
        preview: false,
        transport: this.transporter,
        views: {
            root: join(__dirname, '..', '..', 'templates'),
            options: {
                extension: 'ejs',
            },
        },
        juice: true,
        juiceResources: {
            preserveImportant: true,
            webResources: {
                relativeTo: join(__dirname, '..', '..', 'templates'),
            },
        },
    });

    async sendOtp(email: string, name: string) {
        try {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            this.otps.set(email, otp);
            setTimeout(() => this.otps.delete(email), 5 * 60 * 1000);

            const sendedOtp = await this.emailInstance.send({
                template: 'otp',
                message: {
                    to: email,
                },
                locals: {
                    otp: otp,
                    name: name,
                },
            });

            if (!sendedOtp) throw new Error('Error sending OTP');

            return { otpSent: true };

        } catch (error) {
            throw error;
        }
    }

    verifyOtp(email: string, code: string) {
        try {
            const stored = this.otps.get(email);
            if (stored === code) {
                this.otps.delete(email);
                return true;
            }
            return false;
        } catch (error) {
            throw new Error('Error verifying OTP');
        }
    }

    async sendSuccessEmail(email: string, name: string) {
        try {
            const sendedEmail = await this.emailInstance.send({
                template: 'signup_success',
                message: {
                    to: email,
                },
                locals: {
                    name: name,
                },
            });

            if (!sendedEmail) throw new Error('Error sending success email');

            return { emailSent: true };

        } catch (error) {
            throw error;
        }
    }
}
