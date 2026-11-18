import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ValidationService } from './validation.service';
import { CreateHypothesisDto } from './dto/create-hypothesis.dto';
import { UpdateHypothesisDto } from './dto/update-hypothesis.dto';
import { CreateExperimentDto } from './dto/create-experiment.dto';
import { UpdateExperimentDto } from './dto/update-experiment.dto';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { UpdateEvidenceDto } from './dto/update-evidence.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Validation')
@ApiCookieAuth('access_token')
@ApiBearerAuth('bearer')
@Controller('validation')
export class ValidationController {
  constructor(private readonly validationService: ValidationService) {}

  // ---- Hypothesis ----

  @Get(':ideaId/hypotheses')
  @ApiOperation({ summary: 'Get all hypotheses by idea ID' })
  @ApiResponse({ status: 200, description: 'Hypotheses found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllHypothesesByIdea(@Param('ideaId') ideaId: string) {
    return this.validationService.findAllHypothesisByIdea(ideaId);
  }

  @Get(':ideaId/hypotheses/:id')
  @ApiOperation({ summary: 'Get a hypothesis by ID' })
  @ApiResponse({ status: 200, description: 'Hypothesis found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Hypothesis not found' })
  findHypothesisById(
    @Param('ideaId') ideaId: string,
    @Param('id') id: string,
  ) {
    return this.validationService.findHypothesisById(id);
  }

  @Post(':ideaId/hypotheses')
  @ApiOperation({ summary: 'Create a hypothesis' })
  @ApiBody({ type: CreateHypothesisDto })
  @ApiResponse({ status: 201, description: 'Hypothesis created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createHypothesis(
    @Param('ideaId') ideaId: string,
    @Body() dto: CreateHypothesisDto,
  ) {
    return this.validationService.createHypothesis(ideaId, dto);
  }

  @Patch(':ideaId/hypotheses/:id')
  @ApiOperation({ summary: 'Update a hypothesis by ID' })
  @ApiBody({ type: UpdateHypothesisDto })
  @ApiResponse({ status: 200, description: 'Hypothesis updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Hypothesis not found' })
  updateHypothesis(
    @Param('id') id: string,
    @Body() dto: UpdateHypothesisDto,
  ) {
    return this.validationService.updateHypothesis(id, dto);
  }

  @Delete(':ideaId/hypotheses/:id')
  @ApiOperation({ summary: 'Delete a hypothesis by ID' })
  @ApiResponse({ status: 200, description: 'Hypothesis deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Hypothesis not found' })
  deleteHypothesis(@Param('id') id: string) {
    return this.validationService.removeHypothesis(id);
  }

  // ---- Experiment ----

  @Get(':ideaId/experiments')
  @ApiOperation({ summary: 'Get all experiments by idea ID' })
  @ApiQuery({ name: 'hypothesisId', required: false, description: 'Filter by hypothesis ID' })
  @ApiResponse({ status: 200, description: 'Experiments found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllExperiments(
    @Param('ideaId') ideaId: string,
    @Query('hypothesisId') hypothesisId?: string,
  ) {
    if (hypothesisId) {
      return this.validationService.findAllExperimentsByHypothesis(hypothesisId);
    }
    return this.validationService.findAllExperimentsByIdea(ideaId);
  }

  @Get(':ideaId/experiments/:id')
  @ApiOperation({ summary: 'Get an experiment by ID' })
  @ApiResponse({ status: 200, description: 'Experiment found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Experiment not found' })
  findExperimentById(
    @Param('ideaId') ideaId: string,
    @Param('id') id: string,
  ) {
    return this.validationService.findExperimentById(id);
  }

  @Post(':ideaId/experiments')
  @ApiOperation({ summary: 'Create an experiment' })
  @ApiBody({ type: CreateExperimentDto })
  @ApiResponse({ status: 201, description: 'Experiment created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createExperiment(
    @Param('ideaId') ideaId: string,
    @Body() dto: CreateExperimentDto,
  ) {
    return this.validationService.createExperiment(ideaId, dto);
  }

  @Patch(':ideaId/experiments/:id')
  @ApiOperation({ summary: 'Update an experiment by ID' })
  @ApiBody({ type: UpdateExperimentDto })
  @ApiResponse({ status: 200, description: 'Experiment updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Experiment not found' })
  updateExperiment(
    @Param('id') id: string,
    @Body() dto: UpdateExperimentDto,
  ) {
    return this.validationService.updateExperiment(id, dto);
  }

  @Delete(':ideaId/experiments/:id')
  @ApiOperation({ summary: 'Delete an experiment by ID' })
  @ApiResponse({ status: 200, description: 'Experiment deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Experiment not found' })
  deleteExperiment(@Param('id') id: string) {
    return this.validationService.removeExperiment(id);
  }

  // ---- Evidence ----

  @Get(':ideaId/evidence')
  @ApiOperation({ summary: 'Get all evidence by idea ID' })
  @ApiQuery({ name: 'experimentId', required: false, description: 'Filter by experiment ID' })
  @ApiQuery({ name: 'hypothesisId', required: false, description: 'Filter by hypothesis ID' })
  @ApiResponse({ status: 200, description: 'Evidence found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllEvidence(
    @Param('ideaId') ideaId: string,
    @Query('experimentId') experimentId?: string,
    @Query('hypothesisId') hypothesisId?: string,
  ) {
    if (experimentId) {
      return this.validationService.findAllEvidenceByExperiment(experimentId);
    }
    if (hypothesisId) {
      return this.validationService.findAllEvidenceByHypothesis(hypothesisId);
    }
    return this.validationService.findAllEvidenceByIdea(ideaId);
  }

  @Get(':ideaId/evidence/:id')
  @ApiOperation({ summary: 'Get an evidence item by ID' })
  @ApiResponse({ status: 200, description: 'Evidence found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Evidence not found' })
  findEvidenceById(
    @Param('ideaId') ideaId: string,
    @Param('id') id: string,
  ) {
    return this.validationService.findEvidenceById(id);
  }

  @Post(':ideaId/evidence')
  @ApiOperation({ summary: 'Create evidence' })
  @ApiBody({ type: CreateEvidenceDto })
  @ApiResponse({ status: 201, description: 'Evidence created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createEvidence(
    @Param('ideaId') ideaId: string,
    @Body() dto: CreateEvidenceDto,
  ) {
    return this.validationService.createEvidence(ideaId, dto);
  }

  @Patch(':ideaId/evidence/:id')
  @ApiOperation({ summary: 'Update evidence by ID' })
  @ApiBody({ type: UpdateEvidenceDto })
  @ApiResponse({ status: 200, description: 'Evidence updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Evidence not found' })
  updateEvidence(
    @Param('id') id: string,
    @Body() dto: UpdateEvidenceDto,
  ) {
    return this.validationService.updateEvidence(id, dto);
  }

  @Delete(':ideaId/evidence/:id')
  @ApiOperation({ summary: 'Delete evidence by ID' })
  @ApiResponse({ status: 200, description: 'Evidence deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Evidence not found' })
  deleteEvidence(@Param('id') id: string) {
    return this.validationService.removeEvidence(id);
  }
}
