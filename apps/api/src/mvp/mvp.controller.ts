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
import { MvpService } from './mvp.service';
import { CreateMvpProjectDto } from './dto/create-mvp-project.dto';
import { UpdateMvpProjectDto } from './dto/update-mvp-project.dto';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { CreateScopeItemDto } from './dto/create-scope-item.dto';
import { UpdateScopeItemDto } from './dto/update-scope-item.dto';

@ApiTags('MVP Studio')
@ApiCookieAuth('access_token')
@ApiBearerAuth('bearer')
@Controller('mvp')
export class MvpController {
  constructor(private readonly mvpService: MvpService) {}

  // ---- Projects ----

  @Get(':productId/projects')
  @ApiOperation({ summary: 'Get all MVP projects for a product' })
  @ApiResponse({ status: 200, description: 'MVP projects found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllProjects(@Param('productId') productId: string) {
    return this.mvpService.findAllProjects(productId);
  }

  @Get(':productId/projects/:id')
  @ApiOperation({ summary: 'Get an MVP project by ID' })
  @ApiResponse({ status: 200, description: 'MVP project found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'MVP project not found' })
  findProjectById(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.mvpService.findProjectById(productId, id);
  }

  @Post(':productId/projects')
  @ApiOperation({ summary: 'Create an MVP project' })
  @ApiBody({ type: CreateMvpProjectDto })
  @ApiResponse({ status: 201, description: 'MVP project created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createProject(
    @Param('productId') productId: string,
    @Body() dto: CreateMvpProjectDto,
  ) {
    return this.mvpService.createProject(productId, dto);
  }

  @Patch(':productId/projects/:id')
  @ApiOperation({ summary: 'Update an MVP project' })
  @ApiBody({ type: UpdateMvpProjectDto })
  @ApiResponse({ status: 200, description: 'MVP project updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'MVP project not found' })
  updateProject(
    @Param('productId') productId: string,
    @Param('id') id: string,
    @Body() dto: UpdateMvpProjectDto,
  ) {
    return this.mvpService.updateProject(productId, id, dto);
  }

  @Delete(':productId/projects/:id')
  @ApiOperation({ summary: 'Delete an MVP project' })
  @ApiResponse({ status: 200, description: 'MVP project deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'MVP project not found' })
  removeProject(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.mvpService.removeProject(productId, id);
  }

  // ---- Features ----

  @Get(':productId/projects/:projectId/features')
  @ApiOperation({ summary: 'Get all features for an MVP project' })
  @ApiResponse({ status: 200, description: 'Features found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'MVP project not found' })
  findAllFeatures(
    @Param('productId') productId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.mvpService.findAllFeatures(productId, projectId);
  }

  @Get(':productId/projects/:projectId/features/:id')
  @ApiOperation({ summary: 'Get a feature by ID' })
  @ApiResponse({ status: 200, description: 'Feature found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Feature not found' })
  findFeatureById(
    @Param('productId') productId: string,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    return this.mvpService.findFeatureById(productId, projectId, id);
  }

  @Post(':productId/projects/:projectId/features')
  @ApiOperation({ summary: 'Create a feature' })
  @ApiBody({ type: CreateFeatureDto })
  @ApiResponse({ status: 201, description: 'Feature created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'MVP project not found' })
  createFeature(
    @Param('productId') productId: string,
    @Param('projectId') projectId: string,
    @Body() dto: CreateFeatureDto,
  ) {
    return this.mvpService.createFeature(productId, projectId, dto);
  }

  @Patch(':productId/projects/:projectId/features/:id')
  @ApiOperation({ summary: 'Update a feature' })
  @ApiBody({ type: UpdateFeatureDto })
  @ApiResponse({ status: 200, description: 'Feature updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Feature not found' })
  updateFeature(
    @Param('productId') productId: string,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() dto: UpdateFeatureDto,
  ) {
    return this.mvpService.updateFeature(productId, projectId, id, dto);
  }

  @Delete(':productId/projects/:projectId/features/:id')
  @ApiOperation({ summary: 'Delete a feature' })
  @ApiResponse({ status: 200, description: 'Feature deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Feature not found' })
  removeFeature(
    @Param('productId') productId: string,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    return this.mvpService.removeFeature(productId, projectId, id);
  }

  // ---- Scope items ----

  @Get(':productId/projects/:projectId/scope')
  @ApiOperation({ summary: 'Get all scope items for an MVP project' })
  @ApiResponse({ status: 200, description: 'Scope items found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'MVP project not found' })
  findAllScopeItems(
    @Param('productId') productId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.mvpService.findAllScopeItems(productId, projectId);
  }

  @Post(':productId/projects/:projectId/scope')
  @ApiOperation({ summary: 'Create a scope item' })
  @ApiBody({ type: CreateScopeItemDto })
  @ApiResponse({ status: 201, description: 'Scope item created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'MVP project not found' })
  createScopeItem(
    @Param('productId') productId: string,
    @Param('projectId') projectId: string,
    @Body() dto: CreateScopeItemDto,
  ) {
    return this.mvpService.createScopeItem(productId, projectId, dto);
  }

  @Patch(':productId/projects/:projectId/scope/:id')
  @ApiOperation({ summary: 'Update a scope item' })
  @ApiBody({ type: UpdateScopeItemDto })
  @ApiResponse({ status: 200, description: 'Scope item updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Scope item not found' })
  updateScopeItem(
    @Param('productId') productId: string,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() dto: UpdateScopeItemDto,
  ) {
    return this.mvpService.updateScopeItem(productId, projectId, id, dto);
  }

  @Delete(':productId/projects/:projectId/scope/:id')
  @ApiOperation({ summary: 'Delete a scope item' })
  @ApiResponse({ status: 200, description: 'Scope item deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Scope item not found' })
  removeScopeItem(
    @Param('productId') productId: string,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    return this.mvpService.removeScopeItem(productId, projectId, id);
  }

  // ---- AI ----

  @Post(':productId/projects/:projectId/ai/suggest-features')
  @ApiOperation({ summary: 'Suggest essential features for an MVP project' })
  @ApiResponse({ status: 201, description: 'Feature suggestions generated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'MVP project not found' })
  suggestFeatures(
    @Param('productId') productId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.mvpService.suggestFeatures(productId, projectId);
  }

  @Post(':productId/projects/:projectId/features/:id/ai/user-story')
  @ApiOperation({ summary: 'Generate a user story for a feature' })
  @ApiResponse({ status: 201, description: 'User story generated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Feature not found' })
  generateUserStory(
    @Param('productId') productId: string,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    return this.mvpService.generateUserStory(productId, projectId, id);
  }
}
