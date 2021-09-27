import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateUnitDto {
    @ApiProperty({ example: 'Test unit' })
    @IsNotEmpty()
    title: string;
  
    @ApiProperty({ example: 1 })
    examnId: number;

    @ApiProperty({ type: [Number], example: [1, 2]})
    lessonsIds: number[];
}
