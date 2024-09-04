import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from './user.entity';
import { createInvoice } from 'src/invoices/create-invoice';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { ReceiptService } from 'src/invoices/receipt.service';
import { InputReceipt } from 'src/invoices/input-receipt.entity';
import { join } from 'path';
import { CreateReceiptService } from 'src/invoices/create-receipt';
import { UploadReceipt } from 'src/invoices/upload-receipt.entity';
const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private userRepo: Repository<User>, @InjectRepository(UploadReceipt) private uploadRepo: Repository<UploadReceipt>, private receiptService: ReceiptService, private createReceiptService: CreateReceiptService) { }

    async signup(username: string, password: string) {

        //Hash user's password
        //Generate a salt
        const salt = randomBytes(8).toString('hex');

        //Hash the salt and the password together
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        //Join the hashed result and the salt together
        const result = salt + '.' + hash.toString('hex');

        //Create new user and save it
        const user = this.userRepo.create({ username, password: result });

        return this.userRepo.save(user);
    }

    async validateLogin(username: string, password: string) {
        const [user] = await this.userRepo.find({ where: { username } });
        if (!user) {
            throw new NotFoundException('user not found');
        }

        const [salt, storedHash] = user.password.split('.');

        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('bad password');
        }

        return user;
    }

    fetchUser(id: number) {
        return this.userRepo.findOneBy({ id });
    }

    async getInvoice(id: number) {
        const invoice = await this.receiptService.find(id);

        const fileName = 'invoice.pdf';

        if (!invoice) {
            throw new NotFoundException('invoice not found');
        }

        createInvoice(invoice, fileName);

        return invoice;
    }

    newReceipt(receiptData: InputReceipt) {
        return this.receiptService.create(receiptData);
    }

    async createReceipts() {
        const receipts = await this.receiptService.getAllReceipts();

        for (const receipt of receipts) {
            const path = join(process.cwd(), 'receipts', `${receipt.id}.pdf`);
            await this.createReceiptService.createReceipt(receipt, path);
        }
        return receipts;
    }

    async uploadReceipts(receipt_id: number, azure_file: string, local_file: string) {
        await this.uploadRepo.save({ receipt_id: receipt_id, azure_url: azure_file, local_url: local_file });
    }

    async getReceipts() {
        return this.uploadRepo.find();
    }

    async getReceipt(id: number) {
        return await this.uploadRepo.findOne({ where: { receipt_id: id } });
    }
}
