import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Receipt {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: string;

    @Column()
    customerName: string;

    @Column()
    paymentMethod: string;

    @Column()
    amount: number;

    @Column()
    address: string;
}