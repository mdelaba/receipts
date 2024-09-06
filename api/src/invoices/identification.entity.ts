import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Identification {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    azure_url: string;
}