import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateWorkspaceDto {
  @ApiPropertyOptional({
    example: 'My Workspace',
    description: 'New workspace name; omitted to keep the current name',
  })
  @IsOptional()
  @IsString()
  name: string;
}
