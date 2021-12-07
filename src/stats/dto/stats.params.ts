import { ApiProperty } from '@nestjs/swagger';

function getToday() {
  return new Date(new Date().setHours(0, 0, 0, 0));
}

function getSevenDaysBackFromDate(date) {
  const result = new Date(date);
  result.setDate(result.getDate() - 7);
  return result;
}

export class StatsParams {
  @ApiProperty({
    required: false,
    example: new Date(),
    default: getSevenDaysBackFromDate(getToday()),
  })
  from?: Date;

  @ApiProperty({
    required: false,
    example: new Date(),
    default: getToday(),
  })
  to?: Date;
}
