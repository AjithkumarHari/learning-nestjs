import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { UpdateUserDto } from 'src/dto/updateUser.dto';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    async createUser(createUserDto: CreateUserDto) {
        try {
            const existingUser = await this.userModel.findOne({ email: createUserDto.email });
            if (existingUser) {
                throw new Error('Email already exists');
            } else {
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
            }
            const isMatch = await bcrypt.compare(password, existingUser.password);
            if (!isMatch) {
                throw new Error('Invalid password');
            }
            if (!existingUser.isActive) {
                return {
                    message: 'User not activated',
                    existingUser,
                };
            }
            return {
                message: 'User logged in successfully',
                existingUser,
            };
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

    async getUserByEmail(email: string) {
        try {
            return await this.userModel.findOne({email}).select('-password').exec();
        } catch (error) {
            throw error;
        }
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        try {
            const user = await this.userModel.findById(id);
            if (!user) throw new Error('User not found');

            if (updateUserDto.profileImage) {
                const { secure_url } = await this.cloudinaryService.uploadImage(updateUserDto.profileImage);
                updateUserDto.profileImage = secure_url;
            }

            if (updateUserDto.password) {
                updateUserDto.password = await bcrypt.hash(updateUserDto.password, 16);
            }

            const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).select('-password').exec();
            if (!updatedUser) throw new Error('User update failed');

            const { _id, name, email, profileImage } = updatedUser;
            return { id: _id, name, email, profileImage };

        } catch (error) {
            throw error;
        }
    }

    async activateUser(email: string) {
        try {
            const user = await this.userModel.findOne({ email });
            if (!user) throw new Error('User not found');
            user.isActive = true;
            return await user.save();
        } catch (error) {
            throw error;
        }
    }
}