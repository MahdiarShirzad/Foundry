import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import type { Request, Response } from 'express';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { WorkspaceService } from './workspace.service';

@Controller('workspace')
@UseGuards(AuthGuard)
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get()
  async getWorkspace(@Req() req: Request) {
    const workspace = await this.workspaceService.findByUserId(
      req.user!.userId,
    );

    return workspace;
  }

  @Patch()
  async updateWorkspace(@Body() dto: UpdateWorkspaceDto, @Req() req: Request) {
    return await this.workspaceService.update(dto.name, req.user!.userId);
  }
}
