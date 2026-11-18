import { PartialType } from '@nestjs/mapped-types';
import { CreateLaunchAssetDto } from './create-launch-asset.dto';

export class UpdateLaunchAssetDto extends PartialType(CreateLaunchAssetDto) {}
