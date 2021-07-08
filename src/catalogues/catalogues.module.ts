import { Module } from '@nestjs/common';
import { CataloguesService } from './catalogues.service';
import { CataloguesController } from './catalogues.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Catalogue, CatalogueSchema } from './schemas/catalogue.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Catalogue.name, schema: CatalogueSchema }])],
  controllers: [CataloguesController],
  providers: [CataloguesService]
})
export class CataloguesModule {}
