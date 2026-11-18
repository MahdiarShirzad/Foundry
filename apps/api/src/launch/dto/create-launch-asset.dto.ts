import { IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLaunchAssetDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  preview?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsISO8601()
  lastUpdated?: string;

  @IsOptional()
  @IsString()
  relatedChannelId?: string;
}
