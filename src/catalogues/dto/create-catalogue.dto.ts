import { ApiProperty } from "@nestjs/swagger"

export class CreateCatalogueDto {
  @ApiProperty()
  name: string

  @ApiProperty()
  enable: boolean
}
