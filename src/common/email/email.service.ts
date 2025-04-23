import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as Email from 'email-templates';
import { join } from 'path';

@Injectable()
export class EmailService {

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

    async sendEmail(email: string, template: string, locals: any) {
        try {
            const sendedOtp = await this.emailInstance.send({
                template: template,
                message: {
                    to: email,
                },
                locals: locals
            });

            if (!sendedOtp) throw new Error('Error sending OTP');

            return { otpSent: email };

        } catch (error) {
            throw error;
        }
    }
}