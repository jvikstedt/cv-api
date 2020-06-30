import { Controller, Get, Post, Put, Body, Delete, Param, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { Template } from './template.entity';
import { CreateTemplateRequestDto } from './dto/create-template-request.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/user.entity';

@ApiBearerAuth()
@ApiTags('templates')
@Controller('templates')
@UseGuards(AuthGuard())
export class TemplatesController {
  constructor(
    private readonly templatesService: TemplatesService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe)
  create(@Body() createTemplateRequestDto: CreateTemplateRequestDto, @GetUser() user: User): Promise<Template> {
    return this.templatesService.create({ ...createTemplateRequestDto, userId: user.id });
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTemplateDto: UpdateTemplateDto): Promise<Template> {
    return this.templatesService.update(id, updateTemplateDto);
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
