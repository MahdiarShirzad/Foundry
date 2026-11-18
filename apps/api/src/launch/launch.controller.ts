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
import { LaunchService } from './launch.service';
import { CreateLaunchTaskDto } from './dto/create-launch-task.dto';
import { UpdateLaunchTaskDto } from './dto/update-launch-task.dto';
import { CreateLaunchAssetDto } from './dto/create-launch-asset.dto';
import { UpdateLaunchAssetDto } from './dto/update-launch-asset.dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';

@ApiTags('Launch Center')
@ApiCookieAuth('access_token')
@ApiBearerAuth('bearer')
@Controller('launch')
export class LaunchController {
  constructor(private readonly launchService: LaunchService) {}

  // ---- Tasks ----

  @Get(':productId/tasks')
  @ApiOperation({ summary: 'Get all launch tasks for a product' })
  @ApiResponse({ status: 200, description: 'Launch tasks found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllTasks(@Param('productId') productId: string) {
    return this.launchService.findAllTasks(productId);
  }

  @Get(':productId/tasks/:id')
  @ApiOperation({ summary: 'Get a launch task by ID' })
  @ApiResponse({ status: 200, description: 'Launch task found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Launch task not found' })
  findTaskById(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.launchService.findTaskById(productId, id);
  }

  @Post(':productId/tasks')
  @ApiOperation({ summary: 'Create a launch task' })
  @ApiBody({ type: CreateLaunchTaskDto })
  @ApiResponse({ status: 201, description: 'Launch task created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createTask(
    @Param('productId') productId: string,
    @Body() dto: CreateLaunchTaskDto,
  ) {
    return this.launchService.createTask(productId, dto);
  }

  @Patch(':productId/tasks/:id')
  @ApiOperation({ summary: 'Update a launch task' })
  @ApiBody({ type: UpdateLaunchTaskDto })
  @ApiResponse({ status: 200, description: 'Launch task updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Launch task not found' })
  updateTask(
    @Param('productId') productId: string,
    @Param('id') id: string,
    @Body() dto: UpdateLaunchTaskDto,
  ) {
    return this.launchService.updateTask(productId, id, dto);
  }

  @Delete(':productId/tasks/:id')
  @ApiOperation({ summary: 'Delete a launch task' })
  @ApiResponse({ status: 200, description: 'Launch task deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Launch task not found' })
  removeTask(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.launchService.removeTask(productId, id);
  }

  // ---- Assets ----

  @Get(':productId/assets')
  @ApiOperation({ summary: 'Get all launch assets for a product' })
  @ApiResponse({ status: 200, description: 'Launch assets found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllAssets(@Param('productId') productId: string) {
    return this.launchService.findAllAssets(productId);
  }

  @Get(':productId/assets/:id')
  @ApiOperation({ summary: 'Get a launch asset by ID' })
  @ApiResponse({ status: 200, description: 'Launch asset found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Launch asset not found' })
  findAssetById(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.launchService.findAssetById(productId, id);
  }

  @Post(':productId/assets')
  @ApiOperation({ summary: 'Create a launch asset' })
  @ApiBody({ type: CreateLaunchAssetDto })
  @ApiResponse({ status: 201, description: 'Launch asset created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createAsset(
    @Param('productId') productId: string,
    @Body() dto: CreateLaunchAssetDto,
  ) {
    return this.launchService.createAsset(productId, dto);
  }

  @Patch(':productId/assets/:id')
  @ApiOperation({ summary: 'Update a launch asset' })
  @ApiBody({ type: UpdateLaunchAssetDto })
  @ApiResponse({ status: 200, description: 'Launch asset updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Launch asset not found' })
  updateAsset(
    @Param('productId') productId: string,
    @Param('id') id: string,
    @Body() dto: UpdateLaunchAssetDto,
  ) {
    return this.launchService.updateAsset(productId, id, dto);
  }

  @Delete(':productId/assets/:id')
  @ApiOperation({ summary: 'Delete a launch asset' })
  @ApiResponse({ status: 200, description: 'Launch asset deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Launch asset not found' })
  removeAsset(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.launchService.removeAsset(productId, id);
  }

  // ---- Channels ----

  @Get(':productId/channels')
  @ApiOperation({ summary: 'Get all channels for a product' })
  @ApiResponse({ status: 200, description: 'Channels found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllChannels(@Param('productId') productId: string) {
    return this.launchService.findAllChannels(productId);
  }

  @Get(':productId/channels/:id')
  @ApiOperation({ summary: 'Get a channel by ID' })
  @ApiResponse({ status: 200, description: 'Channel found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Channel not found' })
  findChannelById(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.launchService.findChannelById(productId, id);
  }

  @Post(':productId/channels')
  @ApiOperation({ summary: 'Create a channel' })
  @ApiBody({ type: CreateChannelDto })
  @ApiResponse({ status: 201, description: 'Channel created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createChannel(
    @Param('productId') productId: string,
    @Body() dto: CreateChannelDto,
  ) {
    return this.launchService.createChannel(productId, dto);
  }

  @Patch(':productId/channels/:id')
  @ApiOperation({ summary: 'Update a channel' })
  @ApiBody({ type: UpdateChannelDto })
  @ApiResponse({ status: 200, description: 'Channel updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Channel not found' })
  updateChannel(
    @Param('productId') productId: string,
    @Param('id') id: string,
    @Body() dto: UpdateChannelDto,
  ) {
    return this.launchService.updateChannel(productId, id, dto);
  }

  @Delete(':productId/channels/:id')
  @ApiOperation({ summary: 'Delete a channel' })
  @ApiResponse({ status: 200, description: 'Channel deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Channel not found' })
  removeChannel(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.launchService.removeChannel(productId, id);
  }

  // ---- Checklist items ----

  @Get(':productId/checklist')
  @ApiOperation({ summary: 'Get all checklist items for a product' })
  @ApiResponse({ status: 200, description: 'Checklist items found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllChecklistItems(@Param('productId') productId: string) {
    return this.launchService.findAllChecklistItems(productId);
  }

  @Get(':productId/checklist/:id')
  @ApiOperation({ summary: 'Get a checklist item by ID' })
  @ApiResponse({ status: 200, description: 'Checklist item found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Checklist item not found' })
  findChecklistItemById(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.launchService.findChecklistItemById(productId, id);
  }

  @Post(':productId/checklist')
  @ApiOperation({ summary: 'Create a checklist item' })
  @ApiBody({ type: CreateChecklistItemDto })
  @ApiResponse({ status: 201, description: 'Checklist item created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createChecklistItem(
    @Param('productId') productId: string,
    @Body() dto: CreateChecklistItemDto,
  ) {
    return this.launchService.createChecklistItem(productId, dto);
  }

  @Patch(':productId/checklist/:id')
  @ApiOperation({ summary: 'Update a checklist item' })
  @ApiBody({ type: UpdateChecklistItemDto })
  @ApiResponse({ status: 200, description: 'Checklist item updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Checklist item not found' })
  updateChecklistItem(
    @Param('productId') productId: string,
    @Param('id') id: string,
    @Body() dto: UpdateChecklistItemDto,
  ) {
    return this.launchService.updateChecklistItem(productId, id, dto);
  }

  @Delete(':productId/checklist/:id')
  @ApiOperation({ summary: 'Delete a checklist item' })
  @ApiResponse({ status: 200, description: 'Checklist item deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Checklist item not found' })
  removeChecklistItem(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.launchService.removeChecklistItem(productId, id);
  }

  // ---- AI ----

  @Post(':productId/ai/suggest-tasks')
  @ApiOperation({ summary: 'Suggest a go-to-market launch checklist' })
  @ApiResponse({ status: 201, description: 'Launch tasks suggested' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  suggestTasks(@Param('productId') productId: string) {
    return this.launchService.suggestTasks(productId);
  }
}
