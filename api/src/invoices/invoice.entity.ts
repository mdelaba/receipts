import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Invoice {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    amount: number;

    @Column()
    date: string;

    @Column()
    purpose: string;
}