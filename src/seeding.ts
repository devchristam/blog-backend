import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = await app.get(UsersService);
  console.log(await usersService.seeding());
  await app.close();
}
bootstrap();
