import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { CreateWeekSampleDto } from './dto/create-week-sample.dto';
import { UpdateWeekSampleDto } from './dto/update-week-sample.dto';
import { CreateMetricDefinitionDto } from './dto/create-metric-definition.dto';
import { UpdateMetricDefinitionDto } from './dto/update-metric-definition.dto';
import { CreateObservationDto } from './dto/create-observation.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';
import { CreateAnalyticsReportDto } from './dto/create-analytics-report.dto';
import { UpdateAnalyticsReportDto } from './dto/update-analytics-report.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
  ) {}

  // ─── Week samples ─────────────────────────────

  private async findWeekSampleOrThrow(productId: string, id: string) {
    const sample = await this.prisma.weekSample.findFirst({
      where: { id, productId },
    });
    if (!sample) throw new NotFoundException('Week sample not found!');
    return sample;
  }

  async findAllWeekSamples(productId: string) {
    return this.prisma.weekSample.findMany({
      where: { productId },
      orderBy: { start: 'asc' },
    });
  }

  async findWeekSampleById(productId: string, id: string) {
    return this.findWeekSampleOrThrow(productId, id);
  }

  async createWeekSample(productId: string, dto: CreateWeekSampleDto) {
    return this.prisma.weekSample.create({
      data: {
        productId,
        start: dto.start,
        active: dto.active,
        newUsers: dto.newUsers,
        sessions: dto.sessions,
        avgMinutes: dto.avgMinutes,
        perUser: dto.perUser,
        returnRate: dto.returnRate,
      },
    });
  }

  async updateWeekSample(
    productId: string,
    id: string,
    dto: UpdateWeekSampleDto,
  ) {
    await this.findWeekSampleOrThrow(productId, id);
    return this.prisma.weekSample.update({
      where: { id },
      data: {
        start: dto.start,
        active: dto.active,
        newUsers: dto.newUsers,
        sessions: dto.sessions,
        avgMinutes: dto.avgMinutes,
        perUser: dto.perUser,
        returnRate: dto.returnRate,
      },
    });
  }

  async removeWeekSample(productId: string, id: string) {
    await this.findWeekSampleOrThrow(productId, id);
    return this.prisma.weekSample.delete({ where: { id } });
  }

  // ─── Metric definitions ───────────────────────

  private async findMetricDefinitionOrThrow(productId: string, id: string) {
    const metric = await this.prisma.metricDefinition.findFirst({
      where: { id, productId },
    });
    if (!metric) throw new NotFoundException('Metric definition not found!');
    return metric;
  }

  async findAllMetricDefinitions(productId: string) {
    return this.prisma.metricDefinition.findMany({ where: { productId } });
  }

  async findMetricDefinitionById(productId: string, id: string) {
    return this.findMetricDefinitionOrThrow(productId, id);
  }

  async createMetricDefinition(
    productId: string,
    dto: CreateMetricDefinitionDto,
  ) {
    return this.prisma.metricDefinition.create({
      data: {
        productId,
        name: dto.name,
        definition: dto.definition,
        category: dto.category,
        unit: dto.unit,
        note: dto.note,
        seriesKey: dto.seriesKey,
      },
    });
  }

  async updateMetricDefinition(
    productId: string,
    id: string,
    dto: UpdateMetricDefinitionDto,
  ) {
    await this.findMetricDefinitionOrThrow(productId, id);
    return this.prisma.metricDefinition.update({
      where: { id },
      data: {
        name: dto.name,
        definition: dto.definition,
        category: dto.category,
        unit: dto.unit,
        note: dto.note,
        seriesKey: dto.seriesKey,
      },
    });
  }

  async removeMetricDefinition(productId: string, id: string) {
    await this.findMetricDefinitionOrThrow(productId, id);
    return this.prisma.metricDefinition.delete({ where: { id } });
  }

  // ─── Observations ─────────────────────────────

  private async findObservationOrThrow(productId: string, id: string) {
    const observation = await this.prisma.observation.findFirst({
      where: { id, productId },
    });
    if (!observation) throw new NotFoundException('Observation not found!');
    return observation;
  }

  async findAllObservations(productId: string) {
    return this.prisma.observation.findMany({ where: { productId } });
  }

  async findObservationById(productId: string, id: string) {
    return this.findObservationOrThrow(productId, id);
  }

  async createObservation(productId: string, dto: CreateObservationDto) {
    return this.prisma.observation.create({
      data: {
        productId,
        title: dto.title,
        description: dto.description,
        metricId: dto.metricId,
        type: dto.type,
        nextStep: dto.nextStep,
        sample: dto.sample,
      },
    });
  }

  async updateObservation(
    productId: string,
    id: string,
    dto: UpdateObservationDto,
  ) {
    await this.findObservationOrThrow(productId, id);
    return this.prisma.observation.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        metricId: dto.metricId,
        type: dto.type,
        nextStep: dto.nextStep,
        sample: dto.sample,
      },
    });
  }

  async removeObservation(productId: string, id: string) {
    await this.findObservationOrThrow(productId, id);
    return this.prisma.observation.delete({ where: { id } });
  }

  // ─── Reports ──────────────────────────────────

  private async findReportOrThrow(productId: string, id: string) {
    const report = await this.prisma.analyticsReport.findFirst({
      where: { id, productId },
    });
    if (!report) throw new NotFoundException('Analytics report not found!');
    return report;
  }

  async findAllReports(productId: string) {
    return this.prisma.analyticsReport.findMany({ where: { productId } });
  }

  async findReportById(productId: string, id: string) {
    return this.findReportOrThrow(productId, id);
  }

  async createReport(productId: string, dto: CreateAnalyticsReportDto) {
    return this.prisma.analyticsReport.create({
      data: {
        productId,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        period: dto.period,
        updated: dto.updated,
        paragraphs: dto.paragraphs,
        values: dto.values,
        chart: dto.chart,
        bars: dto.bars,
      },
    });
  }

  async updateReport(
    productId: string,
    id: string,
    dto: UpdateAnalyticsReportDto,
  ) {
    await this.findReportOrThrow(productId, id);
    return this.prisma.analyticsReport.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        period: dto.period,
        updated: dto.updated,
        paragraphs: dto.paragraphs,
        values: dto.values,
        chart: dto.chart,
        bars: dto.bars,
      },
    });
  }

  async removeReport(productId: string, id: string) {
    await this.findReportOrThrow(productId, id);
    return this.prisma.analyticsReport.delete({ where: { id } });
  }

  // ─── AI ───────────────────────────────────────

  async interpretMetrics(productId: string) {
    const samples = await this.prisma.weekSample.findMany({
      where: { productId },
      orderBy: { start: 'desc' },
      take: 12,
    });

    const weekSamples = samples
      .map(
        (sample) =>
          `${sample.start.toISOString().slice(0, 10)}: active=${sample.active}, newUsers=${sample.newUsers}, sessions=${sample.sessions}, avgMinutes=${sample.avgMinutes}, perUser=${sample.perUser}, returnRate=${sample.returnRate}`,
      )
      .join('\n');

    return this.ai.generate(
      `Analyze these weekly metrics for a SaaS product: ${
        weekSamples || 'no weekly samples recorded yet'
      }. Identify trends, risks, and opportunities in 3-5 bullet points.`,
    );
  }
}
