import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { userPrivilege } from '../schemas/user.schema';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsString()
  name!: string;

  @ApiProperty({ required: true })
  @IsString()
  loginname!: string;

  @ApiProperty({ required: true })
  @IsString()
  password!: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(userPrivilege.read)
  @Max(userPrivilege.admin)
  privilege?: userPrivilege;
}
