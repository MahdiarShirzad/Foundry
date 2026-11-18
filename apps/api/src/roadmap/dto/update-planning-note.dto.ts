import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanningNoteDto } from './create-planning-note.dto';

export class UpdatePlanningNoteDto extends PartialType(CreatePlanningNoteDto) {}
