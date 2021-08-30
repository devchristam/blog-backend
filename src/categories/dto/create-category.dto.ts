import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  tag: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  enable: boolean;
}
