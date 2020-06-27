import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { PassportModule } from '@nestjs/passport';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { Skill } from './skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

const mockSkillsService = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
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
      const result = await skillsController.findOne(1);
      expect(skillsService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(skill);
    });
  });

  describe('remove', () => {
    it('calls service remove with passed id', async () => {
      skillsService.remove.mockResolvedValue();

      expect(skillsService.remove).not.toHaveBeenCalled();
      await skillsController.remove(1);
      expect(skillsService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('calls service create with passed data', async () => {
      const createSkillDto: CreateSkillDto = { cvId: 1, skillSubjectId: 1, experienceInYears: 2 };
      const skill = await factory(Skill)().make(createSkillDto);
      skillsService.create.mockResolvedValue(skill);

      expect(skillsService.create).not.toHaveBeenCalled();
      const result = await skillsController.create(createSkillDto);
      expect(skillsService.create).toHaveBeenCalledWith(createSkillDto);
      expect(result).toEqual(skill);
    });
  });

  describe('update', () => {
    it('calls service update with id and passed data', async () => {
      const updateSkillDto: UpdateSkillDto = { experienceInYears: 2 };
      const skill = await factory(Skill)().make({ cvId: 1, skillSubjectId: 1 });
      skillsService.update.mockResolvedValue({ ...skill, ...updateSkillDto });

      expect(skillsService.update).not.toHaveBeenCalled();
      const result = await skillsController.update(1, updateSkillDto);
      expect(skillsService.update).toHaveBeenCalledWith(1, updateSkillDto);
      expect(result).toEqual({ ...skill, ...updateSkillDto });
    });
  });
});
