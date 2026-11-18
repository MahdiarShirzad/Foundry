import { PartialType } from '@nestjs/mapped-types';
import { CreateFeedbackItemDto } from './create-feedback-item.dto';

export class UpdateFeedbackItemDto extends PartialType(CreateFeedbackItemDto) {}
