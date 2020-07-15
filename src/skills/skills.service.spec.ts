import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { SkillsService } from './skills.service';
import { SkillRepository } from './skill.repository';
import { NotFoundException } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { Skill } from './skill.entity';
import { PatchSkillDto } from './dto/patch-skill.dto';

const mockSkillRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  createSkill: jest.fn(),
  save: jest.fn(),
});

describe('SkillsService', () => {
  let skillsService: any;
  let skillRepository: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SkillsService,
        { provide: SkillRepository, useFactory: mockSkillRepository },
      ],
    }).compile();

    skillsService = module.get<SkillsService>(SkillsService);
    skillRepository = module.get<SkillRepository>(SkillRepository);
  });

  describe('create', () => {
    it('calls skillRepository.createSkill(createSkillDto) and successfully retrieves and return skill', async () => {
      const createSkillDto: CreateSkillDto = { skillSubjectId: 2, experienceInYears: 2 };
      const skill = await factory(Skill)().make({ id: 1, ...createSkillDto });
      skillRepository.createSkill.mockResolvedValue(skill);
      skillRepository.findOne.mockResolvedValue(skill);

      expect(skillRepository.createSkill).not.toHaveBeenCalled();
      expect(skillRepository.findOne).not.toHaveBeenCalled();
      const result = await skillsService.create(2, createSkillDto);
      expect(result).toEqual(skill);
      expect(skillRepository.createSkill).toHaveBeenCalledWith(2, createSkillDto);
      expect(skillRepository.findOne).toHaveBeenCalledWith({ cvId: 2, id: 1 }, { relations: ['skillSubject', 'skillSubject.skillGroup'] });
    });
  });

  describe('patch', () => {
    it('finds skill by id and updates it', async () => {
      const skill = await factory(Skill)().make({ id: 1 });
      const patchSkillDto: PatchSkillDto = { experienceInYears: 6 };

      skillRepository.findOne.mockResolvedValue(skill);
      skillRepository.save.mockResolvedValue({ ...skill, ...patchSkillDto });

      expect(skillRepository.findOne).not.toHaveBeenCalled();
      expect(skillRepository.save).not.toHaveBeenCalled();
      const result = await skillsService.patch(2, 1, patchSkillDto);
      expect(result).toEqual({ ...skill, ...patchSkillDto });
      expect(skillRepository.findOne).toHaveBeenCalledWith({ cvId: 2, id: 1 }, { relations: ['skillSubject', 'skillSubject.skillGroup'] });
      expect(skillRepository.save).toHaveBeenCalledWith({ ...skill, ...patchSkillDto });
    });
  });

  describe('findAll', () => {
    it('gets all skills from the repository', async () => {
      skillRepository.find.mockResolvedValue([]);

      expect(skillRepository.find).not.toHaveBeenCalled();
      const result = await skillsService.findAll();
      expect(skillRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('calls skillRepository.findOne() and successfully retrieves and return skill', async () => {
      const skill = await factory(Skill)().make();
      skillRepository.findOne.mockResolvedValue(skill);

      const result = await skillsService.findOne(2, 1);
      expect(result).toEqual(skill);

      expect(skillRepository.findOne).toHaveBeenCalledWith({ cvId: 2, id: 1 }, { relations: ['skillSubject', 'skillSubject.skillGroup'] });
    });

    it('throws an error as skill is not found', async () => {
      skillRepository.findOne.mockResolvedValue(null);

      await expect(skillsService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('calls skillRepository.delete(id) and deletes retrieves affected result', async () => {
      const skill = await factory(Skill)().make();
      skillRepository.findOne.mockResolvedValue(skill);

      expect(skillRepository.delete).not.toHaveBeenCalled();
      await skillsService.remove(2, 1);
      expect(skillRepository.delete).toHaveBeenCalledWith({ cvId: 2, id: 1 });
    });

    it('throws an error if affected result is 0', async () => {
      skillRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(skillsService.remove(2, 1)).rejects.toThrow(NotFoundException);
    });
  });
});
