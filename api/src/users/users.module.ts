import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { GenerateTokenMiddleware } from './middleware/generate-token.middleware';
import { EmailService } from 'src/email/email.service';
import { ReceiptService } from 'src/invoices/receipt.service';
import { Receipt } from 'src/invoices/receipt.entity';
import { CreateReceiptService } from 'src/invoices/create-receipt';
import { UploadReceipt } from 'src/invoices/upload-receipt.entity';
import { AzureService } from 'src/azure/azure/azure.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Receipt, UploadReceipt])],
    controllers: [UsersController],
    providers: [UsersService, ReceiptService, CreateReceiptService, EmailService, AzureService],
})
export class UsersModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(GenerateTokenMiddleware).forRoutes('*');
    }
}
