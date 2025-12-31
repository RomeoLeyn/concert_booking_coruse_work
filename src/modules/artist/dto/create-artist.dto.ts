import { IsEnum, IsNotEmpty, IsString, Length } from "class-validator";
import { Genre } from "src/common/enums/genre.enum";

export class CreateArtistDto {
    @IsString()
    @Length(1, 100)
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEnum(Genre)
    genre: Genre;

    @IsString()
    @Length(1, 100)
    @IsNotEmpty()
    description: string
}