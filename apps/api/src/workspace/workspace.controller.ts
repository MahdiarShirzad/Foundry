import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { WorkspaceService } from './workspace.service';

@ApiTags('Workspace')
@ApiCookieAuth('access_token')
@ApiBearerAuth('bearer')
@Controller('workspace')
@UseGuards(AuthGuard)
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get()
  @ApiOperation({ summary: 'Get the workspace the current user belongs to' })
  @ApiResponse({
    status: 200,
    description: 'Workspace found, or null if the user is in none',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getWorkspace(@Req() req: Request) {
    const workspace = await this.workspaceService.findByUserId(
      req.user!.userId,
    );

    return workspace;
  }

  @Patch()
  @ApiOperation({ summary: "Rename the current user's workspace" })
  @ApiBody({ type: UpdateWorkspaceDto })
  @ApiResponse({ status: 200, description: 'Workspace updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateWorkspace(@Body() dto: UpdateWorkspaceDto, @Req() req: Request) {
    return await this.workspaceService.update(dto.name, req.user!.userId);
  }
}
