import { Injectable } from "@nestjs/common";
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { Invoice } from "./invoice.entity";

@Injectable()
export class InvoiceService {
    constructor(@InjectRepository(Invoice) private invoiceRepo: Repository<Invoice>) { }

    async find(userId: number) {
        if (!userId) {
            return null;
        }
        return this.invoiceRepo.findOneBy({ userId });
    }

    create(invoiceData: Invoice) {
        const invoice = this.invoiceRepo.create(invoiceData);

        return this.invoiceRepo.save(invoice);
    }
}