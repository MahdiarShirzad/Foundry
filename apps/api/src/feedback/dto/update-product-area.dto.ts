import { PartialType } from '@nestjs/mapped-types';
import { CreateProductAreaDto } from './create-product-area.dto';

export class UpdateProductAreaDto extends PartialType(CreateProductAreaDto) {}
