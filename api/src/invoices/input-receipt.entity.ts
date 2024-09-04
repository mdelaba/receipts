import { Entity, Column } from 'typeorm'

@Entity()
export class InputReceipt {

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