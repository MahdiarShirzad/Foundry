import {
  IsBoolean,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EvidenceType } from '../../generated/prisma/enums';

export class CreateEvidenceDto {
  @IsString()
  @IsNotEmpty()
  ideaId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  relatedExperimentId?: string;

  @IsOptional()
  @IsString()
  relatedHypothesisId?: string;

  @IsOptional()
  @IsEnum(EvidenceType)
  type?: EvidenceType;

  @IsOptional()
  @IsString()
  sourceLabel?: string;

  @IsOptional()
  @IsISO8601()
  date?: string;

  @IsOptional()
  @IsString()
  observation?: string;

  @IsOptional()
  @IsString()
  interpretation?: string;

  @IsOptional()
  @IsString()
  limitations?: string;

  @IsOptional()
  @IsBoolean()
  isDraft?: boolean;
}
