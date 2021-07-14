import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { CategoryModule } from './categories/categories.module';
import { AuthMiddleware } from './middlewares/auth/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_CONNECTION'),
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 30000,
        keepAlive: true
      }),
      inject: [ConfigService],
    }),
    PostsModule,
    UsersModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'posts', method: RequestMethod.POST },
        { path: 'posts/:id', method: RequestMethod.PATCH },
        { path: 'posts/:id', method: RequestMethod.DELETE },
        { path: 'users', method: RequestMethod.GET },
        { path: 'users', method: RequestMethod.POST },
        { path: 'users/:id', method: RequestMethod.GET },
        { path: 'users/:id', method: RequestMethod.PATCH },
        { path: 'users/:id', method: RequestMethod.DELETE },
        { path: 'categories', method: RequestMethod.POST },
        { path: 'categories/:id', method: RequestMethod.PATCH },
        { path: 'categories/:id', method: RequestMethod.DELETE },
      );
  }
}
