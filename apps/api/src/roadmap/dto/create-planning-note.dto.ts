import { IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePlanningNoteDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  relatedItemId?: string;

  @IsOptional()
  @IsString()
  period?: string;

  @IsOptional()
  @IsISO8601()
  date?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
