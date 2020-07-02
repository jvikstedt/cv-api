import { IsNotEmpty } from 'class-validator';

export class CreateFileDto {
  @IsNotEmpty()
  originalname: string;

  @IsNotEmpty()
  encoding: string;

  @IsNotEmpty()
  mimetype: string;

  @IsNotEmpty()
  destination: string;

  @IsNotEmpty()
  filename: string;

  @IsNotEmpty()
  path: string;

  @IsNotEmpty()
  size: number;
}
