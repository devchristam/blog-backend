import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './schemas/post.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Category, CategoryDocument } from '../categories/schemas/category.schema';
import { AuthService } from '../auth/auth.service';
import { jwtUser } from '../auth/dto/jwtUser.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private readonly authService: AuthService
  ) { }

  create(user: jwtUser, createPostDto: CreatePostDto) {
    // This action adds a new post
    let createPost = {
      ...createPostDto,
      createBy: user.id
    }
    const createdPost = new this.postModel(createPost);
    return createdPost.save();
  }

  findAll() {
    // This action returns all posts
    return this.postModel.find().exec()
  }

  findOne(id: string) {
    // This action returns a ${id} post
    return this.postModel.findById(id)
  }

  update(id: string, user: jwtUser, updatePostDto: UpdatePostDto) {
    // This action updates a ${id} post
    return this.postModel.findByIdAndUpdate(id, updatePostDto, { useFindAndModify: false })
  }

  remove(id: string) {
    // This action removes a ${id} post
    return this.postModel.findByIdAndRemove(id, { useFindAndModify: false })
  }
}
