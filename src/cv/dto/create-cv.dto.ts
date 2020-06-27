import { IsNotEmpty, IsDefined } from 'class-validator';

export class CreateCVDto {
  @IsNotEmpty()
  userId: number;

  @IsDefined()
  description: string;
}
