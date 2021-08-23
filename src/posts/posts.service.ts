import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './schemas/post.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Category, CategoryDocument } from '../categories/schemas/category.schema';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private readonly authService: AuthService
  ) { }

  async create(user: UserDocument, createPostDto: CreatePostDto) {
    // This action adds a new post
    let createPost = {
      ...createPostDto,
      createBy: user
    }
    const createdPost = new this.postModel(createPost);
    return createdPost.save();
  }

  async findAll() {
    // This action returns all posts
    return this.postModel.find().exec()
  }

  async findOne(id: string) {
    // This action returns a ${id} post
    return this.postModel.findById(id)
  }

  async update(id: string, user: UserDocument, updatePostDto: UpdatePostDto) {
    // This action updates a ${id} post
    let updateTarget = await this.findOne(id)
    if(!updateTarget){
      return false
    }

    let canModify = await this.authService.valideUserCanModify(user._id.toHexString(), updateTarget.id)
    if(!canModify){
      return false
    }

    let updatePost: UpdateQuery<PostDocument> = {
      ...updatePostDto,
      updateBy: user,
      updatetime: new Date
    }
    const { _id } = await this.postModel.findByIdAndUpdate(id, updatePost, { useFindAndModify: false })

    return await this.postModel.findById(_id)
  }

  async remove(id: string) {
    // This action removes a ${id} post
    return this.postModel.findByIdAndRemove(id, { useFindAndModify: false })
  }
}
