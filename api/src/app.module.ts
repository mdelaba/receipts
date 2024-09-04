import { Module, ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_PIPE } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { Receipt } from './invoices/receipt.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AzureService } from './azure/azure/azure.service';
import { UploadReceipt } from './invoices/upload-receipt.entity';
const cookieSession = require('cookie-session');

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env.deployment'
  }), UsersModule,
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      type: 'sqlite',
      // host: 'localhost',
      // port: 3306,
      // username: config.get('DB_USERNAME'),
      // password: config.get('DB_PASSWORD'),
      database: 'azure_upload.sqlite',
      entities: [User, Receipt, UploadReceipt],
      synchronize: true,
    }),
  }),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite',
    //   entities: [User, Receipt],
    //   synchronize: true, //when true, automatically modifies the database so that all the properties inside the associate Entity are also in the table and vice versa. this could cause whole columns to be lost if the Entity file is modified, so use synchronize=false in a production environment. synchronize=true during development is very useful.
    // }),
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true
      })
    },
    EmailService,
    AzureService
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) { }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({
      keys: [this.configService.get('COOKIE_KEY')] //this key is used to encrypt cookies. if hacker gets this key, they can modify their own cookies
    })).forRoutes('*');
  }
}
