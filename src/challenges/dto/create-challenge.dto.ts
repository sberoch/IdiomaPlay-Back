import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateChallengeDto {
  @ApiProperty({ example: 'Test' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: [Number], example: [1, 2] })
  unitsIds: number[];
}
