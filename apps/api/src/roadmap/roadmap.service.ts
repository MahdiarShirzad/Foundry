import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { CreateInitiativeDto } from './dto/create-initiative.dto';
import { UpdateInitiativeDto } from './dto/update-initiative.dto';
import { CreateReleaseDto } from './dto/create-release.dto';
import { UpdateReleaseDto } from './dto/update-release.dto';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { CreatePlanningNoteDto } from './dto/create-planning-note.dto';
import { UpdatePlanningNoteDto } from './dto/update-planning-note.dto';

@Injectable()
export class RoadmapService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
  ) {}

  // ─── Initiatives ──────────────────────────────

  private async findInitiativeOrThrow(productId: string, id: string) {
    const initiative = await this.prisma.initiative.findFirst({
      where: { id, productId },
    });
    if (!initiative) throw new NotFoundException('Initiative not found!');
    return initiative;
  }

  async findAllInitiatives(productId: string) {
    return this.prisma.initiative.findMany({ where: { productId } });
  }

  async findInitiativeById(productId: string, id: string) {
    return this.findInitiativeOrThrow(productId, id);
  }

  async createInitiative(productId: string, dto: CreateInitiativeDto) {
    return this.prisma.initiative.create({
      data: {
        productId,
        name: dto.name,
        description: dto.description,
        objective: dto.objective,
        userProblem: dto.userProblem,
        priority: dto.priority,
        status: dto.status,
        period: dto.period,
        relatedFeatures: dto.relatedFeatures,
        dependencies: dto.dependencies,
        associatedMilestoneId: dto.associatedMilestoneId,
        rationale: dto.rationale,
      },
    });
  }

  async updateInitiative(
    productId: string,
    id: string,
    dto: UpdateInitiativeDto,
  ) {
    await this.findInitiativeOrThrow(productId, id);
    return this.prisma.initiative.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        objective: dto.objective,
        userProblem: dto.userProblem,
        priority: dto.priority,
        status: dto.status,
        period: dto.period,
        relatedFeatures: dto.relatedFeatures,
        dependencies: dto.dependencies,
        associatedMilestoneId: dto.associatedMilestoneId,
        rationale: dto.rationale,
      },
    });
  }

  async removeInitiative(productId: string, id: string) {
    await this.findInitiativeOrThrow(productId, id);
    return this.prisma.initiative.delete({ where: { id } });
  }

  // ─── Releases ─────────────────────────────────

  private async findReleaseOrThrow(productId: string, id: string) {
    const release = await this.prisma.release.findFirst({
      where: { id, productId },
    });
    if (!release) throw new NotFoundException('Release not found!');
    return release;
  }

  async findAllReleases(productId: string) {
    return this.prisma.release.findMany({ where: { productId } });
  }

  async findReleaseById(productId: string, id: string) {
    return this.findReleaseOrThrow(productId, id);
  }

  async createRelease(productId: string, dto: CreateReleaseDto) {
    return this.prisma.release.create({
      data: {
        productId,
        name: dto.name,
        version: dto.version,
        purpose: dto.purpose,
        plannedDate: dto.plannedDate,
        status: dto.status,
        notesPreview: dto.notesPreview,
      },
    });
  }

  async updateRelease(productId: string, id: string, dto: UpdateReleaseDto) {
    await this.findReleaseOrThrow(productId, id);
    return this.prisma.release.update({
      where: { id },
      data: {
        name: dto.name,
        version: dto.version,
        purpose: dto.purpose,
        plannedDate: dto.plannedDate,
        status: dto.status,
        notesPreview: dto.notesPreview,
      },
    });
  }

  async removeRelease(productId: string, id: string) {
    await this.findReleaseOrThrow(productId, id);
    return this.prisma.release.delete({ where: { id } });
  }

  // ─── Milestones ───────────────────────────────

  private async findMilestoneOrThrow(productId: string, id: string) {
    const milestone = await this.prisma.milestone.findFirst({
      where: { id, productId },
    });
    if (!milestone) throw new NotFoundException('Milestone not found!');
    return milestone;
  }

  async findAllMilestones(productId: string) {
    return this.prisma.milestone.findMany({ where: { productId } });
  }

  async findMilestoneById(productId: string, id: string) {
    return this.findMilestoneOrThrow(productId, id);
  }

  async createMilestone(productId: string, dto: CreateMilestoneDto) {
    return this.prisma.milestone.create({
      data: {
        productId,
        name: dto.name,
        description: dto.description,
        targetDate: dto.targetDate,
        status: dto.status,
      },
    });
  }

  async updateMilestone(
    productId: string,
    id: string,
    dto: UpdateMilestoneDto,
  ) {
    await this.findMilestoneOrThrow(productId, id);
    return this.prisma.milestone.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        targetDate: dto.targetDate,
        status: dto.status,
      },
    });
  }

  async removeMilestone(productId: string, id: string) {
    await this.findMilestoneOrThrow(productId, id);
    return this.prisma.milestone.delete({ where: { id } });
  }

  // ─── Planning notes ───────────────────────────

  private async findPlanningNoteOrThrow(productId: string, id: string) {
    const note = await this.prisma.planningNote.findFirst({
      where: { id, productId },
    });
    if (!note) throw new NotFoundException('Planning note not found!');
    return note;
  }

  async findAllPlanningNotes(productId: string) {
    return this.prisma.planningNote.findMany({ where: { productId } });
  }

  async findPlanningNoteById(productId: string, id: string) {
    return this.findPlanningNoteOrThrow(productId, id);
  }

  async createPlanningNote(productId: string, dto: CreatePlanningNoteDto) {
    return this.prisma.planningNote.create({
      data: {
        productId,
        title: dto.title,
        summary: dto.summary,
        relatedItemId: dto.relatedItemId,
        period: dto.period,
        date: dto.date,
        category: dto.category,
      },
    });
  }

  async updatePlanningNote(
    productId: string,
    id: string,
    dto: UpdatePlanningNoteDto,
  ) {
    await this.findPlanningNoteOrThrow(productId, id);
    return this.prisma.planningNote.update({
      where: { id },
      data: {
        title: dto.title,
        summary: dto.summary,
        relatedItemId: dto.relatedItemId,
        period: dto.period,
        date: dto.date,
        category: dto.category,
      },
    });
  }

  async removePlanningNote(productId: string, id: string) {
    await this.findPlanningNoteOrThrow(productId, id);
    return this.prisma.planningNote.delete({ where: { id } });
  }

  // ─── AI ───────────────────────────────────────

  async suggestInitiatives(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        mvpProjects: {
          include: {
            features: { select: { name: true, description: true } },
          },
        },
      },
    });
    if (!product) throw new NotFoundException('Product not found!');

    const features = product.mvpProjects
      .flatMap((project) => project.features)
      .map((feature) => feature.name)
      .join(', ');

    return this.ai.generate(
      `Given this product and its features, suggest 5 strategic initiatives with name, objective, priority, and period (Now/Next/Later). ` +
        `Product: ${product.name}. Features: ${features || 'none defined yet'}.`,
    );
  }
}
