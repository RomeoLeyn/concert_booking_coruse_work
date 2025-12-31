import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { BookingModule } from './modules/booking/booking.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './common/configs/db.config';
import { ConcertModule } from './modules/concert/concert.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { ArtistModule } from './modules/artist/artist.module';
import { VenueModule } from './modules/venue/venue.module';
import { PaymentModule } from './modules/payment/payment.module';
import { MapperModule } from './common/mapper/mapper.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    BookingModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      useFactory: dbConfig,
      inject: [ConfigService],
    }),
    ConcertModule,
    TicketModule,
    ArtistModule,
    VenueModule,
    PaymentModule,
    MapperModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
