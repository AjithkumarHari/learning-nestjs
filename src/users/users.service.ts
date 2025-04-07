import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/common/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async createUser(createUserDto) {
        try {
            const existingUser = await this.userModel.findOne({ email: createUserDto.email });
            if (existingUser) {
                throw new Error('Email already exists');
            } else  {
                const hashedPassword = await bcrypt.hash(createUserDto.password, 16);
                const newUser = new this.userModel({
                    ...createUserDto,
                    password: hashedPassword
                });
                return await newUser.save();
            }
        }
        catch (error) {
            throw error;
        }
    }

    async validateUser(email: string, password: string) {
        try {
            const existingUser = await this.userModel.findOne({ email: email });
            if (!existingUser) {
                throw new Error('User does not exists');
            } else {
                const isMatch = await bcrypt.compare(password, existingUser.password);
                if (!isMatch) {
                    throw new Error('Invalid password');
                }
                return existingUser;
            }
        }
        catch (error) {
            throw error;
        }
    }

    async getAllUsers() {
        try {
            return await this.userModel.find().select('-password').exec();
        } catch (error) {
            throw error;
        }
    }

}