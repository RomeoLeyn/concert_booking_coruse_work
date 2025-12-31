import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './entity/artist.entity';
import { Repository } from 'typeorm';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistService {
    constructor(
        @InjectRepository(Artist)
        private readonly artistRepository: Repository<Artist>
    ) { }

    async create(createArtistDto: CreateArtistDto) {
        const artist = this.artistRepository.create({
            name: createArtistDto.name,
            genre: createArtistDto.genre,
            description: createArtistDto.description
        });

        return await this.artistRepository.save(artist);
    }

    async update(id: number, updateArtistDto: UpdateArtistDto) {
        console.log(id);
        const artist = await this.artistRepository.preload({ id, ...updateArtistDto });
        console.log(artist);
        if (!artist) {
            throw new NotFoundException('Artist not found');
        }
        return await this.artistRepository.save(artist);
    }

    async getArtists() {
        return this.artistRepository.find();
    }

    async findById(id: number) {
        const artist = await this.artistRepository.findOne({
            where: { id }
        });

        if (!artist) {
            throw new NotFoundException('Artist not found');
        }

        return artist;
    }

    async delete(id: number) {
        return this.artistRepository.delete(id)
    }
}
