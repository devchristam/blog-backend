import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RefreshTokenDocument = RefreshToken & Document;

@Schema()
export class RefreshToken {
  @Prop({
    required: true,
    unique: true,
  })
  rtoken: string;

  @Prop(
    raw({
      // default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
      expires: 0,
      type: Date,
    }),
  )
  expiresAt: Date;

  @Prop({
    default: Date.now(),
  })
  createAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
