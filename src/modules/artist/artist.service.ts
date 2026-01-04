import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './entity/artist.entity';
import { In, Repository } from 'typeorm';
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

    async findByIds(ids: number[]) {

        const artists = await this.artistRepository.findBy({
            id: In(ids),
        });

        if (artists.length !== ids.length) {
            throw new NotFoundException('One or more artists not found');
        }

        return artists;
    }

    async delete(id: number) {
        return this.artistRepository.delete(id)
    }
}
