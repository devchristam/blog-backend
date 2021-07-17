import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument, userPrivilege } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  create(createUserDto: CreateUserDto) {
    // This action adds a new user
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  findAll() {
    // This action returns all users
    return this.userModel.find().exec()
  }

  findOne(id: string) {
    // This action returns a ${id} user
    return this.userModel.findById(id)
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    // This action updates a ${id} user
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { useFindAndModify: false })
  }

  remove(id: string) {
    // This action removes a #${id} user
    return this.userModel.findByIdAndRemove(id, { useFindAndModify: false })
  }

  async seeding(){
    const createdUser = new this.userModel({
      "name": "admin",
      "loginname": process.env.ADMIN_LOGINNAME,
      "password": process.env.ADMIN_PASSWORD,
      "enable": true,
      "privilege": userPrivilege.admin
    });
    return await createdUser.save();
  }
}
