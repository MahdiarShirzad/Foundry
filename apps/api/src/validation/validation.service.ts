import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHypothesisDto } from './dto/create-hypothesis.dto';
import { UpdateHypothesisDto } from './dto/update-hypothesis.dto';
import { CreateExperimentDto } from './dto/create-experiment.dto';
import { UpdateExperimentDto } from './dto/update-experiment.dto';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { UpdateEvidenceDto } from './dto/update-evidence.dto';

@Injectable()
export class ValidationService {
  constructor(private readonly prisma: PrismaService) {}

  //   /---Hypothesis--------------/

  async findAllHypothesisByIdea(ideaId: string) {
    const allHypothesis = await this.prisma.hypothesis.findMany({
      where: { ideaId },
    });

    return allHypothesis;
  }

  async findHypothesisById(hypothesisId: string) {
    const hypothesis = await this.prisma.hypothesis.findUnique({
      where: { id: hypothesisId },
    });

    if (!hypothesis) {
      throw new NotFoundException('Hypothesis not found!');
    }

    return hypothesis;
  }

  async createHypothesis(ideaId: string, dto: CreateHypothesisDto) {
    const hypothesis = await this.prisma.hypothesis.create({
      data: {
        ideaId,
        title: dto.title,
        statement: dto.statement,
        customerSegment: dto.customerSegment,
        category: dto.category,
        rationale: dto.rationale,
        importance: dto.importance,
        status: dto.status,
        relatedExperimentIds: dto.relatedExperimentIds,
        linkedFindings: dto.linkedFindings,
        unresolvedQuestions: dto.unresolvedQuestions,
        isDraft: dto.isDraft,
      },
    });

    return hypothesis;
  }

