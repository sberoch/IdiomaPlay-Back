import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateUserStatDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  exercisesDone: number;
}