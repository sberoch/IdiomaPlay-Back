import { ApiProperty } from '@nestjs/swagger';

export class StatsParams {
  @ApiProperty({ required: false, example: new Date() })
  from?: Date;

  @ApiProperty({ required: false, example: new Date() })
  to?: Date;
}
