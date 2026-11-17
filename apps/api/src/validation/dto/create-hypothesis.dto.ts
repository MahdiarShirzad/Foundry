import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  HypothesisCategory,
  HypothesisStatus,
  Importance,
} from '../../generated/prisma/enums';

export class CreateHypothesisDto {
  @IsString()
  @IsNotEmpty()
  ideaId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  statement: string;

  @IsOptional()
  @IsString()
  customerSegment?: string;

  @IsOptional()
  @IsEnum(HypothesisCategory)
  category?: HypothesisCategory;

  @IsOptional()
  @IsString()
  rationale?: string;

  @IsOptional()
  @IsEnum(Importance)
  importance?: Importance;

  @IsOptional()
  @IsEnum(HypothesisStatus)
  status?: HypothesisStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relatedExperimentIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  linkedFindings?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  unresolvedQuestions?: string[];

  @IsOptional()
  @IsBoolean()
  isDraft?: boolean;
}