  async updateHypothesis(id: string, dto: UpdateHypothesisDto) {
    const exists = await this.prisma.hypothesis.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Hypothesis not found!');

    const hypothesis = await this.prisma.hypothesis.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.statement !== undefined && { statement: dto.statement }),
        ...(dto.customerSegment !== undefined && {
          customerSegment: dto.customerSegment,
        }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.rationale !== undefined && { rationale: dto.rationale }),
        ...(dto.importance !== undefined && { importance: dto.importance }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.relatedExperimentIds !== undefined && {
          relatedExperimentIds: dto.relatedExperimentIds,
        }),
        ...(dto.linkedFindings !== undefined && {
          linkedFindings: dto.linkedFindings,
        }),
        ...(dto.unresolvedQuestions !== undefined && {
          unresolvedQuestions: dto.unresolvedQuestions,
        }),
        ...(dto.isDraft !== undefined && { isDraft: dto.isDraft }),
      },
    });

    return hypothesis;
  }

  async removeHypothesis(id: string) {
    const exists = await this.prisma.hypothesis.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Hypothesis not found!');

    return this.prisma.hypothesis.delete({ where: { id } });
  }

  //   /---Experiment--------------/

  async findAllExperimentsByIdea(ideaId: string) {
    const allExperiments = await this.prisma.experiment.findMany({
      where: { ideaId },
    });

    if (allExperiments.length === 0) {
      throw new NotFoundException('no Experiments found');
    }

    return allExperiments;
  }

  async findAllExperimentsByHypothesis(hypothesisId: string) {
    const hypothesis = await this.prisma.hypothesis.findUnique({
      where: { id: hypothesisId },
    });

    if (!hypothesis) {
      throw new NotFoundException('hypothesis not found');
    }

    const allExperiments = await this.prisma.experiment.findMany({
      where: { relatedHypothesisId: hypothesisId },
    });

    if (allExperiments.length === 0) {
      throw new NotFoundException('no experiment found');
    }

    return allExperiments;
  }

  async findExperimentById(id: string) {
    const experiment = await this.prisma.experiment.findUnique({
      where: { id },
    });

    if (!experiment) {
      throw new NotFoundException('experiment not found');
    }

    return experiment;
  }

  async createExperiment(ideaId: string, dto: CreateExperimentDto) {
    const experiment = await this.prisma.experiment.create({
      data: {
        ideaId,
        title: dto.title,
        relatedHypothesisId: dto.relatedHypothesisId,
        objective: dto.objective,
        method: dto.method,
        targetAudience: dto.targetAudience,
        successCriteria: dto.successCriteria,
        expectedEvidence: dto.expectedEvidence,
        status: dto.status,
        startDate: dto.startDate,
        endDate: dto.endDate,
        observations: dto.observations,
        notes: dto.notes,
        isDraft: dto.isDraft,
      },
    });

    return experiment;
  }

  async updateExperiment(id: string, dto: UpdateExperimentDto) {
    const experiment = await this.prisma.experiment.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.relatedHypothesisId !== undefined && {
          relatedHypothesisId: dto.relatedHypothesisId,
        }),
        ...(dto.objective !== undefined && { objective: dto.objective }),
        ...(dto.method !== undefined && { method: dto.method }),
        ...(dto.targetAudience !== undefined && {
          targetAudience: dto.targetAudience,
        }),
        ...(dto.successCriteria !== undefined && {
          successCriteria: dto.successCriteria,
        }),
        ...(dto.expectedEvidence !== undefined && {
          expectedEvidence: dto.expectedEvidence,
        }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.startDate !== undefined && { startDate: dto.startDate }),
        ...(dto.endDate !== undefined && { endDate: dto.endDate }),
        ...(dto.observations !== undefined && {
          observations: dto.observations,
        }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
        ...(dto.isDraft !== undefined && { isDraft: dto.isDraft }),
      },
    });

    return experiment;
  }

  async removeExperiment(id: string) {
    return await this.prisma.experiment.delete({ where: { id } });
  }

  //   /---Evidence--------------/

  async findAllEvidenceByIdea(ideaId: string) {
    const allEvidence = await this.prisma.evidenceItem.findMany({
      where: { ideaId },
    });

    if (allEvidence.length === 0) {
      throw new NotFoundException('no evidence found');
    }

    return allEvidence;
  }

  async findAllEvidenceByExperiment(experimentId: string) {
    const experiment = await this.prisma.experiment.findUnique({
      where: { id: experimentId },
    });

    if (!experiment) {
      throw new NotFoundException('experiment not found');
    }

    const allEvidence = await this.prisma.evidenceItem.findMany({
      where: { experiment: { id: experimentId } },
    });

    if (allEvidence.length === 0) {
      throw new NotFoundException('no evidence found');
    }

    return allEvidence;
  }

  async findAllEvidenceByHypothesis(hypothesisId: string) {
    const hypothesis = await this.prisma.hypothesis.findUnique({
      where: { id: hypothesisId },
    });

    if (!hypothesis) {
      throw new NotFoundException('hypothesis not found');
    }

    const allEvidence = await this.prisma.evidenceItem.findMany({
      where: { relatedHypothesisId: hypothesisId },
    });

    if (allEvidence.length === 0) {
      throw new NotFoundException('no evidence found');
    }

    return allEvidence;
  }

  async findEvidenceById(id: string) {
    const evidence = await this.prisma.evidenceItem.findUnique({
      where: { id },
    });

    if (!evidence) {
      throw new NotFoundException('evidence not found');
    }

    return evidence;
  }

  async createEvidence(ideaId: string, dto: CreateEvidenceDto) {
    const evidence = await this.prisma.evidenceItem.create({
      data: {
        ideaId,
        title: dto.title,
        relatedExperimentId: dto.relatedExperimentId,
        relatedHypothesisId: dto.relatedHypothesisId,
        type: dto.type,
        sourceLabel: dto.sourceLabel,
        date: dto.date,
        observation: dto.observation,
        interpretation: dto.interpretation,
        limitations: dto.limitations,
        isDraft: dto.isDraft,
      },
    });

    return evidence;
  }

  async updateEvidence(id: string, dto: UpdateEvidenceDto) {
    const evidence = await this.prisma.evidenceItem.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.relatedExperimentId !== undefined && {
          relatedExperimentId: dto.relatedExperimentId,
        }),
        ...(dto.relatedHypothesisId !== undefined && {
          relatedHypothesisId: dto.relatedHypothesisId,
        }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.sourceLabel !== undefined && { sourceLabel: dto.sourceLabel }),
        ...(dto.date !== undefined && { date: dto.date }),
        ...(dto.observation !== undefined && { observation: dto.observation }),
        ...(dto.interpretation !== undefined && {
          interpretation: dto.interpretation,
        }),
        ...(dto.limitations !== undefined && { limitations: dto.limitations }),
        ...(dto.isDraft !== undefined && { isDraft: dto.isDraft }),
      },
    });

    return evidence;
  }

  async removeEvidence(id: string) {
    return await this.prisma.evidenceItem.delete({ where: { id } });
  }
}
