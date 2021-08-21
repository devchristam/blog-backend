import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Category, CategorySchema } from '../categories/schemas/category.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Post.name, schema: PostSchema },
    { name: User.name, schema: UserSchema },
    { name: Category.name, schema: CategorySchema }
  ]),
    AuthModule
  ],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule { }
