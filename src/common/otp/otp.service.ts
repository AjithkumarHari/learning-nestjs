import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { randomInt } from 'crypto';

@Injectable()
export class OtpService {
    constructor(private readonly redis: RedisService) { }

    async createOtp(email: string, code?: string ): Promise<string> {
        if (code) {
            await this.redis.set(`otp:${email}`, code, 300); // 5 min expiry
            return code;
        }
        const otp = randomInt(100000, 999999).toString();
        await this.redis.set(`otp:${email}`, otp, 300); // 5 min expiry
        return otp;
    }

    async verifyOtp(email: string, code: string): Promise<boolean> {
        const storedOtp = await this.redis.get(`otp:${email}`);
        if (storedOtp === code) {
            await this.redis.del(`otp:${email}`);
            return true;
        }
        return false;
    }
}