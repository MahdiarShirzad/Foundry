import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateResearchNoteDto {
  @IsIn(['competitor', 'segment', 'opportunity', 'idea'])
  relatedType: string;

  @IsString()
  relatedId: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsString()
  author?: string;
}
