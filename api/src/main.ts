import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
const cors = require('cors');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // app.enableCors();
  app.use(cors({
    origin: configService.get<string>('ORIGIN'),
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'], // Add other headers if needed
    exposedHeaders: ['Set-Cookie'] // Expose the Set-Cookie header
  }));
  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
