import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entity/booking.entity';
import { Repository } from 'typeorm';
import { TicketService } from '../ticket/ticket.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { TicketStatus } from 'src/common/enums/ticket-status.enum';
import { PaymentStatus } from 'src/common/enums/payment-status.enum';
import { UserService } from '../user/user.service';
import { ResponseBookingDto } from './dto/response-booking.dto';
import { MapperService } from 'src/common/mapper/mapper.service';

@Injectable()
export class BookingService {
    constructor(
        @InjectRepository(Booking)
        private readonly bookingRepositroy: Repository<Booking>,
        private readonly ticketService: TicketService,
        private readonly userService: UserService,
        private readonly mapperService: MapperService,
    ) { }

    async create(createBookingDto: CreateBookingDto) {
        const tickets = await this.ticketService.findTicketsByIds(createBookingDto.ids);

        if (tickets.length !== createBookingDto.ids.length) {
            throw new BadRequestException('Some tickets do not exist');
        }

        for (const ticket of tickets) {
            if (ticket.status !== TicketStatus.AVAILABLE) {
                throw new BadRequestException(`Ticket seat ${ticket.seat} is not available`);
            }
        }

        const user = await this.userService.findByid(createBookingDto.userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }
        try {
            const booking = this.bookingRepositroy.create({
                user: { id: user.id },
                bookingDate: new Date(),
                paymentStatus: PaymentStatus.PENDING
            });

            const createdBooking = await this.bookingRepositroy.save(booking);

            await this.ticketService.updateTicketsStatusAndAddedBooking(createBookingDto.ids, createdBooking.id);
            return createdBooking;
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }

    async getBookingById(id: number): Promise<ResponseBookingDto> {
        const booking = await this.bookingRepositroy.findOne({
            where: {
                id
            },
            relations: {
                user: true,
                payment: true
            }
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        const tickets = await this.ticketService.findTicketsByBookingId(booking.id);

        if (!tickets.length) {
            throw new NotFoundException('Tocket not found');
        }

        const totalAmount = tickets.reduce((sum, t) => sum + Number(t.price), 0);

        return this.mapperService.toDto(ResponseBookingDto, booking,
            {
                tickets,
                totalAmount,
                concertId: tickets[0].concert.id,
                concert: tickets[0].concert,
                status: booking.paymentStatus,
            });
    }

    async getUserBookings(userId: number): Promise<ResponseBookingDto[]> {
        const bookings = await this.bookingRepositroy.find({
            where: { user: { id: userId } },
            relations: {
                user: true,
                payment: true
            }
        });

        if (!bookings) {
            throw new NotFoundException('Booking not found');
        }

        const allBookingsWithTickets = await Promise.all(
            bookings.map(async (booking) => {
                const tickets = await this.ticketService.findTicketsByBookingId(booking.id);

                const totalAmount = tickets.reduce((sum, t) => sum + Number(t.price), 0);

                return this.mapperService.toDto(
                    ResponseBookingDto,
                    booking,
                    {
                        tickets,
                        totalAmount,
                        concertId: tickets[0]?.concert?.id,
                        concert: tickets[0]?.concert,
                        status: booking.paymentStatus
                    }
                );
            })
        );

        return allBookingsWithTickets;
    }
} 
