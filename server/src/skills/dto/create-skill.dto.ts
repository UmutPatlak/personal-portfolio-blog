import { IsString, IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator';

export class CreateSkillDto {
  @IsNumber()
  @IsNotEmpty()
  categoryId!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}
