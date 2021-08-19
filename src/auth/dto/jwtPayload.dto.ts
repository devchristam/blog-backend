import { ApiProperty } from "@nestjs/swagger"

export class jwtPayload {
  @ApiProperty()
  name: string

  @ApiProperty()
  sub: string

  @ApiProperty()
  privilege: number

  @ApiProperty()
  iat: number

  @ApiProperty()
  exp: number
}
