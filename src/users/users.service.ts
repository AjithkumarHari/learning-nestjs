import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/common/schemas/user.schema';


@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async createUser(createUserDto) {
        try {
            const existingUser = await this.userModel.findOne({ email: createUserDto.email });

            if (existingUser) {
                throw new Error('Email already exists');
            }
            
            const newUser = new this.userModel(createUserDto);
            console.log('newUser', newUser);
            return await newUser.save();
        }
        catch (error) {
            throw error;
        }

    }

    findAll() {

    }
}