import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose';

export type CatalogueDocument = Catalogue & Document

@Schema()
export class Catalogue {
  @Prop({
    required: true
  })
  name: string

  @Prop({
    default: true
  })
  enable: boolean
}

export const CatalogueSchema = SchemaFactory.createForClass(Catalogue)