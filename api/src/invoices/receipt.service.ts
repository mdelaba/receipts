import { Injectable } from "@nestjs/common";
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { Receipt } from "./receipt.entity";
import { InputReceipt } from "./input-receipt.entity";

@Injectable()
export class ReceiptService {
    constructor(@InjectRepository(Receipt) private receiptRepo: Repository<Receipt>) { }

    async find(id: number) {
        if (!id) {
            return null;
        }
        return this.receiptRepo.findOneBy({ id });
    }

    create(receiptData: InputReceipt) {
        const invoice = this.receiptRepo.create(receiptData);

        return this.receiptRepo.save(invoice);
    }

    async getAllReceipts() {
        return this.receiptRepo.find();
    }
}