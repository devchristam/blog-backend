import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as mongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Category } from '../../categories/schemas/category.schema';

export type PostDocument = Post & Document

@Schema()
export class Post {

  @Prop({
    required: true
  })
  title: string

  @Prop({
    required: true
  })
  markdown: string

  @Prop()
  tags: string[]

  @Prop({
    default: Date.now
  })
  createtime: Date

  @Prop({
    default: true
  })
  enable: boolean

  @Prop({
    type: mongooseSchema.Types.ObjectId, ref: 'User'
  })
  createBy: User

  @Prop({
    type: mongooseSchema.Types.ObjectId, ref: 'Catalogue'
  })
  catalogue: Category

}

export const PostSchema = SchemaFactory.createForClass(Post)
