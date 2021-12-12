import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop({
    required: true,
    unique: true,
  })
  title!: string;

  @Prop({
    required: true,
  })
  markdown!: string;

  @Prop({
    required: true,
  })
  tags!: string[];

  @Prop({
    default: Date.now,
  })
  createtime!: Date;

  @Prop({
    default: true,
  })
  enable!: boolean;

  @Prop({
    type: mongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  createBy!: User;

  @Prop({
    type: mongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  updateBy?: User;

  @Prop()
  updatetime?: Date;

  @Prop()
  coverPhotoUrl?: string;

  @Prop({
    required: true,
  })
  intro!: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
