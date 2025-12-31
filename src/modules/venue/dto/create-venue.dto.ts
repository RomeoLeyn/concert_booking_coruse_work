import { IsNotEmpty, IsNumber, IsString, Length, Max, Min } from "class-validator";

export class CreateVenueDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    name: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 200)
    address: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Max(5000)
    capacity: number;
}