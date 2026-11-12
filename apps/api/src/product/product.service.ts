import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllProducts(workspaceId: string) {
    return this.prisma.product.findMany({
      where: {
        workspaceId,
      },
    });
  }

  async findProductById(productId: string, workspaceId: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product || product.workspaceId !== workspaceId) {
      throw new NotFoundException(
        'Product not found in the specified workspace',
      );
    }

    return product;
  }

  async createProduct(workspaceId: string, name: string) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');

    return await this.prisma.product.create({
      data: {
        name,
        workspaceId,
        slug,
      },
    });
  }

  async updateProduct(id: string, workspaceId: string, name: string) {
    await this.findProductById(id, workspaceId);

    return await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
      },
    });
  }

  async deleteProduct(id: string, workspaceId: string) {
    await this.findProductById(id, workspaceId);

    return await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
