import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

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

    async sendOtp(email: string) {
        try {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            this.otps.set(email, otp);
            setTimeout(() => this.otps.delete(email), 5 * 60 * 1000);

            const sendedOtp = this.transporter.sendMail({
                from: `"Nest App" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Your OTP for verification',
                text: `Your OTP is ${otp}`,
            });

            if (!sendedOtp) throw new Error('Error sending OTP');

            return { otpReceived: true };

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
}
