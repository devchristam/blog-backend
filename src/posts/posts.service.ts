import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './schemas/post.schema';
import { User, UserDocument, userPrivilege } from '../users/schemas/user.schema';
import { Category, CategoryDocument } from '../categories/schemas/category.schema';
import { AuthService } from '../auth/auth.service';
import { findAllPostDto } from './dto/find-all-posts.dto';

export interface tagOutput {
  tag: string;
  count: number;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private readonly authService: AuthService
  ) { }

  async create(user: UserDocument, createPostDto: CreatePostDto): Promise<PostDocument> {
    // This action adds a new post
    let createPost = {
      ...createPostDto,
      createBy: user
    }
    const createdPost = new this.postModel(createPost);
    const { _id } = await createdPost.save()
    return await this.findOne(_id);
  }

  async findAll(_skip: number = 0, _limit: number = 0, browseQuery: findAllPostDto): Promise<PostDocument[]> {
    // This action returns all posts
    let findPostOptions = {
      tags: { $all: browseQuery.tags },
      enable: true
    }

    if(!browseQuery.tags){
      delete findPostOptions.tags
    }

    return await this.postModel
      .find(findPostOptions)
      .skip(_skip)
      .limit(_limit)
      .sort({
        createtime: 'asc'
      })
      .exec()
  }

  async findAllTags(): Promise<tagOutput[]>{
    // This action returns all posts
    return await this.postModel
      .aggregate([
        { "$match": { "enable": true } },
        { "$project": { "tags": 1 } },
        { "$unwind": "$tags" },
        { "$group": { "_id": "$tags", "count": { "$sum": 1 } } },
        { "$sort": { "count": -1, "_id": 1 } },
        { "$project": { "_id": 0, "tag": "$_id", "count": 1 } },
      ])
  }

  async findOne(id: string): Promise<PostDocument> {
    // This action returns a ${id} post
    const user = await this.postModel
      .findOne({
        _id: id,
        enable: true
      })
      .exec()

    if(!user){
      throw new NotFoundException()
    }
    return user
  }

  async update(id: string, user: UserDocument, updatePostDto: UpdatePostDto): Promise<boolean> {
    // This action updates a ${id} post
    let updateTarget = await this.findOne(id)
    if(!updateTarget){
      return false
    }

    let canModify = await this.authService.valideUserCanModify(user._id.toHexString(), updateTarget._id)
    if(!canModify){
      return false
    }

    let updatePost: UpdateQuery<PostDocument> = {
      ...updatePostDto,
      updateBy: user,
      updatetime: new Date
    }
    const updatedUser = await this.postModel.findByIdAndUpdate(id, updatePost, { useFindAndModify: false })
    if(!updatedUser){
      return false
    }

    return true
  }

  async hardRemove(user: UserDocument ,id: string): Promise<boolean> {
    // This action removes a ${id} post
    let removeTarget = await this.postModel.findById(id)
    if(!removeTarget){
      return false
    }

    //hard delete only for admin user
    if(user.privilege !== userPrivilege.admin){
      return false
    }

    const removePost = await this.postModel.findByIdAndRemove(id, { useFindAndModify: false })
    if(!removePost){
      return false
    }
    return true
  }

  async softRemove(user: UserDocument ,id: string): Promise<boolean> {
    let removeTarget = await this.findOne(id)
    if(!removeTarget){
      return false
    }

    let canModify = await this.authService.valideUserCanModify(user._id.toHexString(), removeTarget._id)
    if(!canModify){
      return false
    }

    const removePost = await this.update(id, user, {enable: false})
    if(!removePost){
      return false
    }
    return true
  }
}
