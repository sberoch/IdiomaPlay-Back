import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { CreateExerciseDto } from "../../exercises/dto/create-exercise.dto";

export class CreateLessonDto {
    @ApiProperty({ example: 'Test' })
    @IsNotEmpty()
    title: string;

    @ApiProperty({ type: [Number] })
    exercises: number[];
}
