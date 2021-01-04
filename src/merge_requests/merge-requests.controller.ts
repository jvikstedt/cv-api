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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Authenticated,
  CheckPolicies,
} from '../authorization/authorization.decorator';
import { GetUser } from '../auth/get-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { CreateMergeRequestDto } from './dto/create-merge-request.dto';
import { MergeRequest } from './merge-request.entity';
import { MergeRequestsService } from './merge-requests.service';
import { MergeRequestOwnerPolicy } from './policies';
import { SearchMergeRequestDto } from './dto/search-merge-request.dto';

@ApiBearerAuth()
@ApiTags('merge_requests')
@Controller('merge_requests')
export class MergeRequestsController {
  constructor(private readonly mergeRequestsService: MergeRequestsService) {}

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
    @Body() createMergeRequestDto: CreateMergeRequestDto,
  ): Promise<MergeRequest> {
    return this.mergeRequestsService.create(user, createMergeRequestDto);
  }

  @Get('/')
  @Authenticated()
  findAll(@GetUser() user: JwtPayload): Promise<MergeRequest[]> {
    return this.mergeRequestsService.findAll(user);
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
    @Body() searchMergeRequestDto: SearchMergeRequestDto,
  ): Promise<{ items: MergeRequest[]; total: number }> {
    return this.mergeRequestsService.search(user, searchMergeRequestDto);
  }

  @Delete('/:mergeRequestId')
  @CheckPolicies(MergeRequestOwnerPolicy)
  delete(
    @Param('mergeRequestId', ParseIntPipe) mergeRequestId: number,
  ): Promise<MergeRequest> {
    return this.mergeRequestsService.delete(mergeRequestId);
  }

  @Post('/:mergeRequestId/execute')
  execute(
    @Param('mergeRequestId', ParseIntPipe) mergeRequestId: number,
  ): Promise<MergeRequest> {
    return this.mergeRequestsService.execute(mergeRequestId);
  }

  @Post('/:mergeRequestId/reject')
  reject(
    @Param('mergeRequestId', ParseIntPipe) mergeRequestId: number,
  ): Promise<MergeRequest> {
    return this.mergeRequestsService.reject(mergeRequestId);
  }
}
