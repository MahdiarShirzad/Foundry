import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { WorkspaceService } from '../workspace/workspace.service';
import { ProductService } from './product.service';
import { UpdateProductDto } from './dto/update-product.dto';
import type { Request } from 'express';

@Controller('product')
export class ProductController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly productService: ProductService,
    private readonly updateProductDto: UpdateProductDto,
  ) {}

  private async getWorkspaceOrThrow(userId: string) {
    const workspace = await this.workspaceService.findByUserId(userId);
    if (!workspace) throw new NotFoundException('Workspace not found');
    return workspace;
  }

  @Get()
  async getProduct(@Req() req: Request) {
    const userId = req.user!.userId;
    const workspace = await this.getWorkspaceOrThrow(userId);

    const product = await this.productService.findAllProducts(workspace.id);
    return product;
  }

  @Post()
  async createProduct(@Req() req: Request, @Body() dto: UpdateProductDto) {
    const userId = req.user!.userId;
    const workspace = await this.getWorkspaceOrThrow(userId);
    if (!workspace) {
      throw new NotFoundException('workspace not found');
    }
    return this.productService.createProduct(workspace.id, dto.name);
  }

  @Get(':id')
  async findProductById(@Req() req: Request) {
    const userId = req.user!.userId;
    const workspace = await this.getWorkspaceOrThrow(userId);
    return this.productService.findProductById(
      req.params.id as string,
      workspace.id,
    );
  }

  @Patch(':id')
  async updateProduct(@Req() req: Request, @Body() dto: UpdateProductDto) {
    const userId = req.user!.userId;
    const workspace = await this.getWorkspaceOrThrow(userId);
    return this.productService.updateProduct(
      req.params.id as string,
      dto.name,
      workspace.id,
    );
  }

  @Delete(':id')
  async deleteProduct(@Req() req: Request) {
    const userId = req.user!.userId;
    const workspace = await this.getWorkspaceOrThrow(userId);
    return this.productService.deleteProduct(
      req.params.id as string,
      workspace.id,
    );
  }
}
