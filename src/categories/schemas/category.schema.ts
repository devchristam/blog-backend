import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  @Prop({
    required: true,
    unique: true,
  })
  name!: string;

  @Prop({
    required: true,
  })
  tag!: string;

  @Prop({
    default: true,
  })
  enable!: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
