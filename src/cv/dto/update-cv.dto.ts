import { IsDefined } from 'class-validator';

export class UpdateCVDto {
  @IsDefined()
  description: string;
}
