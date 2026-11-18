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
import { AnalyticsService } from './analytics.service';
import { CreateWeekSampleDto } from './dto/create-week-sample.dto';
import { UpdateWeekSampleDto } from './dto/update-week-sample.dto';
import { CreateMetricDefinitionDto } from './dto/create-metric-definition.dto';
import { UpdateMetricDefinitionDto } from './dto/update-metric-definition.dto';
import { CreateObservationDto } from './dto/create-observation.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';
import { CreateAnalyticsReportDto } from './dto/create-analytics-report.dto';
import { UpdateAnalyticsReportDto } from './dto/update-analytics-report.dto';

@ApiTags('Founder Analytics')
@ApiCookieAuth('access_token')
@ApiBearerAuth('bearer')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // ---- Week samples ----

  @Get(':productId/weeks')
  @ApiOperation({ summary: 'Get all week samples for a product' })
  @ApiResponse({ status: 200, description: 'Week samples found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllWeekSamples(@Param('productId') productId: string) {
    return this.analyticsService.findAllWeekSamples(productId);
  }

  @Get(':productId/weeks/:id')
  @ApiOperation({ summary: 'Get a week sample by ID' })
  @ApiResponse({ status: 200, description: 'Week sample found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Week sample not found' })
  findWeekSampleById(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.analyticsService.findWeekSampleById(productId, id);
  }

  @Post(':productId/weeks')
  @ApiOperation({ summary: 'Create a week sample' })
  @ApiBody({ type: CreateWeekSampleDto })
  @ApiResponse({ status: 201, description: 'Week sample created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createWeekSample(
    @Param('productId') productId: string,
    @Body() dto: CreateWeekSampleDto,
  ) {
    return this.analyticsService.createWeekSample(productId, dto);
  }

  @Patch(':productId/weeks/:id')
  @ApiOperation({ summary: 'Update a week sample' })
  @ApiBody({ type: UpdateWeekSampleDto })
  @ApiResponse({ status: 200, description: 'Week sample updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Week sample not found' })
  updateWeekSample(
    @Param('productId') productId: string,
    @Param('id') id: string,
    @Body() dto: UpdateWeekSampleDto,
  ) {
    return this.analyticsService.updateWeekSample(productId, id, dto);
  }

  @Delete(':productId/weeks/:id')
  @ApiOperation({ summary: 'Delete a week sample' })
  @ApiResponse({ status: 200, description: 'Week sample deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Week sample not found' })
  removeWeekSample(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.analyticsService.removeWeekSample(productId, id);
  }

  // ---- Metric definitions ----

  @Get(':productId/metrics')
  @ApiOperation({ summary: 'Get all metric definitions for a product' })
  @ApiResponse({ status: 200, description: 'Metric definitions found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllMetricDefinitions(@Param('productId') productId: string) {
    return this.analyticsService.findAllMetricDefinitions(productId);
  }

  @Get(':productId/metrics/:id')
  @ApiOperation({ summary: 'Get a metric definition by ID' })
  @ApiResponse({ status: 200, description: 'Metric definition found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Metric definition not found' })
  findMetricDefinitionById(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.analyticsService.findMetricDefinitionById(productId, id);
  }

  @Post(':productId/metrics')
  @ApiOperation({ summary: 'Create a metric definition' })
  @ApiBody({ type: CreateMetricDefinitionDto })
  @ApiResponse({ status: 201, description: 'Metric definition created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createMetricDefinition(
    @Param('productId') productId: string,
    @Body() dto: CreateMetricDefinitionDto,
  ) {
    return this.analyticsService.createMetricDefinition(productId, dto);
  }

  @Patch(':productId/metrics/:id')
  @ApiOperation({ summary: 'Update a metric definition' })
  @ApiBody({ type: UpdateMetricDefinitionDto })
  @ApiResponse({ status: 200, description: 'Metric definition updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Metric definition not found' })
  updateMetricDefinition(
    @Param('productId') productId: string,
    @Param('id') id: string,
    @Body() dto: UpdateMetricDefinitionDto,
  ) {
    return this.analyticsService.updateMetricDefinition(productId, id, dto);
  }

  @Delete(':productId/metrics/:id')
  @ApiOperation({ summary: 'Delete a metric definition' })
  @ApiResponse({ status: 200, description: 'Metric definition deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Metric definition not found' })
  removeMetricDefinition(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.analyticsService.removeMetricDefinition(productId, id);
  }

  // ---- Observations ----

  @Get(':productId/observations')
  @ApiOperation({ summary: 'Get all observations for a product' })
  @ApiResponse({ status: 200, description: 'Observations found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllObservations(@Param('productId') productId: string) {
    return this.analyticsService.findAllObservations(productId);
  }

  @Get(':productId/observations/:id')
  @ApiOperation({ summary: 'Get an observation by ID' })
  @ApiResponse({ status: 200, description: 'Observation found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Observation not found' })
  findObservationById(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.analyticsService.findObservationById(productId, id);
  }

  @Post(':productId/observations')
  @ApiOperation({ summary: 'Create an observation' })
  @ApiBody({ type: CreateObservationDto })
  @ApiResponse({ status: 201, description: 'Observation created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createObservation(
    @Param('productId') productId: string,
    @Body() dto: CreateObservationDto,
  ) {
    return this.analyticsService.createObservation(productId, dto);
  }

  @Patch(':productId/observations/:id')
  @ApiOperation({ summary: 'Update an observation' })
  @ApiBody({ type: UpdateObservationDto })
  @ApiResponse({ status: 200, description: 'Observation updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Observation not found' })
  updateObservation(
    @Param('productId') productId: string,
    @Param('id') id: string,
    @Body() dto: UpdateObservationDto,
  ) {
    return this.analyticsService.updateObservation(productId, id, dto);
  }

  @Delete(':productId/observations/:id')
  @ApiOperation({ summary: 'Delete an observation' })
  @ApiResponse({ status: 200, description: 'Observation deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Observation not found' })
  removeObservation(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.analyticsService.removeObservation(productId, id);
  }

  // ---- Reports ----

  @Get(':productId/reports')
  @ApiOperation({ summary: 'Get all analytics reports for a product' })
  @ApiResponse({ status: 200, description: 'Analytics reports found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllReports(@Param('productId') productId: string) {
    return this.analyticsService.findAllReports(productId);
  }

  @Get(':productId/reports/:id')
  @ApiOperation({ summary: 'Get an analytics report by ID' })
  @ApiResponse({ status: 200, description: 'Analytics report found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Analytics report not found' })
  findReportById(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.analyticsService.findReportById(productId, id);
  }

  @Post(':productId/reports')
  @ApiOperation({ summary: 'Create an analytics report' })
  @ApiBody({ type: CreateAnalyticsReportDto })
  @ApiResponse({ status: 201, description: 'Analytics report created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createReport(
    @Param('productId') productId: string,
    @Body() dto: CreateAnalyticsReportDto,
  ) {
    return this.analyticsService.createReport(productId, dto);
  }

  @Patch(':productId/reports/:id')
  @ApiOperation({ summary: 'Update an analytics report' })
  @ApiBody({ type: UpdateAnalyticsReportDto })
  @ApiResponse({ status: 200, description: 'Analytics report updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Analytics report not found' })
  updateReport(
    @Param('productId') productId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAnalyticsReportDto,
  ) {
    return this.analyticsService.updateReport(productId, id, dto);
  }

  @Delete(':productId/reports/:id')
  @ApiOperation({ summary: 'Delete an analytics report' })
  @ApiResponse({ status: 200, description: 'Analytics report deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Analytics report not found' })
  removeReport(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return this.analyticsService.removeReport(productId, id);
  }

  // ---- AI ----

  @Post(':productId/ai/interpret')
  @ApiOperation({ summary: 'Interpret recent weekly metrics' })
  @ApiResponse({ status: 201, description: 'Metrics interpreted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  interpretMetrics(@Param('productId') productId: string) {
    return this.analyticsService.interpretMetrics(productId);
  }
}
