import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtAuthService } from 'src/common/jwt/jwt.service';
import { LoginDto } from '../../dto/login.dto';
import { CreateUserDto } from '../../dto/createUser.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtAuthService: JwtAuthService,
    ) { }

    async register(registerDto: CreateUserDto): Promise<any> {
        try {
            const user = await this.userService.createUser(registerDto);
            const token = this.jwtAuthService.signToken({ id: user._id, email: user.email });
            return {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token: token,
            };
        } catch (error) {
            throw error;
        }
    }

    async login(loginDto: LoginDto): Promise<any> {
        try {
            const user = await this.userService.validateUser(loginDto.email, loginDto.password);
            const token = this.jwtAuthService.signToken({ id: user._id, email: user.email });
            return {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profileImage: user.profileImage
                },
                token: token,
            };
        } catch (error) {
            console.log('error', error);
            throw error;
        }
    }
}