import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  ValidationError,
  HttpException,
} from '@nestjs/common';
import { WorkExperienceService } from './work-experience.service';
import { WorkExperience } from './work-experience.entity';
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PatchWorkExperienceDto } from './dto/patch-work-experience.dto';
import {
  Authenticated,
  CheckPolicies,
} from '../authorization/authorization.decorator';
import { CVOwnerPolicy } from '../cv/policies';

@ApiBearerAuth()
@ApiTags('work_experience')
@Controller('cv/:cvId/work_experience')
export class WorkExperienceController {
  constructor(private readonly workExperienceService: WorkExperienceService) {}

  @Post()
  @CheckPolicies(CVOwnerPolicy)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]): HttpException =>
        new BadRequestException(errors),
    }),
  )
  create(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Body() createWorkExperienceDto: CreateWorkExperienceDto,
  ): Promise<WorkExperience> {
    return this.workExperienceService.create(cvId, createWorkExperienceDto);
  }

  @Patch('/:workExperienceId')
  @CheckPolicies(CVOwnerPolicy)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]): HttpException =>
        new BadRequestException(errors),
    }),
  )
  patch(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Param('workExperienceId', ParseIntPipe) workExperienceId: number,
    @Body() patchWorkExperienceDto: PatchWorkExperienceDto,
  ): Promise<WorkExperience> {
    return this.workExperienceService.patch(
      cvId,
      workExperienceId,
      patchWorkExperienceDto,
    );
  }

  @Get()
  @Authenticated()
  findAll(
    @Param('cvId', ParseIntPipe) cvId: number,
  ): Promise<WorkExperience[]> {
    return this.workExperienceService.findAll(cvId);
  }

  @Get('/:workExperienceId')
  @Authenticated()
  findOne(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Param('workExperienceId', ParseIntPipe) workExperienceId: number,
  ): Promise<WorkExperience> {
    return this.workExperienceService.findOne(cvId, workExperienceId);
  }

  @Delete('/:workExperienceId')
  @CheckPolicies(CVOwnerPolicy)
  remove(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Param('workExperienceId', ParseIntPipe) workExperienceId: number,
  ): Promise<WorkExperience> {
    return this.workExperienceService.remove(cvId, workExperienceId);
  }
}
