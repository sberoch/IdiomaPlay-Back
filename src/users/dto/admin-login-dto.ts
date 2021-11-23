import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({ example: 'admin@admin.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'idiomaplayadmin' })
  @IsNotEmpty()
  password: string;
}
