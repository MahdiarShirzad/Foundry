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

@Controller('validation')
export class ValidationController {
  constructor(private readonly validationService: ValidationService) {}

  // ---- Hypothesis ----

  @Get(':ideaId/hypotheses')
  findAllHypothesesByIdea(@Param('ideaId') ideaId: string) {
    return this.validationService.findAllHypothesisByIdea(ideaId);
  }

  @Get(':ideaId/hypotheses/:id')
  findHypothesisById(
    @Param('ideaId') ideaId: string,
    @Param('id') id: string,
  ) {
    return this.validationService.findHypothesisById(id);
  }

  @Post(':ideaId/hypotheses')
  createHypothesis(
    @Param('ideaId') ideaId: string,
    @Body() dto: CreateHypothesisDto,
  ) {
    return this.validationService.createHypothesis(ideaId, dto);
  }

  @Patch(':ideaId/hypotheses/:id')
  updateHypothesis(
    @Param('id') id: string,
    @Body() dto: UpdateHypothesisDto,
  ) {
    return this.validationService.updateHypothesis(id, dto);
  }

  @Delete(':ideaId/hypotheses/:id')
  deleteHypothesis(@Param('id') id: string) {
    return this.validationService.removeHypothesis(id);
  }

  // ---- Experiment ----

  @Get(':ideaId/experiments')
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
  findExperimentById(
    @Param('ideaId') ideaId: string,
    @Param('id') id: string,
  ) {
    return this.validationService.findExperimentById(id);
  }

  @Post(':ideaId/experiments')
  createExperiment(
    @Param('ideaId') ideaId: string,
    @Body() dto: CreateExperimentDto,
  ) {
    return this.validationService.createExperiment(ideaId, dto);
  }

  @Patch(':ideaId/experiments/:id')
  updateExperiment(
    @Param('id') id: string,
    @Body() dto: UpdateExperimentDto,
  ) {
    return this.validationService.updateExperiment(id, dto);
  }

  @Delete(':ideaId/experiments/:id')
  deleteExperiment(@Param('id') id: string) {
    return this.validationService.removeExperiment(id);
  }

  // ---- Evidence ----

  @Get(':ideaId/evidence')
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
  findEvidenceById(
    @Param('ideaId') ideaId: string,
    @Param('id') id: string,
  ) {
    return this.validationService.findEvidenceById(id);
  }

  @Post(':ideaId/evidence')
  createEvidence(
    @Param('ideaId') ideaId: string,
    @Body() dto: CreateEvidenceDto,
  ) {
    return this.validationService.createEvidence(ideaId, dto);
  }

  @Patch(':ideaId/evidence/:id')
  updateEvidence(
    @Param('id') id: string,
    @Body() dto: UpdateEvidenceDto,
  ) {
    return this.validationService.updateEvidence(id, dto);
  }

  @Delete(':ideaId/evidence/:id')
  deleteEvidence(@Param('id') id: string) {
    return this.validationService.removeEvidence(id);
  }
}
