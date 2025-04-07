import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../auth/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async register(registerDto: CreateUserDto): Promise<any> {
         try {
            const user = await this.userService.createUser(registerDto);
            const token = this.jwtService.sign({ id: user._id, email: user.email });
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
            const token = this.jwtService.sign({ id: user._id, email: user.email });
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
}