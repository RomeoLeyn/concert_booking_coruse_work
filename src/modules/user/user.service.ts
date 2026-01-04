import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/common/constants/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { BookingService } from '../booking/booking.service';
import { ResponseBookingDto } from '../booking/dto/response-booking.dto';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(forwardRef(() => BookingService))
        private readonly bookingService: BookingService
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

    // Example method
    async sumUsersOrders() {
        const users = await this.userRepository.find();

        const nestedBookings = await Promise.all(users.map(async (u) => await this.bookingService.geAllUserBookings(u.id)));
        const allUsersBookings = nestedBookings.flat();

        const statsMap = new Map<number, { name: string; orderSum: number }>();

        for (const booking of allUsersBookings) {
            const existingUser = statsMap.get(+booking.id)
            if (existingUser) {
                existingUser.orderSum += booking.totalAmount
            } else {
                statsMap.set(+booking.user.id, {
                    name: booking.user.name,
                    orderSum: booking.totalAmount
                });
            }
        };
        return statsMap;
    }
}
