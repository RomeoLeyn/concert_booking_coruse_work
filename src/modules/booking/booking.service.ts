import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly mapperService: MapperService,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    const tickets = await this.ticketService.findTicketsByIds(
      createBookingDto.ids,
    );

    if (tickets.length !== createBookingDto.ids.length) {
      throw new BadRequestException('Some tickets do not exist');
    }

    for (const ticket of tickets) {
      if (ticket.status !== TicketStatus.AVAILABLE) {
        throw new BadRequestException(
          `Ticket seat ${ticket.seat} is not available`,
        );
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
        paymentStatus: PaymentStatus.PENDING,
      });

      const createdBooking = await this.bookingRepositroy.save(booking);

      await this.ticketService.updateTicketsStatusAndAddedBooking(
        createBookingDto.ids,
        createdBooking.id,
      );
      return createdBooking;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

//   async getBookingById(id: number): Promise<ResponseBookingDto> {
//     const booking = await this.bookingRepositroy.findOne({
//       where: {
//         id,
//       },
//       relations: {
//         user: true,
//         payment: true,
//       },
//     });

//     if (!booking) {
//       throw new NotFoundException('Booking not found');
//     }

//     const tickets = await this.ticketService.findTicketsByBookingId(booking.id);

//     if (!tickets.length) {
//       throw new NotFoundException('Tocket not found');
//     }

//     const totalAmount = tickets.reduce((sum, t) => sum + Number(t.price), 0);

//     return this.mapperService.toDto(ResponseBookingDto, booking, {
//       tickets,
//       totalAmount,
//       concertId: tickets[0].concert.id,
//       concert: tickets[0].concert,
//       status: booking.paymentStatus,
//     });
//   }

  async getBookingById(id: number) {
    const bookingsRows = await this.bookingRepositroy
      .createQueryBuilder('booking')
      .leftJoin('booking.user', 'user')
      .leftJoin('booking.payment', 'payment')
      .leftJoin('booking.tickets', 'ticket')
      .leftJoinAndSelect('ticket.concerts', 'concert')
      .select([
        'user.id AS user_id',
        'user.name AS user_name',
        'user.email AS user_email',
        'user.role AS user_role',

        'booking.id AS booking_id',
        'booking.bookingDate AS booking_date',
        'booking.paymentStatus AS payment_status',

        'concert.id AS concert_id',
        'concert.title AS concert_title',
        'concert.date AS concert_date',

        'payment.status AS status',
        'payment.paymentMethod AS payment_method',

        'SUM(ticket.price) AS total_amount',
      ])
      .where('booking.id = :id', { id })
      .groupBy('booking.id')
      .addGroupBy('user.id')
      .addGroupBy('concert.id')
      .addGroupBy('payment.id')
      .getRawMany();

      return bookingsRows.map((row) => ({
      id: row.booking_id,
      bookingDate: row.booking_date,
      paymentStatus: row.payment_status,
      totalAmount: Number(row.total_amount),
      user: {
        id: row.user_id,
        name: row.user_name,
        email: row.user_email,
        role: row.user_role,
      },
      concert: {
        id: row.concert_id,
        title: row.concert_title,
        date: row.concert_date,
      },
      payment: {
        status: row.payment_status,
        method: row.payment_method,
      },
    }));
  }

  async geAllUserBookings(userId: number) {
    const bookingsRows = await this.bookingRepositroy
      .createQueryBuilder('booking')
      .leftJoin('booking.user', 'user')
      .leftJoin('booking.tickets', 'ticket')
      .leftJoinAndSelect('ticket.concert', 'concert')
      .leftJoin('booking.payment', 'payment')
      .select([
        'user.id AS user_id',
        'user.name AS user_name',
        'user.email AS user_email',
        'user.role AS user_role',

        'booking.id AS booking_id',
        'booking.bookingDate AS booking_date',
        'booking.paymentStatus AS payment_status',

        'concert.id AS concert_id',
        'concert.title AS concert_title',
        'concert.date AS concert_date',

        'payment.status AS payment_status',
        'payment.paymentMethod AS payment_method',

        'SUM(ticket.price) AS total_amount',
      ])
      .where('user.id = :userId', { userId })
      .groupBy('booking.id')
      .addGroupBy('concert.id')
      .addGroupBy('payment.id')
      .addGroupBy('user.id')
      .getRawMany();

    return bookingsRows.map((row) => ({
      id: row.booking_id,
      bookingDate: row.booking_date,
      paymentStatus: row.payment_status,
      totalAmount: Number(row.total_amount),
      user: {
        id: row.user_id,
        name: row.user_name,
        email: row.user_email,
        role: row.user_role,
      },
      concert: {
        id: row.concert_id,
        title: row.concert_title,
        date: row.concert_date,
      },
      payment: {
        status: row.payment_status,
        method: row.payment_method,
      },
    }));
  }

  async calculateUsersOrdersTotal(userId: number) {
    const bookings = await this.bookingRepositroy.query(
      `
            SELECT
                user_id,
                SUM(payments.amount)
            FROM bookings
            JOIN payments ON bookings.id = payments.booking_id
            WHERE user_id=${userId}
            GROUP BY user_id;
            `,
    );
    return bookings;
  }
}
