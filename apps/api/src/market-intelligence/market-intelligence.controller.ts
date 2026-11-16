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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MarketIntelligenceService } from './market-intelligence.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateCompetitorDto } from './dto/create-competitor.dto';
import { UpdateCompetitorDto } from './dto/update-competitor.dto';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { UpdateSegmentDto } from './dto/update-segment.dto';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { CreateResearchNoteDto } from './dto/create-research-note.dto';

@ApiTags('Market Intelligence')
@ApiCookieAuth('access_token')
@ApiBearerAuth('bearer')
@Controller('market-intelligence')
@UseGuards(AuthGuard)
export class MarketIntelligenceController {
  constructor(
    private readonly marketIntelligenceService: MarketIntelligenceService,
  ) {}

  // ─── MarketIdea ───────────────────────────────

  @Post(':ideaId/init')
  @ApiOperation({ summary: 'Initialize market intelligence for an idea' })
  @ApiBody({ schema: { properties: { workspaceId: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Market intelligence initialized' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Idea not found' })
  init(
    @Param('ideaId') ideaId: string,
    @Body('workspaceId') workspaceId: string,
  ) {
    return this.marketIntelligenceService.getOrCreate(ideaId, workspaceId);
  }

  @Get(':ideaId')
  @ApiOperation({ summary: 'Get full market intelligence aggregate for an idea' })
  @ApiResponse({ status: 200, description: 'Aggregate found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Idea not found' })
  getFullAggregate(@Param('ideaId') ideaId: string) {
    return this.marketIntelligenceService.getFullAggregate(ideaId);
  }

  // ─── Competitors ──────────────────────────────

  @Post(':ideaId/competitors')
  @ApiOperation({ summary: 'Add a competitor to an idea' })
  @ApiBody({ type: CreateCompetitorDto })
  @ApiResponse({ status: 201, description: 'Competitor added' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Idea not found' })
  addCompetitor(
    @Param('ideaId') ideaId: string,
    @Body() dto: CreateCompetitorDto,
  ) {
    return this.marketIntelligenceService.addCompetitor(ideaId, dto);
  }

  @Patch(':ideaId/competitors/:id')
  @ApiOperation({ summary: 'Update a competitor by ID' })
  @ApiBody({ type: UpdateCompetitorDto })
  @ApiResponse({ status: 200, description: 'Competitor updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Competitor not found' })
  updateCompetitor(@Param('id') id: string, @Body() dto: UpdateCompetitorDto) {
    return this.marketIntelligenceService.updateCompetitor(id, dto);
  }

  @Delete(':ideaId/competitors/:id')
  @ApiOperation({ summary: 'Remove a competitor by ID' })
  @ApiResponse({ status: 200, description: 'Competitor removed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Competitor not found' })
  removeCompetitor(@Param('id') id: string) {
    return this.marketIntelligenceService.removeCompetitor(id);
  }

  // ─── Segments ─────────────────────────────────

  @Post(':ideaId/segments')
  @ApiOperation({ summary: 'Add a segment to an idea' })
  @ApiBody({ type: CreateSegmentDto })
  @ApiResponse({ status: 201, description: 'Segment added' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Idea not found' })
  addSegment(@Param('ideaId') ideaId: string, @Body() dto: CreateSegmentDto) {
    return this.marketIntelligenceService.addSegment(ideaId, dto);
  }

  @Patch(':ideaId/segments/:id')
  @ApiOperation({ summary: 'Update a segment by ID' })
  @ApiBody({ type: UpdateSegmentDto })
  @ApiResponse({ status: 200, description: 'Segment updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Segment not found' })
  updateSegment(@Param('id') id: string, @Body() dto: UpdateSegmentDto) {
    return this.marketIntelligenceService.updateSegment(id, dto);
  }

  @Delete(':ideaId/segments/:id')
  @ApiOperation({ summary: 'Remove a segment by ID' })
  @ApiResponse({ status: 200, description: 'Segment removed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Segment not found' })
  removeSegment(@Param('id') id: string) {
    return this.marketIntelligenceService.removeSegment(id);
  }

  // ─── Opportunities ────────────────────────────

  @Post(':ideaId/opportunities')
  @ApiOperation({ summary: 'Add an opportunity to an idea' })
  @ApiBody({ type: CreateOpportunityDto })
  @ApiResponse({ status: 201, description: 'Opportunity added' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Idea not found' })
  addOpportunity(
    @Param('ideaId') ideaId: string,
    @Body() dto: CreateOpportunityDto,
  ) {
    return this.marketIntelligenceService.addOpportunity(ideaId, dto);
  }

  @Patch(':ideaId/opportunities/:id')
  @ApiOperation({ summary: 'Update an opportunity by ID' })
  @ApiBody({ type: UpdateOpportunityDto })
  @ApiResponse({ status: 200, description: 'Opportunity updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Opportunity not found' })
  updateOpportunity(
    @Param('id') id: string,
    @Body() dto: UpdateOpportunityDto,
  ) {
    return this.marketIntelligenceService.updateOpportunity(id, dto);
  }

  @Delete(':ideaId/opportunities/:id')
  @ApiOperation({ summary: 'Remove an opportunity by ID' })
  @ApiResponse({ status: 200, description: 'Opportunity removed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Opportunity not found' })
  removeOpportunity(@Param('id') id: string) {
    return this.marketIntelligenceService.removeOpportunity(id);
  }

  // ─── Research Notes ───────────────────────────

  @Post(':ideaId/notes')
  @ApiOperation({ summary: 'Add a research note to an idea' })
  @ApiBody({ type: CreateResearchNoteDto })
  @ApiResponse({ status: 201, description: 'Research note added' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Idea not found' })
  addNote(@Param('ideaId') ideaId: string, @Body() dto: CreateResearchNoteDto) {
    return this.marketIntelligenceService.addNote(ideaId, dto);
  }

  @Delete(':ideaId/notes/:id')
  @ApiOperation({ summary: 'Remove a research note by ID' })
  @ApiResponse({ status: 200, description: 'Research note removed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Research note not found' })
  removeNote(@Param('id') id: string) {
    return this.marketIntelligenceService.removeNote(id);
  }
}
