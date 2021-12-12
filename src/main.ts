import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { UnauthorizedException, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const whitelist = JSON.parse(process.env.WHITELIST ?? '[]');
  app.enableCors({
    origin: function (origin, callback) {
      const allowCondition =
        process.env.ENVIRONMENT === 'PRODUCTION'
          ? whitelist.indexOf(origin) !== -1
          : whitelist.indexOf(origin) !== -1 || !origin;
      if (allowCondition) {
        callback(null, true);
      } else {
        callback(new UnauthorizedException());
      }
    },
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Authorization',
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS,PATCH',
    credentials: true,
  });
  app.use(helmet());

  if (process.env.ENVIRONMENT !== 'PRODUCTION') {
    const config = new DocumentBuilder()
      .setTitle('Blog Backend')
      .setDescription('the backend for the blog system')
      .setVersion('1.0')
      .addTag('blog')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  app.useGlobalGuards();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      skipMissingProperties: true,
    }),
  );
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? '3000');
}
bootstrap();
