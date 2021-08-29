import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, userPrivilege } from '../users/schemas/user.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryDocument> {
    // This action adds a new category
    const existCategory = await this.categoryModel
      .find({ name: createCategoryDto.name })
      .exec()
    
    if(existCategory.length !== 0){
      throw new NotAcceptableException() 
    }

    const createdCategory = new this.categoryModel(createCategoryDto);
    const { _id } = await createdCategory.save();
    return await this.findOne(_id);
  }

  async findAll(): Promise<CategoryDocument[]> {
    // This action returns all category
    return await this.categoryModel
      .find({ enable: true })
      .exec()
  }

  async findOne(id: string): Promise<CategoryDocument> {
    // This action returns a ${id} category
    const category = await this.categoryModel
      .findOne({
        _id: id,
        enable: true
      })
      .exec()

    if(!category){
      throw new NotFoundException()
    }
    return category
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<boolean> {
    // This action updates a ${id} category
    let updateTarget = await this.findOne(id)
    if(!updateTarget){
      return false
    }

    const updatedCategory = await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { useFindAndModify: false })
    if(!updatedCategory){
      return false
    }

    return true
  }

  async hardRemove(user: UserDocument ,id: string): Promise<boolean> {
    // This action removes a ${id} category
    let removeTarget = await this.categoryModel.findById(id)
    if(!removeTarget){
      return false
    }

    //hard delete only for admin user
    if(user.privilege !== userPrivilege.admin){
      return false
    }

    const removeCategory = await this.categoryModel.findByIdAndRemove(id, { useFindAndModify: false })
    if(!removeCategory){
      return false
    }

    return true
  }

  async softRemove(id: string): Promise<boolean> {
    // This action removes a ${id} category
    let removeTarget = await this.findOne(id)
    if(!removeTarget){
      return false
    }

    const removeCategory = await this.update(id, {enable: false})
    if(!removeCategory){
      return false
    }

    return true
  }
}
