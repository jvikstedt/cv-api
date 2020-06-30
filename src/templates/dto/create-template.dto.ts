import { IsNotEmpty } from 'class-validator';
import { CreateTemplateRequestDto } from './create-template-request.dto';

export class CreateTemplateDto extends CreateTemplateRequestDto {
  @IsNotEmpty()
  userId: number;
}
