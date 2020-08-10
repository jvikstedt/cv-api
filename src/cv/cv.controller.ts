import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Patch,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  ValidationError,
  HttpException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CVService } from './cv.service';
import { CV } from './cv.entity';
import { PatchCVDto } from './dto/patch-cv.dto';
import { SearchCVDto } from './dto/search-cv.dto';
import { CVGuard } from './cv.guard';

@ApiBearerAuth()
@ApiTags('cv')
@Controller('cv')
@UseGuards(AuthGuard())
export class CVController {
  constructor(private readonly cvService: CVService) {}

  @Patch('/:cvId')
  @UseGuards(CVGuard)
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
    @Body() patchCVDto: PatchCVDto,
  ): Promise<CV> {
    return this.cvService.patch(cvId, patchCVDto);
  }

  @Get()
  findAll(): Promise<CV[]> {
    return this.cvService.findAll();
  }

  @Get('/:cvId')
  findOne(@Param('cvId', ParseIntPipe) cvId: number): Promise<CV> {
    return this.cvService.findOne(cvId);
  }

  @Post('/search')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]): HttpException =>
        new BadRequestException(errors),
    }),
  )
  search(@Body() searchCVDto: SearchCVDto): Promise<CV[]> {
    return this.cvService.search(searchCVDto);
  }
}
