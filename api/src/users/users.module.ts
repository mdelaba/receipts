import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { InvoiceService } from 'src/invoices/invoice.service';
import { User } from './user.entity';
import { Invoice } from '../invoices/invoice.entity';
import { UsersController } from './users.controller';
import { GenerateTokenMiddleware } from './middleware/generate-token.middleware';
import { EmailService } from 'src/email/email.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Invoice])],
    controllers: [UsersController],
    providers: [UsersService, InvoiceService, EmailService],
})
export class UsersModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(GenerateTokenMiddleware).forRoutes('*');
    }
}
