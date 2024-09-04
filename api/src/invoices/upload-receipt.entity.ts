import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class UploadReceipt {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    receipt_id: number;

    @Column()
    local_url: string;

    @Column()
    azure_url: string;
}