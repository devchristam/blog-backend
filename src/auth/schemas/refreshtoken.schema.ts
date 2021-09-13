import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RefreshTokenDocument = RefreshToken & Document;

@Schema()
export class RefreshToken {
  @Prop({
    required: true,
    unique: true,
  })
  rtoken: string;

  @Prop()
  endAt: Date;

  @Prop({
    default: Date.now(),
  })
  createAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
