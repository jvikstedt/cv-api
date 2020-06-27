import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { SkillsService } from './skills.service';
import { SkillRepository } from './skill.repository';
import { NotFoundException } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { Skill } from './skill.entity';
import { UpdateSkillDto } from './dto/update-skill.dto';

const mockSkillRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  createSkill: jest.fn(),
  save: jest.fn(),
});

describe('SkillsService', () => {
  let skillsService: any;
  let skillRepository: any;

  beforeAll(async () => {
    await useSeeding();
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

      const result = await skillsService.findOne(1);
      expect(result).toEqual(skill);

      expect(skillRepository.findOne).toHaveBeenCalledWith(1, { relations: ['skillSubject'] });
    });

    it('throws an error as skill is not found', async () => {
      skillRepository.findOne.mockResolvedValue(null);

      await expect(skillsService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('calls skillRepository.delete(id) and deletes retrieves affected result', async () => {
      const skill = await factory(Skill)().make();
      skillRepository.findOne.mockResolvedValue(skill);
      // skillRepository.delete.mockResolvedValue();

      expect(skillRepository.remove).not.toHaveBeenCalled();
      await skillsService.remove(1);
      expect(skillRepository.remove).toHaveBeenCalledWith(skill);
    });

    it('throws an error if affected result is 0', async () => {
      skillRepository.remove.mockResolvedValue({ affected: 0 });

      await expect(skillsService.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('calls skillRepository.createSkill(createSkillDto) and successfully retrieves and return skill', async () => {
      const createSkillDto: CreateSkillDto = { skillSubjectId: 2, cvId: 2, experienceInYears: 2 };
      const skill = await factory(Skill)().make(createSkillDto);
      skillRepository.createSkill.mockResolvedValue(skill);

      expect(skillRepository.createSkill).not.toHaveBeenCalled();
      const result = await skillsService.create(createSkillDto);
      expect(result).toEqual(skill);
      expect(skillRepository.createSkill).toHaveBeenCalledWith(createSkillDto);
    });
  });

  describe('update', () => {
    it('calls skillRepository.findOne(id) and skillRepository.save(skill) successfully retrieves and return skill', async () => {
      const updateSkillDto: UpdateSkillDto = { experienceInYears: 2 };
      const skill = await factory(Skill)().make();
      skillRepository.findOne.mockResolvedValue(skill);
      skillRepository.save.mockResolvedValue({ ...skill, ...updateSkillDto });

      expect(skillRepository.findOne).not.toHaveBeenCalled();
      expect(skillRepository.save).not.toHaveBeenCalled();
      const result = await skillsService.update(1, updateSkillDto);
      expect(result).toEqual({ ...skill, ...updateSkillDto });
      expect(skillRepository.findOne).toHaveBeenCalledWith(1, { relations: ['skillSubject'] });
      expect(skillRepository.save).toHaveBeenCalledWith({ ...skill, ...updateSkillDto });
    });

    it('throws an error as skill is not found', async () => {
      const updateSkillDto: CreateSkillDto = { skillSubjectId: 2, cvId: 2, experienceInYears: 2 };
      skillRepository.findOne.mockResolvedValue(null);

      await expect(skillsService.update(1, updateSkillDto)).rejects.toThrow(NotFoundException);
    });
  });
});
