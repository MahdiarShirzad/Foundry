import { Prisma } from '../../generated/prisma/client';
import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMvpProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  ref?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  concept?: string;

  @IsOptional()
  @IsString()
  problem?: string;

  @IsOptional()
  @IsString()
  targetAudience?: string;

  @IsOptional()
  @IsString()
  valueProp?: string;

  @IsOptional()
  @IsString()
  mvpObjective?: string;

  @IsOptional()
  @IsString()
  currentScope?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  essentialCapabilities?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  explicitExclusions?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  successCriteria?: string[];

  @IsOptional()
  @IsObject()
  structure?: Prisma.InputJsonValue;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  openDecisions?: string[];
}
