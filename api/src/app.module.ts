import { Module, ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_PIPE } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './invoices/invoice.entity';
import { User } from './users/user.entity';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
const cookieSession = require('cookie-session');

@Module({
  imports: [UsersModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Invoice],
      synchronize: true, //when true, automatically modifies the database so that all the properties inside the associate Entity are also in the table and vice versa. this could cause whole columns to be lost if the Entity file is modified, so use synchronize=false in a production environment. synchronize=true during development is very useful.
    }),
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
    EmailService
  ],
})
export class AppModule {
  constructor() { }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({
      keys: ['ajsdklfjksd'] //this key is used to encrypt cookies. if hacker gets this key, they can modify their own cookies
    })).forRoutes('*');
  }
}
