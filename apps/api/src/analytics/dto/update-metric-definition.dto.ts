import { PartialType } from '@nestjs/mapped-types';
import { CreateMetricDefinitionDto } from './create-metric-definition.dto';

export class UpdateMetricDefinitionDto extends PartialType(
  CreateMetricDefinitionDto,
) {}
