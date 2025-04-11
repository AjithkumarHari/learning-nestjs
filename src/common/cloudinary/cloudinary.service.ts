import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    async uploadImage(fileUri: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
        try {
            return v2.uploader.upload(fileUri, {
                folder: 'user_profiles',
                transformation: [{ width: 500, height: 500, crop: 'limit' }],
            });
        } catch (error) {
            throw error;
        }
    }
}