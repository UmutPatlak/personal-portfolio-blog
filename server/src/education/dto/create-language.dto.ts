import { IsString, IsNotEmpty, IsOptional, IsNumber, MaxLength } from 'class-validator';

export class CreateLanguageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  level!: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}
