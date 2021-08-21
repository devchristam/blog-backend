import { ApiProperty } from "@nestjs/swagger"

export class jwtUser{
  @ApiProperty()
  name: string

  @ApiProperty()
  id: string

  @ApiProperty()
  privilege: number
}
