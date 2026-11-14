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
import { IdeaService } from './ideas.service';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import { CreateIdeaNoteDto } from './dto/create-idea-note.dto';

@Controller('ideas')
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @Get()
  async findAllIdeas(@Query('productId') productId: string) {
    return this.ideaService.findAllIdeas(productId);
  }

  @Get(':id')
  async findIdeaById(@Param('id') id: string) {
    return this.ideaService.findIdeaById(id);
  }

  @Post()
  async createIdea(@Body() dto: CreateIdeaDto) {
    return this.ideaService.createIdea(dto);
  }

  @Patch(':id')
  async updateIdea(@Param('id') id: string, @Body() dto: UpdateIdeaDto) {
    return this.ideaService.updateIdea(id, dto);
  }

  @Delete(':id')
  async deleteIdea(@Param('id') id: string) {
    return this.ideaService.removeIdea(id);
  }

  @Post(':id/notes')
  async addNote(@Param('id') ideaId: string, @Body() dto: CreateIdeaNoteDto) {
    return this.ideaService.addNote(ideaId, dto);
  }

  @Delete(':id/notes/:noteId')
  async removeNote(
    @Param('id') ideaId: string,
    @Param('noteId') noteId: string,
  ) {
    return this.ideaService.removeNote(ideaId, noteId);
  }
}
