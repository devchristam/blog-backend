import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ required: true })
  @IsString()
  title: string;

  @ApiProperty({ required: true })
  @IsString()
  markdown: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  enable: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  coverPhotoUrl: string;

  @ApiProperty()
  @IsString()
  intro: string;
}
