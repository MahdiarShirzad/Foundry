import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { MarketIntelligenceService } from './market-intelligence.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateCompetitorDto } from './dto/create-competitor.dto';
import { UpdateCompetitorDto } from './dto/update-competitor.dto';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { UpdateSegmentDto } from './dto/update-segment.dto';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { CreateResearchNoteDto } from './dto/create-research-note.dto';

@UseGuards(AuthGuard)
@Controller('market-intelligence')
export class MarketIntelligenceController {
  constructor(
    private readonly marketIntelligenceService: MarketIntelligenceService,
  ) {}

  // ─── MarketIdea ───────────────────────────────

  @Post(':ideaId/init')
  init(
    @Param('ideaId') ideaId: string,
    @Body('workspaceId') workspaceId: string,
  ) {
    return this.marketIntelligenceService.getOrCreate(ideaId, workspaceId);
  }

  @Get(':ideaId')
  getFullAggregate(@Param('ideaId') ideaId: string) {
    return this.marketIntelligenceService.getFullAggregate(ideaId);
  }

  // ─── Competitors ──────────────────────────────

  @Post(':ideaId/competitors')
  addCompetitor(
    @Param('ideaId') ideaId: string,
    @Body() dto: CreateCompetitorDto,
  ) {
    return this.marketIntelligenceService.addCompetitor(ideaId, dto);
  }

  @Patch(':ideaId/competitors/:id')
  updateCompetitor(@Param('id') id: string, @Body() dto: UpdateCompetitorDto) {
    return this.marketIntelligenceService.updateCompetitor(id, dto);
  }

  @Delete(':ideaId/competitors/:id')
  removeCompetitor(@Param('id') id: string) {
    return this.marketIntelligenceService.removeCompetitor(id);
  }

  // ─── Segments ─────────────────────────────────

  @Post(':ideaId/segments')
  addSegment(@Param('ideaId') ideaId: string, @Body() dto: CreateSegmentDto) {
    return this.marketIntelligenceService.addSegment(ideaId, dto);
  }

  @Patch(':ideaId/segments/:id')
  updateSegment(@Param('id') id: string, @Body() dto: UpdateSegmentDto) {
    return this.marketIntelligenceService.updateSegment(id, dto);
  }

  @Delete(':ideaId/segments/:id')
  removeSegment(@Param('id') id: string) {
    return this.marketIntelligenceService.removeSegment(id);
  }

  // ─── Opportunities ────────────────────────────

  @Post(':ideaId/opportunities')
  addOpportunity(
    @Param('ideaId') ideaId: string,
    @Body() dto: CreateOpportunityDto,
  ) {
    return this.marketIntelligenceService.addOpportunity(ideaId, dto);
  }

  @Patch(':ideaId/opportunities/:id')
  updateOpportunity(
    @Param('id') id: string,
    @Body() dto: UpdateOpportunityDto,
  ) {
    return this.marketIntelligenceService.updateOpportunity(id, dto);
  }

  @Delete(':ideaId/opportunities/:id')
  removeOpportunity(@Param('id') id: string) {
    return this.marketIntelligenceService.removeOpportunity(id);
  }

  // ─── Research Notes ───────────────────────────

  @Post(':ideaId/notes')
  addNote(@Param('ideaId') ideaId: string, @Body() dto: CreateResearchNoteDto) {
    return this.marketIntelligenceService.addNote(ideaId, dto);
  }

  @Delete(':ideaId/notes/:id')
  removeNote(@Param('id') id: string) {
    return this.marketIntelligenceService.removeNote(id);
  }
}
