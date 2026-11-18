import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateObservationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  metricId?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  nextStep?: string;

  @IsOptional()
  @IsBoolean()
  sample?: boolean;
}
