import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document

@Schema()
export class Category {
  @Prop({
    required: true
  })
  name: string

  @Prop({
    default: true
  })
  enable: boolean
}

export const CategorySchema = SchemaFactory.createForClass(Category)
