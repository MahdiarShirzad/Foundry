import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export enum IdeaStatus {
  INBOX = 'INBOX',
  EXPLORING = 'EXPLORING',
  SHORTLISTED = 'SHORTLISTED',
}

export class CreateIdeaDto {
  @IsString()
  workspaceId: string;

  @IsString()
  productId: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  headline?: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  problem?: string;

  @IsString()
  @IsOptional()
  audience?: string;

  @IsString()
  @IsOptional()
  solution?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[] = [];

  @IsEnum(IdeaStatus)
  @IsOptional()
  status?: IdeaStatus = IdeaStatus.INBOX;

  @IsString()
  @IsOptional()
  source?: string;

  @IsString()
  @IsOptional()
  context?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  openQuestions?: string[] = [];
}
