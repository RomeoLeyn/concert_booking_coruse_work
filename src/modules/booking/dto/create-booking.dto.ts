import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNumber } from "class-validator";

export class CreateBookingDto {
    @IsArray()
    @ArrayNotEmpty()
    @Type(() => Number)
    ids: number[];

    @IsNumber()
    userId: number;
}