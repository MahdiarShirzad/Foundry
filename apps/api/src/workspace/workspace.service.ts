import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string) {
    const member = await this.prisma.workspaceMember.findFirst({
      where: {
        userId,
      },
      include: { workspace: true },
    });

    return member?.workspace ?? null;
  }

  async update(newName: string, userId: string) {
    const workspace = await this.findByUserId(userId);
    if (!workspace) {
      throw new NotFoundException('Workspace not found for the user');
    }

    return this.prisma.workspace.update({
      where: { id: workspace.id },
      data: { name: newName },
    });
  }
}
