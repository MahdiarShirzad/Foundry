import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompetitorDto } from './dto/create-competitor.dto';
import { UpdateCompetitorDto } from './dto/update-competitor.dto';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { UpdateSegmentDto } from './dto/update-segment.dto';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { CreateResearchNoteDto } from './dto/create-research-note.dto';

@Injectable()
export class MarketIntelligenceService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── MarketIdea ───────────────────────────────

  async getOrCreate(ideaId: string, workspaceId: string) {
    const idea = await this.prisma.idea.findUnique({ where: { id: ideaId } });
    if (!idea) throw new NotFoundException('Idea not found');

    const existing = await this.prisma.marketIdea.findUnique({
      where: { ideaId },
    });
    if (existing) return existing;

    return this.prisma.marketIdea.create({
      data: { ideaId, workspaceId },
    });
  }

  async getFullAggregate(ideaId: string) {
    const market = await this.prisma.marketIdea.findUnique({
      where: { ideaId },
      include: {
        competitors: true,
        segments: true,
        opportunities: true,
        notes: true,
      },
    });
    if (!market) throw new NotFoundException('MarketIdea not found');
    return market;
  }

  // ─── Helper ───────────────────────────────────

  private async resolveMarketIdeaId(ideaId: string): Promise<string> {
    const market = await this.prisma.marketIdea.findUnique({
      where: { ideaId },
    });
    if (!market) throw new NotFoundException('MarketIdea not found');
    return market.id;
  }

  // ─── Competitors ──────────────────────────────

  async addCompetitor(ideaId: string, dto: CreateCompetitorDto) {
    const marketIdeaId = await this.resolveMarketIdeaId(ideaId);
    return this.prisma.competitor.create({
      data: {
        marketIdeaId,
        name: dto.name,
        website: dto.website,
        description: dto.description,
        strengths: dto.strengths ?? [],
        weaknesses: dto.weaknesses ?? [], // ← fix: strengths بود
        pricing: dto.pricing,
        targetAudience: dto.targetAudience,
      },
    });
  }

  async updateCompetitor(id: string, dto: UpdateCompetitorDto) {
    return this.prisma.competitor.update({
      where: { id },
      data: {
        name: dto.name,
        website: dto.website,
        description: dto.description,
        strengths: dto.strengths,
        weaknesses: dto.weaknesses, // ← fix: strengths بود
        pricing: dto.pricing,
        targetAudience: dto.targetAudience,
      },
    });
  }

  async removeCompetitor(id: string) {
    return this.prisma.competitor.delete({ where: { id } });
  }

  // ─── Segments ─────────────────────────────────

  async addSegment(ideaId: string, dto: CreateSegmentDto) {
    const marketIdeaId = await this.resolveMarketIdeaId(ideaId);
    return this.prisma.segment.create({
      data: {
        marketIdeaId,
        name: dto.name,
        description: dto.description,
        size: dto.size,
        painPoints: dto.painPoints ?? [],
      },
    });
  }

  async updateSegment(id: string, dto: UpdateSegmentDto) {
    return this.prisma.segment.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        size: dto.size,
        painPoints: dto.painPoints,
      },
    });
  }

  async removeSegment(id: string) {
    return this.prisma.segment.delete({ where: { id } });
  }

  // ─── Opportunities ────────────────────────────

  async addOpportunity(ideaId: string, dto: CreateOpportunityDto) {
    const marketIdeaId = await this.resolveMarketIdeaId(ideaId);
    return this.prisma.opportunity.create({
      data: {
        marketIdeaId,
        title: dto.title,
        description: dto.description,
        significance: dto.significance,
        segmentId: dto.segmentId,
      },
    });
  }

  async updateOpportunity(id: string, dto: UpdateOpportunityDto) {
    return this.prisma.opportunity.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        significance: dto.significance,
        segmentId: dto.segmentId,
      },
    });
  }

  async removeOpportunity(id: string) {
    return this.prisma.opportunity.delete({ where: { id } });
  }

  // ─── Research Notes ───────────────────────────

  async addNote(ideaId: string, dto: CreateResearchNoteDto) {
    const marketIdeaId = await this.resolveMarketIdeaId(ideaId);
    return this.prisma.researchNote.create({
      data: {
        marketIdeaId,
        relatedType: dto.relatedType,
        relatedId: dto.relatedId,
        body: dto.body,
        author: dto.author,
      },
    });
  }

  async removeNote(id: string) {
    return this.prisma.researchNote.delete({ where: { id } });
  }
}
