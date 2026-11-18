import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class CreateReleaseDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsString()
  purpose?: string;

  @IsOptional()
  @IsISO8601()
  plannedDate?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  notesPreview?: string;
}
