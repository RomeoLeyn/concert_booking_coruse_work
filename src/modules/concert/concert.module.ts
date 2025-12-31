import { Module } from '@nestjs/common';
import { ConcertService } from './concert.service';
import { ConcertController } from './concert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concert } from './entity/concert.entity';
import { ArtistModule } from '../artist/artist.module';
import { VenueModule } from '../venue/venue.module';
import { TicketModule } from '../ticket/ticket.module';
import { Ticket } from '../ticket/entity/ticket.entity';
import { MapperModule } from 'src/common/mapper/mapper.module';

@Module({
  imports: [TypeOrmModule.forFeature([Concert, Ticket]), ArtistModule, VenueModule, TicketModule, MapperModule],
  controllers: [ConcertController],
  providers: [ConcertService],
  exports: [ConcertService]
})
export class ConcertModule { }
