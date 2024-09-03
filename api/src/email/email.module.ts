import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'mattaman1234@gmail.com',
          pass: 'hllb flfm spky vuxr',
        }
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
      template: {
        dir: join(process.cwd(), 'src', 'email', 'templates'),
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    })
  ],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule { }
