import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { CreateMvpProjectDto } from './dto/create-mvp-project.dto';
import { UpdateMvpProjectDto } from './dto/update-mvp-project.dto';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { CreateScopeItemDto } from './dto/create-scope-item.dto';
import { UpdateScopeItemDto } from './dto/update-scope-item.dto';

@Injectable()
export class MvpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
  ) {}

  // ─── Projects ─────────────────────────────────

  private async findProjectOrThrow(productId: string, id: string) {
    const project = await this.prisma.mVPProject.findFirst({
      where: { id, productId },
    });
    if (!project) throw new NotFoundException('MVP project not found!');
    return project;
  }

  async findAllProjects(productId: string) {
    return this.prisma.mVPProject.findMany({ where: { productId } });
  }

  async findProjectById(productId: string, id: string) {
    return this.findProjectOrThrow(productId, id);
  }

  async createProject(productId: string, dto: CreateMvpProjectDto) {
    return this.prisma.mVPProject.create({
      data: {
        productId,
        name: dto.name,
        ref: dto.ref,
        status: dto.status,
        concept: dto.concept,
        problem: dto.problem,
        targetAudience: dto.targetAudience,
        valueProp: dto.valueProp,
        mvpObjective: dto.mvpObjective,
        currentScope: dto.currentScope,
        essentialCapabilities: dto.essentialCapabilities,
        explicitExclusions: dto.explicitExclusions,
        successCriteria: dto.successCriteria,
        structure: dto.structure,
        openDecisions: dto.openDecisions,
      },
    });
  }

  async updateProject(
    productId: string,
    id: string,
    dto: UpdateMvpProjectDto,
  ) {
    await this.findProjectOrThrow(productId, id);
    return this.prisma.mVPProject.update({
      where: { id },
      data: {
        name: dto.name,
        ref: dto.ref,
        status: dto.status,
        concept: dto.concept,
        problem: dto.problem,
        targetAudience: dto.targetAudience,
        valueProp: dto.valueProp,
        mvpObjective: dto.mvpObjective,
        currentScope: dto.currentScope,
        essentialCapabilities: dto.essentialCapabilities,
        explicitExclusions: dto.explicitExclusions,
        successCriteria: dto.successCriteria,
        structure: dto.structure,
        openDecisions: dto.openDecisions,
      },
    });
  }

  async removeProject(productId: string, id: string) {
    await this.findProjectOrThrow(productId, id);
    return this.prisma.mVPProject.delete({ where: { id } });
  }

  // ─── Features ─────────────────────────────────

  private async findFeatureOrThrow(
    productId: string,
    projectId: string,
    id: string,
  ) {
    const feature = await this.prisma.feature.findFirst({
      where: {
        id,
        projectId,
        project: { productId },
      },
    });
    if (!feature) throw new NotFoundException('Feature not found!');
    return feature;
  }

  async findAllFeatures(productId: string, projectId: string) {
    await this.findProjectOrThrow(productId, projectId);
    return this.prisma.feature.findMany({ where: { projectId } });
  }

  async findFeatureById(productId: string, projectId: string, id: string) {
    return this.findFeatureOrThrow(productId, projectId, id);
  }

  async createFeature(
    productId: string,
    projectId: string,
    dto: CreateFeatureDto,
  ) {
    await this.findProjectOrThrow(productId, projectId);
    return this.prisma.feature.create({
      data: {
        projectId,
        name: dto.name,
        description: dto.description,
        userProblem: dto.userProblem,
        targetUser: dto.targetUser,
        area: dto.area,
        priority: dto.priority,
        scope: dto.scope,
        status: dto.status,
        userStory: dto.userStory,
        acceptanceCriteria: dto.acceptanceCriteria,
        behavior: dto.behavior,
        edgeCases: dto.edgeCases,
        dependencies: dto.dependencies,
        openQuestions: dto.openQuestions,
        designNotes: dto.designNotes,
      },
    });
  }

  async updateFeature(
    productId: string,
    projectId: string,
    id: string,
    dto: UpdateFeatureDto,
  ) {
    await this.findFeatureOrThrow(productId, projectId, id);
    return this.prisma.feature.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        userProblem: dto.userProblem,
        targetUser: dto.targetUser,
        area: dto.area,
        priority: dto.priority,
        scope: dto.scope,
        status: dto.status,
        userStory: dto.userStory,
        acceptanceCriteria: dto.acceptanceCriteria,
        behavior: dto.behavior,
        edgeCases: dto.edgeCases,
        dependencies: dto.dependencies,
        openQuestions: dto.openQuestions,
        designNotes: dto.designNotes,
      },
    });
  }

  async removeFeature(productId: string, projectId: string, id: string) {
    await this.findFeatureOrThrow(productId, projectId, id);
    return this.prisma.feature.delete({ where: { id } });
  }

  // ─── Scope items ──────────────────────────────

  private async findScopeItemOrThrow(
    productId: string,
    projectId: string,
    id: string,
  ) {
    const item = await this.prisma.scopeItem.findFirst({
      where: {
        id,
        projectId,
        project: { productId },
      },
    });
    if (!item) throw new NotFoundException('Scope item not found!');
    return item;
  }

  async findAllScopeItems(productId: string, projectId: string) {
    await this.findProjectOrThrow(productId, projectId);
    return this.prisma.scopeItem.findMany({ where: { projectId } });
  }

  async createScopeItem(
    productId: string,
    projectId: string,
    dto: CreateScopeItemDto,
  ) {
    await this.findProjectOrThrow(productId, projectId);
    return this.prisma.scopeItem.create({
      data: {
        projectId,
        name: dto.name,
        explanation: dto.explanation,
        category: dto.category,
        status: dto.status,
        featureId: dto.featureId,
      },
    });
  }

  async updateScopeItem(
    productId: string,
    projectId: string,
    id: string,
    dto: UpdateScopeItemDto,
  ) {
    await this.findScopeItemOrThrow(productId, projectId, id);
    return this.prisma.scopeItem.update({
      where: { id },
      data: {
        name: dto.name,
        explanation: dto.explanation,
        category: dto.category,
        status: dto.status,
        featureId: dto.featureId,
      },
    });
  }

  async removeScopeItem(productId: string, projectId: string, id: string) {
    await this.findScopeItemOrThrow(productId, projectId, id);
    return this.prisma.scopeItem.delete({ where: { id } });
  }

  // ─── AI ───────────────────────────────────────

  async suggestFeatures(productId: string, projectId: string) {
    const project = await this.findProjectOrThrow(productId, projectId);

    return this.ai.generate(
      `Given this MVP concept: ${project.concept ?? ''}, problem: ${
        project.problem ?? ''
      }, target audience: ${
        project.targetAudience ?? ''
      }, suggest 5 essential features with name, description, and userProblem.`,
    );
  }

  async generateUserStory(
    productId: string,
    projectId: string,
    featureId: string,
  ) {
    const feature = await this.findFeatureOrThrow(
      productId,
      projectId,
      featureId,
    );

    return this.ai.generate(
      `Write a user story and acceptanceCriteria[] for this MVP feature. ` +
        `Feature: ${feature.name}. Description: ${
          feature.description ?? ''
        }. User problem: ${feature.userProblem ?? ''}. ` +
        `Target user: ${feature.targetUser ?? ''}. ` +
        `Return the user story followed by a short list of acceptance criteria.`,
    );
  }
}
