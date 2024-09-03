import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InvoiceService } from 'src/invoices/invoice.service';
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from './user.entity';
import { Invoice } from '../invoices/invoice.entity';
import { createInvoice } from 'src/invoices/create-invoice';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private userRepo: Repository<User>, private invoiceService: InvoiceService) { }

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

    async getInvoice(userId: number) {
        const invoice = await this.invoiceService.find(userId);

        const fileName = 'invoice.pdf';

        if (!invoice) {
            throw new NotFoundException('invoice not found');
        }

        createInvoice(invoice, fileName);

        return invoice;
    }

    newInvoice(invoice: Invoice) {
        return this.invoiceService.create(invoice);
    }
}
