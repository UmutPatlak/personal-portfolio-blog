import { IsString, IsNotEmpty, IsOptional, IsNumber, MaxLength } from 'class-validator';

export class CreateEducationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  school!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  department!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  degree!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  startDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  endDate?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}
