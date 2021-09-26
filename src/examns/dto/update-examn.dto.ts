import { PartialType } from '@nestjs/swagger';
import { CreateExamnDto } from './create-examn.dto';

export class UpdateExamnDto extends PartialType(CreateExamnDto) {}
