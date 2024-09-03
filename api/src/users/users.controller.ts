import { Body, Controller, Get, Post, Param, NotFoundException, Session, UseGuards, Res, StreamableFile, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from 'src/dtos/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { InvoiceDto } from 'src/dtos/invoice.dto';
import { Invoice } from '../invoices/invoice.entity';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Serialize } from './interceptors/serialize.interceptor';
import { UserDto } from 'src/dtos/user.dto';
import { EmailService } from 'src/email/email.service';
import { EmailDto } from 'src/dtos/email.dto';

@Controller('/api')
export class UsersController {

    constructor(private usersService: UsersService, private emailService: EmailService) { }

    // @Post('/signup')
    // async createUser(@Body() body: LoginDto, @Session() session: any) {
    //     const user = await this.usersService.signup(body.username, body.password);
    //     session.userId = user.id;
    //     return user;
    // }

    // @Post('/newinvoice')
    // async createInvoice(@Body() body: InvoiceDto) {
    //     const invoice = body as Invoice;
    //     return this.usersService.newInvoice(invoice);
    // }

    @Post('/login')
    @Serialize(UserDto) //Intercepts returned json and allows password to be removed according to SerializeInterceptor class
    async validateLogin(@Body() body: LoginDto, @Session() session: any) {
        const user = await this.usersService.validateLogin(body.username, body.password);
        session.userId = user.id;
        return user.id;
    }

    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null;
    }

    @Get('/download/:id')
    @UseGuards(AuthGuard)
    getInvoice(@Param('id') id: string): StreamableFile {
        if (!parseInt(id)) {
            throw new BadRequestException('user id not found');
        }
        this.usersService.getInvoice(parseInt(id));
        const fileName = 'invoice.pdf';
        const fileStream = createReadStream(join(__dirname, '../..', fileName));
        return new StreamableFile(fileStream, {
            type: 'application/pdf',
            disposition: 'attachment; filename="invoice.pdf"',
        });
    }

    @Post('/email/:id')
    @UseGuards(AuthGuard)
    sendEmail(@Body() body: EmailDto, @Param('id') id: string) {
        if (!parseInt(id)) {
            throw new BadRequestException('user id not found');
        }
        //update invoice.pdf to match this user
        this.usersService.getInvoice(parseInt(id));
        this.emailService.send(body.email);
    }
}
