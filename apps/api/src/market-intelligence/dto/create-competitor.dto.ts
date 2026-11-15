import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateCompetitorDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  strengths?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  weaknesses?: string[];

  @IsOptional()
  @IsString()
  pricing?: string;

  @IsOptional()
  @IsString()
  targetAudience?: string;
}
