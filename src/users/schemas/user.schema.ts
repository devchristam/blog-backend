import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose';

export type UserDocument = User & Document

export enum userPrivilege{
  read = 0,
  write = 1,
  modify = 2,
  admin = 3
}

@Schema()
export class User {
  @Prop({
    required: true
  })
  name: string

  @Prop({
    required: true,
    unique: true
  })
  loginname: string

  @Prop({
    required: true
  })
  password: string

  @Prop({
    default: Date.now
  })
  createtime: Date

  @Prop({
    default: true
  })
  enable: boolean

  @Prop({
    default: userPrivilege.read
  })
  privilege: userPrivilege
}

export const UserSchema = SchemaFactory.createForClass(User)