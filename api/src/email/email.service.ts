import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';

@Injectable()
export class EmailService {

    constructor(private mailerService: MailerService) { }

    async send(email: string) {

        await this.mailerService.sendMail({
            to: email,
            subject: 'Welcome to My App! Confirm your Email',
            template: './confirmation', // `.pug` extension is appended automatically
            context: { // Data to be sent to template engine
                name: 'Sir/Madam',
            },
            attachments: [
                {
                    filename: 'invoice.pdf',
                    path: join(process.cwd(), 'invoice.pdf'), // Path to the file on disk
                    contentType: 'application/pdf',
                },
            ],
        });
    }
}
