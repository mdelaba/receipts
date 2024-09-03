import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cors = require('cors');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors();
  app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'], // Add other headers if needed
    exposedHeaders: ['Set-Cookie'] // Expose the Set-Cookie header
  }));
  await app.listen(3000);
}
bootstrap();
