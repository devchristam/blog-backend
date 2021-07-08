import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { CataloguesModule } from './catalogues/catalogues.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION),
    PostsModule,
    UsersModule,
    CataloguesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
