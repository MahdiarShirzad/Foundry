import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChecklistItemDto {
  @IsString()
  @IsNotEmpty()
  item: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
