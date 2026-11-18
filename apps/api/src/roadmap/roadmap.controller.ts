import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoadmapService } from './roadmap.service';
import { CreateInitiativeDto } from './dto/create-initiative.dto';
import { UpdateInitiativeDto } from './dto/update-initiative.dto';
import { CreateReleaseDto } from './dto/create-release.dto';
import { UpdateReleaseDto } from './dto/update-release.dto';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { CreatePlanningNoteDto } from './dto/create-planning-note.dto';
import { UpdatePlanningNoteDto } from './dto/update-planning-note.dto';

@ApiTags('Product Roadmap')
@ApiCookieAuth('access_token')
@ApiBearerAuth('bearer')
@Controller('roadmap')
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  // ---- Initiatives ----

  @Get(':productId/initiatives')
  @ApiOperation({ summary: 'Get all initiatives for a product' })
  @ApiResponse({ status: 200, description: 'Initiatives found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllInitiatives(@Param('productId') productId: string) {
    return this.roadmapService.findAllInitiatives(productId);
  }

  @Get(':productId/initiatives/:id')
  @ApiOperation({ summary: 'Get an initiative by ID' })
  @ApiResponse({ status: 200, description: 'Initiative found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Initiative not found' })
  findInitiativeById(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.roadmapService.findInitiativeById(productId, id);
  }

  @Post(':productId/initiatives')
  @ApiOperation({ summary: 'Create an initiative' })
  @ApiBody({ type: CreateInitiativeDto })
  @ApiResponse({ status: 201, description: 'Initiative created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createInitiative(
    @Param('productId') productId: string,
    @Body() dto: CreateInitiativeDto,
  ) {
    return this.roadmapService.createInitiative(productId, dto);
  }

  @Patch(':productId/initiatives/:id')
  @ApiOperation({ summary: 'Update an initiative' })
  @ApiBody({ type: UpdateInitiativeDto })
  @ApiResponse({ status: 200, description: 'Initiative updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Initiative not found' })
  updateInitiative(
    @Param('productId') productId: string,
    @Param('id') id: string,
    @Body() dto: UpdateInitiativeDto,
  ) {
    return this.roadmapService.updateInitiative(productId, id, dto);
  }

  @Delete(':productId/initiatives/:id')
  @ApiOperation({ summary: 'Delete an initiative' })
  @ApiResponse({ status: 200, description: 'Initiative deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Initiative not found' })
  removeInitiative(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.roadmapService.removeInitiative(productId, id);
  }

  // ---- Releases ----

  @Get(':productId/releases')
  @ApiOperation({ summary: 'Get all releases for a product' })
  @ApiResponse({ status: 200, description: 'Releases found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllReleases(@Param('productId') productId: string) {
    return this.roadmapService.findAllReleases(productId);
  }

  @Get(':productId/releases/:id')
  @ApiOperation({ summary: 'Get a release by ID' })
  @ApiResponse({ status: 200, description: 'Release found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Release not found' })
  findReleaseById(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.roadmapService.findReleaseById(productId, id);
  }

  @Post(':productId/releases')
  @ApiOperation({ summary: 'Create a release' })
  @ApiBody({ type: CreateReleaseDto })
  @ApiResponse({ status: 201, description: 'Release created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createRelease(
    @Param('productId') productId: string,
    @Body() dto: CreateReleaseDto,
  ) {
    return this.roadmapService.createRelease(productId, dto);
  }

  @Patch(':productId/releases/:id')
  @ApiOperation({ summary: 'Update a release' })
  @ApiBody({ type: UpdateReleaseDto })
  @ApiResponse({ status: 200, description: 'Release updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Release not found' })
  updateRelease(
    @Param('productId') productId: string,
    @Param('id') id: string,
    @Body() dto: UpdateReleaseDto,
  ) {
    return this.roadmapService.updateRelease(productId, id, dto);
  }

  @Delete(':productId/releases/:id')
  @ApiOperation({ summary: 'Delete a release' })
  @ApiResponse({ status: 200, description: 'Release deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Release not found' })
  removeRelease(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.roadmapService.removeRelease(productId, id);
  }

  // ---- Milestones ----

  @Get(':productId/milestones')
  @ApiOperation({ summary: 'Get all milestones for a product' })
  @ApiResponse({ status: 200, description: 'Milestones found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllMilestones(@Param('productId') productId: string) {
    return this.roadmapService.findAllMilestones(productId);
  }

  @Get(':productId/milestones/:id')
  @ApiOperation({ summary: 'Get a milestone by ID' })
  @ApiResponse({ status: 200, description: 'Milestone found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Milestone not found' })
  findMilestoneById(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.roadmapService.findMilestoneById(productId, id);
  }

  @Post(':productId/milestones')
  @ApiOperation({ summary: 'Create a milestone' })
  @ApiBody({ type: CreateMilestoneDto })
  @ApiResponse({ status: 201, description: 'Milestone created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createMilestone(
    @Param('productId') productId: string,
    @Body() dto: CreateMilestoneDto,
  ) {
    return this.roadmapService.createMilestone(productId, dto);
  }

  @Patch(':productId/milestones/:id')
  @ApiOperation({ summary: 'Update a milestone' })
  @ApiBody({ type: UpdateMilestoneDto })
  @ApiResponse({ status: 200, description: 'Milestone updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Milestone not found' })
  updateMilestone(
    @Param('productId') productId: string,
    @Param('id') id: string,
    @Body() dto: UpdateMilestoneDto,
  ) {
    return this.roadmapService.updateMilestone(productId, id, dto);
  }

  @Delete(':productId/milestones/:id')
  @ApiOperation({ summary: 'Delete a milestone' })
  @ApiResponse({ status: 200, description: 'Milestone deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Milestone not found' })
  removeMilestone(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.roadmapService.removeMilestone(productId, id);
  }

  // ---- Planning notes ----

  @Get(':productId/notes')
  @ApiOperation({ summary: 'Get all planning notes for a product' })
  @ApiResponse({ status: 200, description: 'Planning notes found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllPlanningNotes(@Param('productId') productId: string) {
    return this.roadmapService.findAllPlanningNotes(productId);
  }

  @Get(':productId/notes/:id')
  @ApiOperation({ summary: 'Get a planning note by ID' })
  @ApiResponse({ status: 200, description: 'Planning note found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Planning note not found' })
  findPlanningNoteById(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.roadmapService.findPlanningNoteById(productId, id);
  }

  @Post(':productId/notes')
  @ApiOperation({ summary: 'Create a planning note' })
  @ApiBody({ type: CreatePlanningNoteDto })
  @ApiResponse({ status: 201, description: 'Planning note created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createPlanningNote(
    @Param('productId') productId: string,
    @Body() dto: CreatePlanningNoteDto,
  ) {
    return this.roadmapService.createPlanningNote(productId, dto);
  }

  @Patch(':productId/notes/:id')
  @ApiOperation({ summary: 'Update a planning note' })
  @ApiBody({ type: UpdatePlanningNoteDto })
  @ApiResponse({ status: 200, description: 'Planning note updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Planning note not found' })
  updatePlanningNote(
    @Param('productId') productId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePlanningNoteDto,
  ) {
    return this.roadmapService.updatePlanningNote(productId, id, dto);
  }

  @Delete(':productId/notes/:id')
  @ApiOperation({ summary: 'Delete a planning note' })
  @ApiResponse({ status: 200, description: 'Planning note deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Planning note not found' })
  removePlanningNote(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.roadmapService.removePlanningNote(productId, id);
  }

  // ---- AI ----

  @Post(':productId/ai/suggest-initiatives')
  @ApiOperation({ summary: 'Suggest strategic initiatives for a product' })
  @ApiResponse({ status: 201, description: 'Initiatives suggested' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  suggestInitiatives(@Param('productId') productId: string) {
    return this.roadmapService.suggestInitiatives(productId);
  }
}
