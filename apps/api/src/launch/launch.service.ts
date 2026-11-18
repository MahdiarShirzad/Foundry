import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { CreateLaunchTaskDto } from './dto/create-launch-task.dto';
import { UpdateLaunchTaskDto } from './dto/update-launch-task.dto';
import { CreateLaunchAssetDto } from './dto/create-launch-asset.dto';
import { UpdateLaunchAssetDto } from './dto/update-launch-asset.dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';

@Injectable()
export class LaunchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
  ) {}

  // ─── Tasks ────────────────────────────────────

  private async findTaskOrThrow(productId: string, id: string) {
    const task = await this.prisma.launchTask.findFirst({
      where: { id, productId },
    });
    if (!task) throw new NotFoundException('Launch task not found!');
    return task;
  }

  async findAllTasks(productId: string) {
    return this.prisma.launchTask.findMany({ where: { productId } });
  }

  async findTaskById(productId: string, id: string) {
    return this.findTaskOrThrow(productId, id);
  }

  async createTask(productId: string, dto: CreateLaunchTaskDto) {
    return this.prisma.launchTask.create({
      data: {
        productId,
        title: dto.title,
        description: dto.description,
        phase: dto.phase,
        date: dto.date,
        status: dto.status,
        owner: dto.owner,
        relatedAssetId: dto.relatedAssetId,
        relatedChannelId: dto.relatedChannelId,
      },
    });
  }

  async updateTask(productId: string, id: string, dto: UpdateLaunchTaskDto) {
    await this.findTaskOrThrow(productId, id);
    return this.prisma.launchTask.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        phase: dto.phase,
        date: dto.date,
        status: dto.status,
        owner: dto.owner,
        relatedAssetId: dto.relatedAssetId,
        relatedChannelId: dto.relatedChannelId,
      },
    });
  }

  async removeTask(productId: string, id: string) {
    await this.findTaskOrThrow(productId, id);
    return this.prisma.launchTask.delete({ where: { id } });
  }

  // ─── Assets ───────────────────────────────────

  private async findAssetOrThrow(productId: string, id: string) {
    const asset = await this.prisma.launchAsset.findFirst({
      where: { id, productId },
    });
    if (!asset) throw new NotFoundException('Launch asset not found!');
    return asset;
  }

  async findAllAssets(productId: string) {
    return this.prisma.launchAsset.findMany({ where: { productId } });
  }

  async findAssetById(productId: string, id: string) {
    return this.findAssetOrThrow(productId, id);
  }

  async createAsset(productId: string, dto: CreateLaunchAssetDto) {
    return this.prisma.launchAsset.create({
      data: {
        productId,
        title: dto.title,
        type: dto.type,
        preview: dto.preview,
        status: dto.status,
        lastUpdated: dto.lastUpdated,
        relatedChannelId: dto.relatedChannelId,
      },
    });
  }

  async updateAsset(
    productId: string,
    id: string,
    dto: UpdateLaunchAssetDto,
  ) {
    await this.findAssetOrThrow(productId, id);
    return this.prisma.launchAsset.update({
      where: { id },
      data: {
        title: dto.title,
        type: dto.type,
        preview: dto.preview,
        status: dto.status,
        lastUpdated: dto.lastUpdated,
        relatedChannelId: dto.relatedChannelId,
      },
    });
  }

  async removeAsset(productId: string, id: string) {
    await this.findAssetOrThrow(productId, id);
    return this.prisma.launchAsset.delete({ where: { id } });
  }

  // ─── Channels ─────────────────────────────────

  private async findChannelOrThrow(productId: string, id: string) {
    const channel = await this.prisma.channel.findFirst({
      where: { id, productId },
    });
    if (!channel) throw new NotFoundException('Channel not found!');
    return channel;
  }

  async findAllChannels(productId: string) {
    return this.prisma.channel.findMany({ where: { productId } });
  }

  async findChannelById(productId: string, id: string) {
    return this.findChannelOrThrow(productId, id);
  }

  async createChannel(productId: string, dto: CreateChannelDto) {
    return this.prisma.channel.create({
      data: {
        productId,
        name: dto.name,
        campaignObjective: dto.campaignObjective,
        targetAudience: dto.targetAudience,
        plannedActivity: dto.plannedActivity,
        phase: dto.phase,
        status: dto.status,
        relatedAssetIds: dto.relatedAssetIds,
        date: dto.date,
      },
    });
  }

  async updateChannel(
    productId: string,
    id: string,
    dto: UpdateChannelDto,
  ) {
    await this.findChannelOrThrow(productId, id);
    return this.prisma.channel.update({
      where: { id },
      data: {
        name: dto.name,
        campaignObjective: dto.campaignObjective,
        targetAudience: dto.targetAudience,
        plannedActivity: dto.plannedActivity,
        phase: dto.phase,
        status: dto.status,
        relatedAssetIds: dto.relatedAssetIds,
        date: dto.date,
      },
    });
  }

  async removeChannel(productId: string, id: string) {
    await this.findChannelOrThrow(productId, id);
    return this.prisma.channel.delete({ where: { id } });
  }

  // ─── Checklist items ──────────────────────────

  private async findChecklistItemOrThrow(productId: string, id: string) {
    const item = await this.prisma.checklistItem.findFirst({
      where: { id, productId },
    });
    if (!item) throw new NotFoundException('Checklist item not found!');
    return item;
  }

  async findAllChecklistItems(productId: string) {
    return this.prisma.checklistItem.findMany({ where: { productId } });
  }

  async findChecklistItemById(productId: string, id: string) {
    return this.findChecklistItemOrThrow(productId, id);
  }

  async createChecklistItem(productId: string, dto: CreateChecklistItemDto) {
    return this.prisma.checklistItem.create({
      data: {
        productId,
        category: dto.category,
        item: dto.item,
        completed: dto.completed,
      },
    });
  }

  async updateChecklistItem(
    productId: string,
    id: string,
    dto: UpdateChecklistItemDto,
  ) {
    await this.findChecklistItemOrThrow(productId, id);
    return this.prisma.checklistItem.update({
      where: { id },
      data: {
        category: dto.category,
        item: dto.item,
        completed: dto.completed,
      },
    });
  }

  async removeChecklistItem(productId: string, id: string) {
    await this.findChecklistItemOrThrow(productId, id);
    return this.prisma.checklistItem.delete({ where: { id } });
  }

  // ─── AI ───────────────────────────────────────

  async suggestTasks(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        mvpProjects: { select: { targetAudience: true } },
      },
    });
    if (!product) throw new NotFoundException('Product not found!');

    const targetAudience =
      product.mvpProjects
        .map((project) => project.targetAudience)
        .filter(Boolean)
        .join(', ') || 'early-stage SaaS users';

    return this.ai.generate(
      `Generate a go-to-market launch checklist for a SaaS product targeting ${targetAudience}. ` +
        `Group by phase: pre-launch, launch day, post-launch. ` +
        `Product: ${product.name}.`,
    );
  }
}
