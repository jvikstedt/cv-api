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
import { TemplatesService } from './templates.service';
import { Template } from './template.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';
import { PatchTemplateDto } from './dto/patch-template.dto';
import { CreateTemplateDto } from './dto/create-template.dto';
import { JwtPayload } from '../auth/jwt-payload.interface';
import {
  Authenticated,
  CheckPolicies,
} from '../authorization/authorization.decorator';
import { TemplateOwnerPolicy } from './policies';

@ApiBearerAuth()
@ApiTags('templates')
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
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
    @Body() createTemplateDto: CreateTemplateDto,
  ): Promise<Template> {
    return this.templatesService.create(user, createTemplateDto);
  }

  @Patch('/:templateId')
  @CheckPolicies(TemplateOwnerPolicy)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]): HttpException =>
        new BadRequestException(errors),
    }),
  )
  patchTemplate(
    @GetUser() user: JwtPayload,
    @Param('templateId', ParseIntPipe) templateId: number,
    @Body() patchTemplateDto: PatchTemplateDto,
  ): Promise<Template> {
    return this.templatesService.patchTemplate(
      user,
      templateId,
      patchTemplateDto,
    );
  }

  @Get()
  @Authenticated()
  findAll(@GetUser() user: JwtPayload): Promise<Template[]> {
    return this.templatesService.findAll(user.userId);
  }

  @Get('/:templateId')
  @CheckPolicies(TemplateOwnerPolicy)
  findOne(
    @Param('templateId', ParseIntPipe) templateId: number,
  ): Promise<Template> {
    return this.templatesService.findOne(templateId);
  }

  @Delete('/:templateId')
  @CheckPolicies(TemplateOwnerPolicy)
  delete(@Param('templateId', ParseIntPipe) templateId: number): Promise<void> {
    return this.templatesService.delete(templateId);
  }
}
