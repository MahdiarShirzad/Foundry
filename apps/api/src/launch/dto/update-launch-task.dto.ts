import { PartialType } from '@nestjs/mapped-types';
import { CreateLaunchTaskDto } from './create-launch-task.dto';

export class UpdateLaunchTaskDto extends PartialType(CreateLaunchTaskDto) {}
