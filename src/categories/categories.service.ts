import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

  create(createCategoryDto: CreateCategoryDto) {
    // This action adds a new category
    const createdCategory = new this.categoryModel(createCategoryDto);
    return createdCategory.save();
  }

  findAll() {
    // This action returns all category
    return this.categoryModel.find().exec()
  }

  findOne(id: string) {
    // This action returns a ${id} category
    return this.categoryModel.findById(id)
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    // This action updates a ${id} category
    return this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { useFindAndModify: false })
  }

  remove(id: string) {
    // This action removes a ${id} category
    return this.categoryModel.findByIdAndRemove(id, { useFindAndModify: false })
  }
}
