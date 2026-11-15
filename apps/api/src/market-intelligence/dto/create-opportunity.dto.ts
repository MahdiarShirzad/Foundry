import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateOpportunityDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsIn(['High', 'Medium', 'Low'])
  significance: string;

  @IsOptional()
  @IsString()
  segmentId?: string;
}
