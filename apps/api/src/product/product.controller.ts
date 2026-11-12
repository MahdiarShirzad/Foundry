import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { WorkspaceService } from '../workspace/workspace.service';
import { ProductService } from './product.service';
import { UpdateProductDto } from './dto/update-product.dto';
import type { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Products')
@ApiCookieAuth('access_token')
@ApiBearerAuth('bearer')
@Controller('products')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly productService: ProductService,
  ) {}

  private async getWorkspaceOrThrow(userId: string) {
    const workspace = await this.workspaceService.findByUserId(userId);
    if (!workspace) throw new NotFoundException('Workspace not found');
    return workspace;
  }

  @Get()
  @ApiOperation({ summary: 'Get all products for the current workspace' })
  @ApiResponse({
    status: 200,
    description: 'Products found',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  async getProduct(@Req() req: Request) {
    const userId = req.user!.userId;
    const workspace = await this.getWorkspaceOrThrow(userId);

    const product = await this.productService.findAllProducts(workspace.id);
    return product;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product in the current workspace' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 201, description: 'Product created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  async createProduct(@Req() req: Request, @Body() dto: UpdateProductDto) {
    const userId = req.user!.userId;
    const workspace = await this.getWorkspaceOrThrow(userId);
    if (!workspace) {
      throw new NotFoundException('workspace not found');
    }
    return this.productService.createProduct(workspace.id, dto.name);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findProductById(@Req() req: Request) {
    const userId = req.user!.userId;
    const workspace = await this.getWorkspaceOrThrow(userId);
    return this.productService.findProductById(
      req.params.id as string,
      workspace.id,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Product updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
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
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({ status: 200, description: 'Product deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async deleteProduct(@Req() req: Request) {
    const userId = req.user!.userId;
    const workspace = await this.getWorkspaceOrThrow(userId);
    return this.productService.deleteProduct(
      req.params.id as string,
      workspace.id,
    );
  }
}
