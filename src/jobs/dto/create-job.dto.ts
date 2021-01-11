import { IsNotEmpty, IsString } from 'class-validator';

export class CreateJobDto {
  @IsString()
  runner: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}
