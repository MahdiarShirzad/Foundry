import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';

export class CreateSegmentDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsIn(['Small', 'Medium', 'Large'])
  size?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  painPoints?: string[];
}
