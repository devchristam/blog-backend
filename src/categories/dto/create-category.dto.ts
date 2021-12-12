import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ required: true })
  @IsString()
  name!: string;

  @ApiProperty({ required: true })
  @IsString()
  tag!: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  enable?: boolean;
}
