import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateExamnDto {
    @ApiProperty({ example: 'Test' })
    @IsNotEmpty()
    title: string;
  
    @ApiProperty({ type: [Number] })
    exercisesIds: number[];
}
