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
import { FeedbackService } from './feedback.service';
import { CreateFeedbackItemDto } from './dto/create-feedback-item.dto';
import { UpdateFeedbackItemDto } from './dto/update-feedback-item.dto';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { CreateFeatureRequestDto } from './dto/create-feature-request.dto';
import { UpdateFeatureRequestDto } from './dto/update-feature-request.dto';
import { CreateProductAreaDto } from './dto/create-product-area.dto';
import { UpdateProductAreaDto } from './dto/update-product-area.dto';

@ApiTags('Feedback Hub')
@ApiCookieAuth('access_token')
@ApiBearerAuth('bearer')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  // ---- Feedback items ----

  @Get(':productId/items')
  @ApiOperation({ summary: 'Get all feedback items for a product' })
  @ApiResponse({ status: 200, description: 'Feedback items found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllFeedbackItems(@Param('productId') productId: string) {
    return this.feedbackService.findAllFeedbackItems(productId);
  }

  @Get(':productId/items/:id')
  @ApiOperation({ summary: 'Get a feedback item by ID' })
  @ApiResponse({ status: 200, description: 'Feedback item found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Feedback item not found' })
  findFeedbackItemById(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.feedbackService.findFeedbackItemById(productId, id);
  }

  @Post(':productId/items')
  @ApiOperation({ summary: 'Create a feedback item' })
  @ApiBody({ type: CreateFeedbackItemDto })
  @ApiResponse({ status: 201, description: 'Feedback item created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createFeedbackItem(
    @Param('productId') productId: string,
    @Body() dto: CreateFeedbackItemDto,
  ) {
    return this.feedbackService.createFeedbackItem(productId, dto);
  }

  @Patch(':productId/items/:id')
  @ApiOperation({ summary: 'Update a feedback item' })
  @ApiBody({ type: UpdateFeedbackItemDto })
  @ApiResponse({ status: 200, description: 'Feedback item updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Feedback item not found' })
  updateFeedbackItem(
    @Param('productId') productId: string,
    @Param('id') id: string,
    @Body() dto: UpdateFeedbackItemDto,
  ) {
    return this.feedbackService.updateFeedbackItem(productId, id, dto);
  }

  @Delete(':productId/items/:id')
  @ApiOperation({ summary: 'Delete a feedback item' })
  @ApiResponse({ status: 200, description: 'Feedback item deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Feedback item not found' })
  removeFeedbackItem(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.feedbackService.removeFeedbackItem(productId, id);
  }

  // ---- Themes ----

  @Get(':productId/themes')
  @ApiOperation({ summary: 'Get all themes for a product' })
  @ApiResponse({ status: 200, description: 'Themes found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllThemes(@Param('productId') productId: string) {
    return this.feedbackService.findAllThemes(productId);
  }

  @Get(':productId/themes/:id')
  @ApiOperation({ summary: 'Get a theme by ID' })
  @ApiResponse({ status: 200, description: 'Theme found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Theme not found' })
  findThemeById(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.feedbackService.findThemeById(productId, id);
  }

  @Post(':productId/themes')
  @ApiOperation({ summary: 'Create a theme' })
  @ApiBody({ type: CreateThemeDto })
  @ApiResponse({ status: 201, description: 'Theme created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createTheme(
    @Param('productId') productId: string,
    @Body() dto: CreateThemeDto,
  ) {
    return this.feedbackService.createTheme(productId, dto);
  }

  @Patch(':productId/themes/:id')
  @ApiOperation({ summary: 'Update a theme' })
  @ApiBody({ type: UpdateThemeDto })
  @ApiResponse({ status: 200, description: 'Theme updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Theme not found' })
  updateTheme(
    @Param('productId') productId: string,
    @Param('id') id: string,
    @Body() dto: UpdateThemeDto,
  ) {
    return this.feedbackService.updateTheme(productId, id, dto);
  }

  @Delete(':productId/themes/:id')
  @ApiOperation({ summary: 'Delete a theme' })
  @ApiResponse({ status: 200, description: 'Theme deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Theme not found' })
  removeTheme(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.feedbackService.removeTheme(productId, id);
  }

  // ---- Feature requests ----

  @Get(':productId/requests')
  @ApiOperation({ summary: 'Get all feature requests for a product' })
  @ApiResponse({ status: 200, description: 'Feature requests found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllFeatureRequests(@Param('productId') productId: string) {
    return this.feedbackService.findAllFeatureRequests(productId);
  }

  @Get(':productId/requests/:id')
  @ApiOperation({ summary: 'Get a feature request by ID' })
  @ApiResponse({ status: 200, description: 'Feature request found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Feature request not found' })
  findFeatureRequestById(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.feedbackService.findFeatureRequestById(productId, id);
  }

  @Post(':productId/requests')
  @ApiOperation({ summary: 'Create a feature request' })
  @ApiBody({ type: CreateFeatureRequestDto })
  @ApiResponse({ status: 201, description: 'Feature request created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createFeatureRequest(
    @Param('productId') productId: string,
    @Body() dto: CreateFeatureRequestDto,
  ) {
    return this.feedbackService.createFeatureRequest(productId, dto);
  }

  @Patch(':productId/requests/:id')
  @ApiOperation({ summary: 'Update a feature request' })
  @ApiBody({ type: UpdateFeatureRequestDto })
  @ApiResponse({ status: 200, description: 'Feature request updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Feature request not found' })
  updateFeatureRequest(
    @Param('productId') productId: string,
    @Param('id') id: string,
    @Body() dto: UpdateFeatureRequestDto,
  ) {
    return this.feedbackService.updateFeatureRequest(productId, id, dto);
  }

  @Delete(':productId/requests/:id')
  @ApiOperation({ summary: 'Delete a feature request' })
  @ApiResponse({ status: 200, description: 'Feature request deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Feature request not found' })
  removeFeatureRequest(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.feedbackService.removeFeatureRequest(productId, id);
  }

  // ---- Product areas ----

  @Get(':productId/areas')
  @ApiOperation({ summary: 'Get all product areas for a product' })
  @ApiResponse({ status: 200, description: 'Product areas found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllProductAreas(@Param('productId') productId: string) {
    return this.feedbackService.findAllProductAreas(productId);
  }

  @Get(':productId/areas/:id')
  @ApiOperation({ summary: 'Get a product area by ID' })
  @ApiResponse({ status: 200, description: 'Product area found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product area not found' })
  findProductAreaById(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.feedbackService.findProductAreaById(productId, id);
  }

  @Post(':productId/areas')
  @ApiOperation({ summary: 'Create a product area' })
  @ApiBody({ type: CreateProductAreaDto })
  @ApiResponse({ status: 201, description: 'Product area created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createProductArea(
    @Param('productId') productId: string,
    @Body() dto: CreateProductAreaDto,
  ) {
    return this.feedbackService.createProductArea(productId, dto);
  }

  @Patch(':productId/areas/:id')
  @ApiOperation({ summary: 'Update a product area' })
  @ApiBody({ type: UpdateProductAreaDto })
  @ApiResponse({ status: 200, description: 'Product area updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product area not found' })
  updateProductArea(
    @Param('productId') productId: string,
    @Param('id') id: string,
    @Body() dto: UpdateProductAreaDto,
  ) {
    return this.feedbackService.updateProductArea(productId, id, dto);
  }

  @Delete(':productId/areas/:id')
  @ApiOperation({ summary: 'Delete a product area' })
  @ApiResponse({ status: 200, description: 'Product area deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product area not found' })
  removeProductArea(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.feedbackService.removeProductArea(productId, id);
  }

  // ---- AI ----

  @Post(':productId/ai/summarize')
  @ApiOperation({ summary: 'Summarize product feedback into themes' })
  @ApiResponse({ status: 201, description: 'Feedback summarized' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  summarizeFeedback(@Param('productId') productId: string) {
    return this.feedbackService.summarizeFeedback(productId);
  }
}
