import { IsNumber, IsString } from 'class-validator';

export class InvoiceDto {
    @IsNumber()
    userId: number;

    @IsNumber()
    amount: number;

    @IsString()
    date: string;

    @IsString()
    purpose: string;
}