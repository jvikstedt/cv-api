import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
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
import { TemplatesService } from './templates.service';
import { Template } from './template.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';
import { PatchTemplateDto } from './dto/patch-template.dto';
import { CreateTemplateDto } from './dto/create-template.dto';
import { JwtPayload } from '../auth/jwt-payload.interface';

@ApiBearerAuth()
@ApiTags('templates')
@Controller('templates')
@UseGuards(AuthGuard())
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
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
    @Body() createTemplateDto: CreateTemplateDto,
  ): Promise<Template> {
    return this.templatesService.create(user.userId, createTemplateDto);
  }

  @Patch('/:id')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]): HttpException =>
        new BadRequestException(errors),
    }),
  )
  patchTemplate(
    @Param('id', ParseIntPipe) id: number,
    @Body() patchTemplateDto: PatchTemplateDto,
  ): Promise<Template> {
    return this.templatesService.patchTemplate(id, patchTemplateDto);
  }

  @Get()
  findAll(): Promise<Template[]> {
    return this.templatesService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Template> {
    return this.templatesService.findOne(id);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.templatesService.delete(id);
  }
}
