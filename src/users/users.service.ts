import {
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument, userPrivilege } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel(createUserDto);
    const { _id } = await createdUser.save();
    return await this.userModel.findById(_id).select({ password: 0 }).exec();
  }

  async findAll(): Promise<UserDocument[]> {
    // This action returns all users
    return await this.userModel.find().select({ password: 0 }).exec();
  }

  // internal only
  async findOne(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }

  async findOneRoute(user: UserDocument, id: string): Promise<UserDocument> {
    const samePerson = user.id === id;
    const isAdmin = user.privilege === userPrivilege.admin;
    if (!(samePerson || isAdmin)) {
      throw new UnauthorizedException();
    }
    return await this.userModel
      .findById(id)
      .select({
        password: 0,
      })
      .exec();
  }

  // internal only
  async findByLoginname(loginname: string): Promise<UserDocument> {
    return await this.userModel.findOne({
      loginname: loginname,
    });
  }

  // only allow update password
  async update(
    user: UserDocument,
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<boolean> {
    const samePerson = user.id === id;
    const isAdmin = user.privilege === userPrivilege.admin;
    if (!(samePerson || isAdmin)) {
      throw new UnauthorizedException();
    }

    if (!updateUserDto.password) {
      throw new NotAcceptableException({
        statusCode: 406,
        message: 'please input new password',
      });
    }

    const newPassword = await bcrypt.hash(updateUserDto.password, 10);

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { password: newPassword },
      { useFindAndModify: false },
    );

    if (!updatedUser) {
      throw new NotAcceptableException({
        statusCode: 406,
        message: 'user not found',
      });
    }

    return true;
  }

  async remove(id: string): Promise<boolean> {
    const user = await this.userModel.findByIdAndRemove(id, {
      useFindAndModify: false,
    });

    if (!user) {
      throw new NotAcceptableException({
        statusCode: 406,
        message: 'user not found',
      });
    }

    return true;
  }

  async seeding() {
    const createdUser = new this.userModel({
      name: 'admin',
      loginname: process.env.ADMIN_LOGINNAME,
      password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
      enable: true,
      privilege: userPrivilege.admin,
    });
    return await createdUser.save().catch(() => {
      throw new NotAcceptableException({
        statusCode: 406,
        message: 'exist same loginname',
      });
    });
  }
}
