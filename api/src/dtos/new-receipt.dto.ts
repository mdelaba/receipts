import { IsDate, IsNumber, IsString } from 'class-validator';

export class NewReceiptDto {
    @IsString()
    date: string;

    @IsString()
    customerName: string;

    @IsString()
    paymentMethod: string;

    @IsString()
    amount: string;

    @IsString()
    address: string;
}