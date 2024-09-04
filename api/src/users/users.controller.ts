import { Body, Controller, Get, Post, Param, Session, UseGuards, StreamableFile, BadRequestException, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from 'src/dtos/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Serialize } from './interceptors/serialize.interceptor';
import { UserDto } from 'src/dtos/user.dto';
import { EmailService } from 'src/email/email.service';
import { EmailDto } from 'src/dtos/email.dto';
import { NewReceiptDto } from 'src/dtos/new-receipt.dto';
import { Receipt } from 'src/invoices/receipt.entity';
import { InputReceipt } from 'src/invoices/input-receipt.entity';
import { AzureService } from 'src/azure/azure/azure.service';
import { Response } from 'express';
const fs = require('fs');

@Controller('/api')
export class UsersController {

    constructor(private usersService: UsersService, private emailService: EmailService, private azureService: AzureService) { }

    @Post('/signup')
    async createUser(@Body() body: LoginDto, @Session() session: any) {
        const user = await this.usersService.signup(body.username, body.password);
        session.userId = user.id;
        return user;
    }

    // @Post('/newinvoice')
    // async createInvoice(@Body() body: InvoiceDto) {
    //     const invoice = body as Invoice;
    //     return this.usersService.newInvoice(invoice);
    // }

    @Post('/create-receipts')
    async createReceipts() {
        return this.usersService.createReceipts();
    }

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

    @Post('/input')
    // @UseGuards(AuthGuard)
    async postInvoice(@Body() body: NewReceiptDto) {
        const receipt = { ...body, amount: parseFloat(body.amount) } as InputReceipt;
        return this.usersService.newReceipt(receipt);
    }

    @Get('/num-receipts')
    //@UseGuards(AuthGuard)
    async getNumIOInvoices(): Promise<number> {
        const receipts = await this.usersService.createReceipts();
        this.uploadReceipts(receipts);
        return receipts.length;
    }

    @Get('/receipts/:id')
    // @UseGuards(AuthGuard)
    async fetchReceipt(@Param('id') id: string, @Res() res: Response) {
        const containerName = 'receiptupload';
        const receiptsFolderPath = join(process.cwd(), 'receipts');
        const uploadedReceipt = await this.usersService.getReceipt(parseInt(id));
        const file = uploadedReceipt.azure_url.split(`${containerName}/`)[1];
        console.log(`Fetching receipt ${file} from cloud storage`);
        const fileBuffer = await this.azureService.downloadFile(file, containerName, receiptsFolderPath);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=receipt.pdf`,
        });
        res.send(fileBuffer);
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

    async uploadReceipts(receipts: Receipt[]) {
        const containerName = 'receiptupload';
        const receiptsFolderPath = join(process.cwd(), 'receipts');

        const uploadedReceipts = await this.usersService.getReceipts();

        // const files = fs.readdirSync(receiptsFolderPath);
        // // Listing all files using forEach
        // files.forEach((file: string) => {
        //     const path = join(receiptsFolderPath, file);
        //     filePaths.push(path);
        // });
        // loop through receipts in local folder

        // const upload = await this.azureService.uploadFile(join(receiptsFolderPath, 'newreceipt.pdf'), containerName);
        // this.usersService.uploadReceipts(1, upload, join(receiptsFolderPath, 'newreceipt.pdf'));

        receipts.forEach(async receipt => {
            const receiptPath = join(receiptsFolderPath, `${receipt.id}.pdf`);
            let alreadyUploaded = false;
            //check if file is already uploaded
            for (const r of uploadedReceipts) {
                if (r.receipt_id === receipt.id) {
                    alreadyUploaded = true;
                    console.log(`already uploaded ${receipt.id}`);
                    return;
                }
            }
            if (!alreadyUploaded) {
                console.log(`uploading ${receiptPath}`);
                //wait for receipt file to exist 
                await new Promise<void>((resolve, reject) => {
                    fs.watch(receiptPath, (eventType) => {
                        if (eventType === 'change') {
                            resolve();
                        }
                    });
                });
                const upload = await this.azureService.uploadFile(receiptPath, containerName);
                this.usersService.uploadReceipts(receipt.id, upload, receiptPath);
            }
        });
    }
}
