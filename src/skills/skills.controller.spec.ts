import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { PassportModule } from '@nestjs/passport';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { Skill } from './skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { PatchSkillDto } from './dto/patch-skill.dto';

const mockSkillsService = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  create: jest.fn(),
  patch: jest.fn(),
});

describe('SkillsController', () => {
  let skillsController: any;
  let skillsService: any;

  beforeAll(async () => {
    await useSeeding();
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
      ],
      controllers: [SkillsController],
      providers: [
        { provide: SkillsService, useFactory: mockSkillsService },
      ],
    })
    .compile();

    skillsController = module.get<SkillsController>(SkillsController);
    skillsService = module.get<SkillsService>(SkillsService);
  });

  describe('patch', () => {
    it('calls service patch with passed data', async () => {
      const patchSkillDto: PatchSkillDto = { experienceInYears: 5 };
      const oldSkill = await factory(Skill)().make({ id: 1, experienceInYears: 1 });
      skillsService.patch.mockResolvedValue({ ...oldSkill, ...patchSkillDto });

      expect(skillsService.patch).not.toHaveBeenCalled();
      const result = await skillsController.patch(2, 1, patchSkillDto);
      expect(skillsService.patch).toHaveBeenCalledWith(2, 1, patchSkillDto);
      expect(result).toEqual({ ...oldSkill, ...patchSkillDto });
    });
  });

  describe('create', () => {
    it('calls service create with passed data', async () => {
      const createSkillDto: CreateSkillDto = { skillSubjectId: 1, experienceInYears: 2 };
      const skill = await factory(Skill)().make(createSkillDto);
      skillsService.create.mockResolvedValue(skill);

      expect(skillsService.create).not.toHaveBeenCalled();
      const result = await skillsController.create(2, createSkillDto);
      expect(skillsService.create).toHaveBeenCalledWith(2, createSkillDto);
      expect(result).toEqual(skill);
    });
  });

  describe('findAll', () => {
    it('calls service findAll', async () => {
      const skill = await factory(Skill)().make();
      skillsService.findAll.mockResolvedValue([skill]);

      expect(skillsService.findAll).not.toHaveBeenCalled();
      const result = await skillsController.findAll();
      expect(skillsService.findAll).toHaveBeenCalled();
      expect(result).toEqual([skill]);
    });
  });

  describe('findOne', () => {
    it('calls service findOne with passed id', async () => {
      const skill = await factory(Skill)().make();
      skillsService.findOne.mockResolvedValue(skill);

      expect(skillsService.findOne).not.toHaveBeenCalled();
      const result = await skillsController.findOne(2, 1);
      expect(skillsService.findOne).toHaveBeenCalledWith(2, 1);
      expect(result).toEqual(skill);
    });
  });

  describe('remove', () => {
    it('calls service remove with passed id', async () => {
      skillsService.remove.mockResolvedValue();

      expect(skillsService.remove).not.toHaveBeenCalled();
      await skillsController.remove(2, 1);
      expect(skillsService.remove).toHaveBeenCalledWith(2, 1);
    });
  });
});
