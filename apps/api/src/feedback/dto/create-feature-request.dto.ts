import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFeatureRequestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  userProblem?: string;

  @IsOptional()
  @IsString()
  requestedCapability?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relatedFeedbackIds?: string[];

  @IsOptional()
  @IsString()
  productArea?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  roadmapReference?: string;
}
