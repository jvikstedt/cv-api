import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  ValidationError,
  HttpException,
} from '@nestjs/common';
import { SkillGroupsService } from './skill-groups.service';
import { SkillGroup } from './skill-group.entity';
import { CreateSkillGroupDto } from './dto/create-skill-group.dto';
import { UpdateSkillGroupDto } from './dto/update-skill-group.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SearchSkillGroupDto } from './dto/search-skill-group.dto';

@ApiBearerAuth()
@ApiTags('skill_groups')
@Controller('skill_groups')
@UseGuards(AuthGuard())
export class SkillGroupsController {
  constructor(private readonly skillGroupsService: SkillGroupsService) {}

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
    @Body() createSkillGroupDto: CreateSkillGroupDto,
  ): Promise<SkillGroup> {
    return this.skillGroupsService.create(createSkillGroupDto);
  }

  @Put('/:id')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]): HttpException =>
        new BadRequestException(errors),
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSkillGroupDto: UpdateSkillGroupDto,
  ): Promise<SkillGroup> {
    return this.skillGroupsService.update(id, updateSkillGroupDto);
  }

  @Get()
  findAll(): Promise<SkillGroup[]> {
    return this.skillGroupsService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SkillGroup> {
    return this.skillGroupsService.findOne(id);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.skillGroupsService.delete(id);
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
  search(
    @Body() searchSkillGroupDto: SearchSkillGroupDto,
  ): Promise<SkillGroup[]> {
    return this.skillGroupsService.search(searchSkillGroupDto);
  }
}
