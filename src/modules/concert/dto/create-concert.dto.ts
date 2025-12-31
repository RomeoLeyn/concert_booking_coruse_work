import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Max, Min } from "class-validator";

export class CreateConcertDto {
    @IsString()
    @Length(1, 150)
    @IsNotEmpty()
    title: string;

    @IsDate()
    @IsNotEmpty()
    date: Date;

    @IsString()
    @IsNotEmpty()
    time: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Max(1000000)
    price: number;

    @IsString()
    @IsNotEmpty()
    @Length(1, 150)
    location: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 200)
    description: string;

    @IsString()
    @IsNotEmpty()
    imageUrl: string;

    @IsNumber()
    @IsNotEmpty()
    artistId: number;

    @IsNumber()
    @IsNotEmpty()
    venueId: number;
}