import {
  IsISO8601,
  IsInt,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateWeekSampleDto {
  @IsISO8601()
  start: string;

  @IsOptional()
  @IsInt()
  active?: number;

  @IsOptional()
  @IsInt()
  newUsers?: number;

  @IsOptional()
  @IsInt()
  sessions?: number;

  @IsOptional()
  @IsNumber()
  avgMinutes?: number;

  @IsOptional()
  @IsNumber()
  perUser?: number;

  @IsOptional()
  @IsNumber()
  returnRate?: number;
}
