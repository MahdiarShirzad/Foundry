import { PartialType } from '@nestjs/mapped-types';
import { CreateWeekSampleDto } from './create-week-sample.dto';

export class UpdateWeekSampleDto extends PartialType(CreateWeekSampleDto) {}
