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
    const { _id } = await createdPost.save()
    return await this.postModel.findOne(_id);
  }

  async findAll() {
    // This action returns all posts
    return await this.postModel.find().exec()
  }

  async findOne(id: string) {
    // This action returns a ${id} post
    return await this.postModel.findById(id)
  }

  async update(id: string, user: UserDocument, updatePostDto: UpdatePostDto) {
    // This action updates a ${id} post
    let updateTarget = await this.findOne(id)
    if(!updateTarget){
      return false
    }

    let canWrite = await this.authService.valideUserCanModify(user._id.toHexString(), updateTarget._id)
    if(!canWrite){
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

  async remove(user: UserDocument ,id: string): Promise<boolean> {
    // This action removes a ${id} post
    let removeTarget = await this.findOne(id)
    if(!removeTarget){
      return false
    }

    let canModify = await this.authService.valideUserCanModify(user._id.toHexString(), removeTarget._id)
    if(!canModify){
      return false
    }

    const removePost = await this.postModel.findByIdAndRemove(id, { useFindAndModify: false })
    if(!removePost){
      return false
    }
    return true
  }
}
