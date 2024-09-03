import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'

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