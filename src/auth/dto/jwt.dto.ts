import { IsString } from "class-validator"

export class jwtDto {
  @IsString()
  access_token: string
}
