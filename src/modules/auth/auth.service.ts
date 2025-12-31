import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entity/user.entity';
import { LoginUserDto } from '../user/dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { MapperService } from 'src/common/mapper/mapper.service';
import { ResponseUserDto } from '../user/dto/response-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly mapperService: MapperService,
    ) { }

    async register(createUserDto: CreateUserDto) {
        const existing = await this.userService.findByEmailWithPassword(createUserDto.email);

        if (existing) {
            throw new ConflictException('User already exist');
        }

        const user = await this.userService.create(createUserDto);
        const token = this.generateToken(user);
        const safeUser = this.mapperService.toDto(ResponseUserDto, user);

        return { safeUser, token };
    }

    async login(loginUserDto: LoginUserDto) {
        const user = await this.userService.findByEmailWithPassword(loginUserDto.email);

        if (!user) {
            throw new UnauthorizedException('Email or passwod inncorect');
        }

        const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Email or passwod inncorect');
        }

        const token = this.generateToken(user);
        const safeUser = this.mapperService.toDto(ResponseUserDto, user);

        return { safeUser, token };
    }

    private generateToken(user: User) {
        const payload = { id: user.id, email: user.email, role: user.role };
        return this.jwtService.sign(payload);
    }
}
