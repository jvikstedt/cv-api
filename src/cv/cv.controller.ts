import { Controller, Get, Post, Put, Body, Delete, Param, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CVService } from './cv.service';
import { CV } from './cv.entity';
import { CreateCVDto } from './dto/create-cv.dto';
import { UpdateCVDto } from './dto/update-cv.dto';
import { Skill } from '../skills/skill.entity';
import { PatchCVDto } from './dto/patch-cv.dto';

@ApiBearerAuth()
@ApiTags('cv')
@Controller('cv')
@UseGuards(AuthGuard())
export class CVController {
  constructor(
    private readonly cvService: CVService,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createCVDto: CreateCVDto): Promise<CV> {
    return this.cvService.create(createCVDto);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCVDto: UpdateCVDto): Promise<CV> {
    return this.cvService.update(id, updateCVDto);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  patchCV(@Param('id', ParseIntPipe) cvId: number, @Body() patchCVDto: PatchCVDto): Promise<CV> {
    return this.cvService.patchCV(cvId, patchCVDto);
  }

  @Get()
  findAll(): Promise<CV[]> {
    return this.cvService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<CV> {
    return this.cvService.findOne(id);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.cvService.delete(id);
  }

  @Get('/:id/skills')
  getCVSkills(@Param('id', ParseIntPipe) id: number): Promise<Skill[]> {
    return this.cvService.getCVSkills(id);
  }
}
