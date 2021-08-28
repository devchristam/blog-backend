import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class findAllPagingDto{
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  skip?: number;
}

