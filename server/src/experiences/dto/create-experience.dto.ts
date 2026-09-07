import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  MaxLength,
} from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  company!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  position!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  startDate!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  endDate?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  achievements?: string[];
}
