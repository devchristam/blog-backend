import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: true })
  @IsString()
  password: string;
}
