import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCatalogueDto } from './dto/create-catalogue.dto';
import { UpdateCatalogueDto } from './dto/update-catalogue.dto';
import { Catalogue, CatalogueDocument } from './schemas/catalogue.schema';

@Injectable()
export class CataloguesService {
  constructor(@InjectModel(Catalogue.name) private catalogueModel: Model<CatalogueDocument>) {}

  create(createCatalogueDto: CreateCatalogueDto) {
    // This action adds a new catalogue
    const createdCatalogue = new this.catalogueModel(createCatalogueDto);
    return createdCatalogue.save();
  }

  findAll() {
    // This action returns all catalogues
    return this.catalogueModel.find().exec()
  }

  findOne(id: string) {
    // This action returns a ${id} catalogue
    return this.catalogueModel.findById(id)
  }

  update(id: string, updateCatalogueDto: UpdateCatalogueDto) {
    // This action updates a ${id} catalogue
    return this.catalogueModel.findByIdAndUpdate(id, updateCatalogueDto, { useFindAndModify: false })
  }

  remove(id: string) {
    // This action removes a ${id} catalogue
    return this.catalogueModel.findByIdAndRemove(id, { useFindAndModify: false })
  }
}
