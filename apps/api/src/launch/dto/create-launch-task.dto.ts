import { IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLaunchTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  phase?: string;

  @IsOptional()
  @IsISO8601()
  date?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  owner?: string;

  @IsOptional()
  @IsString()
  relatedAssetId?: string;

  @IsOptional()
  @IsString()
  relatedChannelId?: string;
}
