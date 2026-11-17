import { PartialType } from '@nestjs/mapped-types';
import { CreateHypothesisDto } from './create-hypothesis.dto';

export class UpdateHypothesisDto extends PartialType(CreateHypothesisDto) {}
