import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {
  @ApiProperty()
  name: string

  @ApiProperty()
  loginname: string

  @ApiProperty()
  password: string

  @ApiProperty()
  createtime: Date

  @ApiProperty()
  enable: boolean

}
