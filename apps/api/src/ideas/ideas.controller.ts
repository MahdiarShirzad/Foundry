import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IdeaService } from './ideas.service';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import { CreateIdeaNoteDto } from './dto/create-idea-note.dto';

@ApiTags('Ideas')
@ApiCookieAuth('access_token')
@ApiBearerAuth('bearer')
@Controller('ideas')
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @Get()
  @ApiOperation({ summary: 'Get all ideas for a product' })
  @ApiResponse({ status: 200, description: 'Ideas found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAllIdeas(@Query('productId') productId: string) {
    return this.ideaService.findAllIdeas(productId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an idea by ID' })
  @ApiResponse({ status: 200, description: 'Idea found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Idea not found' })
  async findIdeaById(@Param('id') id: string) {
    return this.ideaService.findIdeaById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new idea' })
  @ApiBody({ type: CreateIdeaDto })
  @ApiResponse({ status: 201, description: 'Idea created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createIdea(@Body() dto: CreateIdeaDto) {
    return this.ideaService.createIdea(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an idea by ID' })
  @ApiBody({ type: UpdateIdeaDto })
  @ApiResponse({ status: 200, description: 'Idea updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Idea not found' })
  async updateIdea(@Param('id') id: string, @Body() dto: UpdateIdeaDto) {
    return this.ideaService.updateIdea(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an idea by ID' })
  @ApiResponse({ status: 200, description: 'Idea deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Idea not found' })
  async deleteIdea(@Param('id') id: string) {
    return this.ideaService.removeIdea(id);
  }

  @Post(':id/notes')
  @ApiOperation({ summary: 'Add a note to an idea' })
  @ApiBody({ type: CreateIdeaNoteDto })
  @ApiResponse({ status: 201, description: 'Note added' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Idea not found' })
  async addNote(@Param('id') ideaId: string, @Body() dto: CreateIdeaNoteDto) {
    return this.ideaService.addNote(ideaId, dto);
  }

  @Delete(':id/notes/:noteId')
  @ApiOperation({ summary: 'Remove a note from an idea' })
  @ApiResponse({ status: 200, description: 'Note removed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Idea or note not found' })
  async removeNote(
    @Param('id') ideaId: string,
    @Param('noteId') noteId: string,
  ) {
    return this.ideaService.removeNote(ideaId, noteId);
  }
}
