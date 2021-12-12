import { Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class jwtDto {
  @IsString()
  access_token!: string;

  @IsInt()
  @Type(() => Number)
  duration!: number;
}
