import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
    private client;

    async onModuleInit() {
        this.client = createClient({
            url: process.env.REDIS_URL,
        });

        this.client.on('error', (err) => console.error('Redis Client Error', err));

        await this.client.connect();
    }

    async set(key: string, value: string, ttlSeconds: number) {
        await this.client.set(key, value, { EX: ttlSeconds });
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async del(key: string) {
        await this.client.del(key);
    }
}