import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { join } from 'path';
import { Resend } from 'resend';
import * as handlebars from 'handlebars';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {

    private transporter: nodemailer.Transporter;
    private confirmationTemplate: handlebars.TemplateDelegate;
    private passwordResetTemplate: handlebars.TemplateDelegate;
    private groupInviteTemplate: handlebars.TemplateDelegate;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport(
            {
                host: configService.get<string>('SMTP_SERVER'),
                port: configService.get<number>('SMTP_PORT'),
                secure: process.env.MAILER_SECURE === 'true',
                auth: {
                    user: configService.get<string>('EMAIL'),
                    pass: configService.get<string>('APP_PASSWORD'),
                },
            },
            {
                from: {
                    name: 'No-reply',
                    address: configService.get<string>('EMAIL'),
                },
            },
        );

        // Load Handlebars templates
        this.confirmationTemplate = this.loadTemplate('confirmation.hbs');
    }

    private loadTemplate(templateName: string): handlebars.TemplateDelegate {
        const templatesFolderPath = path.join(process.cwd(), 'src', 'email', 'templates');
        const templatePath = path.join(templatesFolderPath, templateName);

        const templateSource = fs.readFileSync(templatePath, 'utf8');
        return handlebars.compile(templateSource);
    }

    async send(address: string) {
        // const url = `${process.env.CLIENT_URL}?token=${token}`;
        const html = this.confirmationTemplate({});

        const attachmentPath = path.join(process.cwd(), 'receipts', '1.pdf');

        const attachments = [
            {
                filename: path.basename(attachmentPath),
                path: attachmentPath,
            },
        ];

        await this.transporter.sendMail({
            to: address,
            subject: 'Welcome user! Confirm your Email',
            html: html,
            attachments: attachments,
        });

        console.log('sent email');
    }

    // async send(email: string) {

    //     await this.mailerService.sendMail({
    //         to: email,
    //         subject: 'Welcome to My App! Confirm your Email',
    //         template: './confirmation', // `.pug` extension is appended automatically
    //         context: { // Data to be sent to template engine
    //             name: 'Sir/Madam',
    //         },
    //         attachments: [
    //             {
    //                 filename: 'invoice.pdf',
    //                 path: join(process.cwd(), 'invoice.pdf'), // Path to the file on disk
    //                 contentType: 'application/pdf',
    //             },
    //         ],
    //     });
    // }

    // async send(address: string) {
    //     const resend = new Resend(this.configService.get('RESEND_KEY'));
    //     const { data, error } = await resend.emails.send({
    //         from: 'onboarding@resend.dev',
    //         to: address,
    //         subject: 'Hello World',
    //         html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
    //     });
    //     if (error) {
    //         return console.error({ error });
    //     }
    //     console.log({ data });
    // }
}
