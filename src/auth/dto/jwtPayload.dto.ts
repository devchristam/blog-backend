import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class jwtPayload {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  sub!: string;

  @ApiProperty()
  @IsNumber()
  privilege!: number;

  @ApiProperty()
  @IsNumber()
  iat!: number;

  @ApiProperty()
  @IsNumber()
  exp!: number;
}
