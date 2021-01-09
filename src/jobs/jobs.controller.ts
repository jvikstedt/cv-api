import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  ValidationError,
  HttpException,
  Param,
  ParseIntPipe,
  Get,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Authenticated,
  CheckPolicies,
} from '../authorization/authorization.decorator';
import { GetUser } from '../auth/get-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { CreateJobDto } from './dto/create-job.dto';
import { Job } from './job.entity';
import { JobsService } from './jobs.service';
import { JobOwnerPolicy } from './policies';
import { SearchJobDto } from './dto/search-job.dto';

@ApiBearerAuth()
@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobService: JobsService) {}

  @Post('/')
  @Authenticated()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]): HttpException =>
        new BadRequestException(errors),
    }),
  )
  create(
    @GetUser() user: JwtPayload,
    @Body() createJobDto: CreateJobDto,
  ): Promise<Job> {
    return this.jobService.create(user, createJobDto);
  }

  @Get('/')
  @Authenticated()
  findAll(@GetUser() user: JwtPayload): Promise<Job[]> {
    return this.jobService.findAll(user);
  }

  @Post('/search')
  @Authenticated()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]): HttpException =>
        new BadRequestException(errors),
    }),
  )
  search(
    @GetUser() user: JwtPayload,
    @Body() searchJobDto: SearchJobDto,
  ): Promise<{ items: Job[]; total: number }> {
    return this.jobService.search(user, searchJobDto);
  }

  @Delete('/:jobId')
  @CheckPolicies(JobOwnerPolicy)
  delete(@Param('jobId', ParseIntPipe) jobId: number): Promise<Job> {
    return this.jobService.cancel(jobId);
  }

  @Post('/:jobId/approve')
  @HttpCode(200)
  approve(@Param('jobId', ParseIntPipe) jobId: number): Promise<Job> {
    return this.jobService.approve(jobId);
  }

  @Post('/:jobId/reject')
  @HttpCode(200)
  reject(@Param('jobId', ParseIntPipe) jobId: number): Promise<Job> {
    return this.jobService.reject(jobId);
  }
}
