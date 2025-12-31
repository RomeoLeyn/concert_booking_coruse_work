import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Venue } from './entity/venue.entity';
import { Repository } from 'typeorm';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';

@Injectable()
export class VenueService {
    constructor(
        @InjectRepository(Venue)
        private readonly venueRepository: Repository<Venue>
    ) { }

    async create(createVenueDto: CreateVenueDto) {
        try {
            const venue = this.venueRepository.create({
                name: createVenueDto.name,
                address: createVenueDto.address,
                capacity: createVenueDto.capacity
            });

            return await this.venueRepository.save(venue);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async update(id: number, updateVenueDto: UpdateVenueDto) {
        try {
            const venue = await this.findById(id);

            if (!venue) {
                throw new NotFoundException('Venue not found');
            }

            return this.venueRepository.update(id, updateVenueDto);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async getVenues() {
        try {
            return this.venueRepository.find();
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async findById(id: number) {
        try {
            const venue = await this.venueRepository.findOne({
                where: { id }
            });

            if (!venue) {
                throw new NotFoundException('Artist not found');
            }

            return venue;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async delete(id: number) {
        try {
            return this.venueRepository.delete(id)
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
