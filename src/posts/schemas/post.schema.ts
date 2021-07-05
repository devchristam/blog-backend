import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose';

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

}

export const PostSchema = SchemaFactory.createForClass(Post)
