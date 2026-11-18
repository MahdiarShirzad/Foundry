import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { CreateFeedbackItemDto } from './dto/create-feedback-item.dto';
import { UpdateFeedbackItemDto } from './dto/update-feedback-item.dto';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { CreateFeatureRequestDto } from './dto/create-feature-request.dto';
import { UpdateFeatureRequestDto } from './dto/update-feature-request.dto';
import { CreateProductAreaDto } from './dto/create-product-area.dto';
import { UpdateProductAreaDto } from './dto/update-product-area.dto';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
  ) {}

  // ─── Feedback items ───────────────────────────

  private async findFeedbackItemOrThrow(productId: string, id: string) {
    const item = await this.prisma.feedbackItem.findFirst({
      where: { id, productId },
    });
    if (!item) throw new NotFoundException('Feedback item not found!');
    return item;
  }

  async findAllFeedbackItems(productId: string) {
    return this.prisma.feedbackItem.findMany({ where: { productId } });
  }

  async findFeedbackItemById(productId: string, id: string) {
    return this.findFeedbackItemOrThrow(productId, id);
  }

  async createFeedbackItem(productId: string, dto: CreateFeedbackItemDto) {
    return this.prisma.feedbackItem.create({
      data: {
        productId,
        title: dto.title,
        excerpt: dto.excerpt,
        description: dto.description,
        category: dto.category,
        source: dto.source,
        date: dto.date,
        priority: dto.priority,
        status: dto.status,
        productArea: dto.productArea,
        internalNotes: dto.internalNotes,
        followUpAction: dto.followUpAction,
      },
    });
  }

  async updateFeedbackItem(
    productId: string,
    id: string,
    dto: UpdateFeedbackItemDto,
  ) {
    await this.findFeedbackItemOrThrow(productId, id);
    return this.prisma.feedbackItem.update({
      where: { id },
      data: {
        title: dto.title,
        excerpt: dto.excerpt,
        description: dto.description,
        category: dto.category,
        source: dto.source,
        date: dto.date,
        priority: dto.priority,
        status: dto.status,
        productArea: dto.productArea,
        internalNotes: dto.internalNotes,
        followUpAction: dto.followUpAction,
      },
    });
  }

  async removeFeedbackItem(productId: string, id: string) {
    await this.findFeedbackItemOrThrow(productId, id);
    return this.prisma.feedbackItem.delete({ where: { id } });
  }

  // ─── Themes ───────────────────────────────────

  private async findThemeOrThrow(productId: string, id: string) {
    const theme = await this.prisma.theme.findFirst({
      where: { id, productId },
    });
    if (!theme) throw new NotFoundException('Theme not found!');
    return theme;
  }

  async findAllThemes(productId: string) {
    return this.prisma.theme.findMany({ where: { productId } });
  }

  async findThemeById(productId: string, id: string) {
    return this.findThemeOrThrow(productId, id);
  }

  async createTheme(productId: string, dto: CreateThemeDto) {
    return this.prisma.theme.create({
      data: {
        productId,
        name: dto.name,
        explanation: dto.explanation,
        relatedFeedbackIds: dto.relatedFeedbackIds,
        productArea: dto.productArea,
        importance: dto.importance,
        reviewStatus: dto.reviewStatus,
        internalNotes: dto.internalNotes,
      },
    });
  }

  async updateTheme(productId: string, id: string, dto: UpdateThemeDto) {
    await this.findThemeOrThrow(productId, id);
    return this.prisma.theme.update({
      where: { id },
      data: {
        name: dto.name,
        explanation: dto.explanation,
        relatedFeedbackIds: dto.relatedFeedbackIds,
        productArea: dto.productArea,
        importance: dto.importance,
        reviewStatus: dto.reviewStatus,
        internalNotes: dto.internalNotes,
      },
    });
  }

  async removeTheme(productId: string, id: string) {
    await this.findThemeOrThrow(productId, id);
    return this.prisma.theme.delete({ where: { id } });
  }

  // ─── Feature requests ─────────────────────────

  private async findFeatureRequestOrThrow(productId: string, id: string) {
    const request = await this.prisma.featureRequest.findFirst({
      where: { id, productId },
    });
    if (!request) throw new NotFoundException('Feature request not found!');
    return request;
  }

  async findAllFeatureRequests(productId: string) {
    return this.prisma.featureRequest.findMany({ where: { productId } });
  }

  async findFeatureRequestById(productId: string, id: string) {
    return this.findFeatureRequestOrThrow(productId, id);
  }

  async createFeatureRequest(
    productId: string,
    dto: CreateFeatureRequestDto,
  ) {
    return this.prisma.featureRequest.create({
      data: {
        productId,
        title: dto.title,
        description: dto.description,
        userProblem: dto.userProblem,
        requestedCapability: dto.requestedCapability,
        relatedFeedbackIds: dto.relatedFeedbackIds,
        productArea: dto.productArea,
        priority: dto.priority,
        status: dto.status,
        roadmapReference: dto.roadmapReference,
      },
    });
  }

  async updateFeatureRequest(
    productId: string,
    id: string,
    dto: UpdateFeatureRequestDto,
  ) {
    await this.findFeatureRequestOrThrow(productId, id);
    return this.prisma.featureRequest.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        userProblem: dto.userProblem,
        requestedCapability: dto.requestedCapability,
        relatedFeedbackIds: dto.relatedFeedbackIds,
        productArea: dto.productArea,
        priority: dto.priority,
        status: dto.status,
        roadmapReference: dto.roadmapReference,
      },
    });
  }

  async removeFeatureRequest(productId: string, id: string) {
    await this.findFeatureRequestOrThrow(productId, id);
    return this.prisma.featureRequest.delete({ where: { id } });
  }

  // ─── Product areas ────────────────────────────

  private async findProductAreaOrThrow(productId: string, id: string) {
    const area = await this.prisma.productAreaDefinition.findFirst({
      where: { id, productId },
    });
    if (!area) throw new NotFoundException('Product area not found!');
    return area;
  }

  async findAllProductAreas(productId: string) {
    return this.prisma.productAreaDefinition.findMany({ where: { productId } });
  }

  async findProductAreaById(productId: string, id: string) {
    return this.findProductAreaOrThrow(productId, id);
  }

  async createProductArea(productId: string, dto: CreateProductAreaDto) {
    return this.prisma.productAreaDefinition.create({
      data: {
        productId,
        name: dto.name,
        description: dto.description,
        summary: dto.summary,
      },
    });
  }

  async updateProductArea(
    productId: string,
    id: string,
    dto: UpdateProductAreaDto,
  ) {
    await this.findProductAreaOrThrow(productId, id);
    return this.prisma.productAreaDefinition.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        summary: dto.summary,
      },
    });
  }

  async removeProductArea(productId: string, id: string) {
    await this.findProductAreaOrThrow(productId, id);
    return this.prisma.productAreaDefinition.delete({ where: { id } });
  }

  // ─── AI ───────────────────────────────────────

  async summarizeFeedback(productId: string) {
    const items = await this.prisma.feedbackItem.findMany({
      where: { productId },
    });

    const feedbackItems = items
      .map(
        (item) =>
          `- [${item.category}] ${item.title}: ${
            item.description ?? item.excerpt ?? ''
          }`,
      )
      .join('\n');

    return this.ai.generate(
      `Summarize the following user feedback into 3-5 key themes with actionable insights: ${
        feedbackItems || 'no feedback submitted yet'
      }`,
    );
  }
}
