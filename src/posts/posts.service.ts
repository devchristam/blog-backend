import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './schemas/post.schema';
import { UserDocument, userPrivilege } from '../users/schemas/user.schema';
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
    private readonly authService: AuthService,
  ) {}

  async create(
    user: UserDocument,
    createPostDto: CreatePostDto,
  ): Promise<PostDocument> {
    // This action adds a new post
    if (
      !createPostDto.title ||
      !createPostDto.markdown ||
      !createPostDto.tags ||
      !createPostDto.intro
    ) {
      throw new NotAcceptableException({
        statusCode: 406,
        message: 'missing required field',
      });
    }

    const existPost = await this.postModel
      .find({ title: createPostDto.title })
      .exec();

    if (existPost.length !== 0) {
      throw new NotAcceptableException({
        statusCode: 406,
        message: 'exist post with same title',
      });
    }

    const createPost = {
      ...createPostDto,
      createBy: user,
    };
    const createdPost = new this.postModel(createPost);
    const { _id } = await createdPost.save();
    return await this.findOne(_id);
  }

  async findAll(
    _skip = 0,
    _limit = 0,
    browseQuery: findAllPostDto,
  ): Promise<PostDocument[]> {
    // This action returns all posts
    const findPostOptions = {
      tags: { $all: browseQuery.tags },
      enable: true,
    };

    if (!browseQuery.tags) {
      return await this.postModel
        .find({ enable: true })
        .skip(_skip)
        .limit(_limit)
        .sort({
          createtime: 'desc',
        })
        .exec();
    }

    return await this.postModel
      .find(findPostOptions)
      .skip(_skip)
      .limit(_limit)
      .sort({
        createtime: 'desc',
      })
      .exec();
  }

  async findAllTags(): Promise<tagOutput[]> {
    // This action returns all tags with posts number
    return await this.postModel.aggregate([
      { $match: { enable: true } },
      { $project: { tags: 1 } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
      { $project: { _id: 0, tag: '$_id', count: 1 } },
    ]);
  }

  async findCount(): Promise<number> {
    return await this.postModel.countDocuments({
      enable: true,
    });
  }

  async findOne(id: string): Promise<PostDocument> {
    // This action returns a ${id} post
    const post = await this.postModel
      .findOne({
        _id: id,
        enable: true,
      })
      .exec();

    if (!post) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'post not found',
      });
    }
    return post;
  }

  async update(
    id: string,
    user: UserDocument,
    updatePostDto: UpdatePostDto,
  ): Promise<boolean> {
    // This action updates a ${id} post
    const updateTarget = await this.findOne(id);
    if (!updateTarget) {
      return false;
    }

    const canModify = await this.authService.valideUserCanModify(
      user._id.toHexString(),
      updateTarget._id,
    );
    if (!canModify) {
      return false;
    }

    const updatePost: UpdateQuery<PostDocument> = {
      ...updatePostDto,
      updateBy: user,
      updatetime: new Date(),
    };
    const updatedUser = await this.postModel.findByIdAndUpdate(id, updatePost, {
      useFindAndModify: false,
    });
    if (!updatedUser) {
      return false;
    }

    return true;
  }

  async hardRemove(user: UserDocument, id: string): Promise<boolean> {
    // This action removes a ${id} post
    const removeTarget = await this.postModel.findById(id);
    if (!removeTarget) {
      return false;
    }

    //hard delete only for admin user
    if (user.privilege !== userPrivilege.admin) {
      return false;
    }

    const removePost = await this.postModel.findByIdAndRemove(id, {
      useFindAndModify: false,
    });
    if (!removePost) {
      return false;
    }
    return true;
  }

  async softRemove(user: UserDocument, id: string): Promise<boolean> {
    const removeTarget = await this.findOne(id);
    if (!removeTarget) {
      return false;
    }

    const canModify = await this.authService.valideUserCanModify(
      user._id.toHexString(),
      removeTarget._id,
    );
    if (!canModify) {
      return false;
    }

    const removePost = await this.update(id, user, { enable: false });
    if (!removePost) {
      return false;
    }
    return true;
  }
}
