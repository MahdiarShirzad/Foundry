import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import { CreateIdeaNoteDto } from './dto/create-idea-note.dto';

@Injectable()
export class IdeaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllIdeas(productId: string) {
    const products = await this.prisma.idea.findMany({
      where: {
        productId,
      },
    });

    if (!products) {
      throw new NotFoundException('no products found');
    }
    return products;
  }

  async findIdeaById(id: string) {
    const product = this.prisma.idea.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundException('porduct not found');
    }

    return product;
  }

  async createIdea(dto: CreateIdeaDto) {
    const count = await this.prisma.idea.count({
      where: { workspaceId: dto.workspaceId },
    });

    const ref = await this.generateRef(dto.workspaceId);

    const idea = await this.prisma.idea.create({
      data: {
        ref,
        name: dto.name,
        workspaceId: dto.workspaceId,
        productId: dto.productId,
        headline: dto.headline,
        summary: dto.summary,
        problem: dto.problem,
        audience: dto.audience,
        solution: dto.solution,
        category: dto.category,
        tags: dto.tags ?? [],
        status: dto.status,
        source: dto.source,
        context: dto.context,
        openQuestions: dto.openQuestions ?? [],
      },
    });

    return idea;
  }

  async updateIdea(id: string, dto: UpdateIdeaDto) {
    await this.findIdeaById(id);

    const { workspaceId, productId, ...updateData } = dto;

    return this.prisma.idea.update({
      where: { id },
      data: updateData,
    });
  }

  async removeIdea(id: string) {
    await this.findIdeaById(id);

    return this.prisma.idea.delete({
      where: { id },
    });
  }

  async addNote(ideaId: string, dto: CreateIdeaNoteDto) {
    const idea = await this.prisma.idea.findUnique({
      where: { id: ideaId },
    });

    if (!idea) throw new NotFoundException('idea not found');

    return this.prisma.ideaNote.create({
      data: {
        ideaId,
        author: dto.author,
        initials: dto.initials,
        body: dto.body,
      },
    });
  }

  async removeNote(ideaId: string, noteId: string) {
    const note = await this.prisma.ideaNote.findUnique({
      where: { id: noteId },
    });

    if (!note || note.ideaId !== ideaId) {
      throw new NotFoundException('note not found');
    }

    return this.prisma.ideaNote.delete({
      where: { id: noteId },
    });
  }

  private async generateRef(workspaceId: string): Promise<string> {
    const count = await this.prisma.idea.count({
      where: { workspaceId },
    });

    return `IDEA-${String(count + 1).padStart(3, '0')}`;
  }
}
