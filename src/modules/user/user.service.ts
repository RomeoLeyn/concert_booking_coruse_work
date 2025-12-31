import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/common/constants/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDto) {
        const newUser = this.userRepository.create({
            name: createUserDto.name,
            email: createUserDto.email,
            password: bcrypt.hashSync(createUserDto.password, SALT_ROUNDS),
        });

        return this.userRepository.save(newUser);

    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const user = await this.findByid(id);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return await this.userRepository.update(id, updateUserDto);
    }

    /**
     * Finds user by email.
     * 
     * NOTE:
     * Password is selected intentionally for authentication (login).
     * This method must not be used to return user data to clients.
     */
    async findByEmailWithPassword(email: string) {
        const user = await this.userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'name', 'password', 'role'],
        });

        return user;
    }

    async findByid(id: number) {
        const user = await this.userRepository.findOne({
            where: { id }
        });

        return user;
    }

    async sumTotalUsersorders() {

    }
}
