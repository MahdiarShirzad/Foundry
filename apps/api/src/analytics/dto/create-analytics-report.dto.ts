import { Prisma } from '../../generated/prisma/client';
import {
  IsArray,
  IsISO8601,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAnalyticsReportDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  period?: string;

  @IsOptional()
  @IsISO8601()
  updated?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  paragraphs?: string[];

  @IsOptional()
  @IsObject()
  values?: Prisma.InputJsonValue;

  @IsOptional()
  @IsObject()
  chart?: Prisma.InputJsonValue;

  @IsOptional()
  @IsObject()
  bars?: Prisma.InputJsonValue;
}
