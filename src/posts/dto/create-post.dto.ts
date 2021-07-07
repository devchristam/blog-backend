import { ApiProperty } from "@nestjs/swagger"

export class CreatePostDto {
	@ApiProperty({ required: true })
	title: string
	
	@ApiProperty({ required: true })
	markdown: string

	@ApiProperty()
	tags: string[]

	@ApiProperty()
	createtime: Date

	@ApiProperty()
	enable: boolean
}
