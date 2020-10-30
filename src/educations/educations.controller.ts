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
import { EducationsService } from './educations.service';
import { Education } from './education.entity';
import { CreateEducationDto } from './dto/create-education.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PatchEducationDto } from './dto/patch-education.dto';
import { AllowAuthenticated, AllowCVOwner } from '../roles/roles.decorator';

@ApiBearerAuth()
@ApiTags('educations')
@Controller('cv/:cvId/educations')
export class EducationsController {
  constructor(private readonly educationsService: EducationsService) {}

  @Post()
  @AllowCVOwner()
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
    @Body() createEducationDto: CreateEducationDto,
  ): Promise<Education> {
    return this.educationsService.create(cvId, createEducationDto);
  }

  @Patch('/:educationId')
  @AllowCVOwner()
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
    @Param('educationId', ParseIntPipe) educationId: number,
    @Body() patchEducationDto: PatchEducationDto,
  ): Promise<Education> {
    return this.educationsService.patch(cvId, educationId, patchEducationDto);
  }

  @Get()
  @AllowAuthenticated()
  findAll(@Param('cvId', ParseIntPipe) cvId: number): Promise<Education[]> {
    return this.educationsService.findAll(cvId);
  }

  @Get('/:educationId')
  @AllowAuthenticated()
  findOne(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Param('educationId', ParseIntPipe) educationId: number,
  ): Promise<Education> {
    return this.educationsService.findOne(cvId, educationId);
  }

  @Delete('/:educationId')
  @AllowCVOwner()
  remove(
    @Param('cvId', ParseIntPipe) cvId: number,
    @Param('educationId', ParseIntPipe) educationId: number,
  ): Promise<Education> {
    return this.educationsService.remove(cvId, educationId);
  }
}
