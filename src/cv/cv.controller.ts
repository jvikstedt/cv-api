import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  ValidationError,
  HttpException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CVService } from './cv.service';
import { CV } from './cv.entity';
import { PatchCVDto } from './dto/patch-cv.dto';
import { SearchCVDto } from './dto/search-cv.dto';
import { AllowAuthenticated, AllowCVOwner } from '../roles/roles.decorator';

@ApiBearerAuth()
@ApiTags('cv')
@Controller('cv')
export class CVController {
  constructor(private readonly cvService: CVService) {}

  @Patch('/:cvId')
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
    @Body() patchCVDto: PatchCVDto,
  ): Promise<CV> {
    return this.cvService.patch(cvId, patchCVDto);
  }

  @Get()
  @AllowAuthenticated()
  findAll(): Promise<CV[]> {
    return this.cvService.findAll();
  }

  @Get('/:cvId')
  @AllowAuthenticated()
  findOne(@Param('cvId', ParseIntPipe) cvId: number): Promise<CV> {
    return this.cvService.findOne(cvId);
  }

  @Post('/search')
  @AllowAuthenticated()
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
