import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  ValidationError,
  HttpException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MergeSkillSubjectsDto } from './dto/merge-skill-subjects.dto';
import { MergeService } from './merge.service';

@ApiBearerAuth()
@ApiTags('merge')
@Controller('merge')
export class MergeController {
  constructor(private readonly mergeService: MergeService) {}

  @Post('/skill_subjects')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]): HttpException =>
        new BadRequestException(errors),
    }),
  )
  mergeSkillSubjects(
    @Body() mergeSkillSubjectsDto: MergeSkillSubjectsDto,
  ): Promise<void> {
    return this.mergeService.mergeSkillSubjects(mergeSkillSubjectsDto);
  }
}
