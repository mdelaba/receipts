import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // MailerModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     transport: {
    //       host: configService.get<string>('SMTP_SERVER'),
    //       port: configService.get<number>('SMTP_PORT'),
    //       secure: false,
    //       auth: {
    //         user: configService.get<string>('EMAIL'),
    //         pass: configService.get<string>('APP_PASSWORD'),
    //       }
    //     },
    //     defaults: {
    //       from: '"No Reply" <noreply@example.com>',
    //     },
    //     template: {
    //       dir: join(process.cwd(), 'src', 'email', 'templates'),
    //       adapter: new PugAdapter(),
    //       options: {
    //         strict: true,
    //       },
    //     },
    //   }),
    // })
  ],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule { }
