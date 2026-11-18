import { PartialType } from '@nestjs/mapped-types';
import { CreateMvpProjectDto } from './create-mvp-project.dto';

export class UpdateMvpProjectDto extends PartialType(CreateMvpProjectDto) {}
