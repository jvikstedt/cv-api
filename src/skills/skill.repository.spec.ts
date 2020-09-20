import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { SkillRepository } from './skill.repository';
import { Skill } from './skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';

describe('SkillRepository', () => {
  let skillRepository: SkillRepository;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SkillRepository],
    }).compile();

    skillRepository = module.get<SkillRepository>(SkillRepository);
  });

  describe('createSkill', () => {
    let save: jest.Mock;

    beforeEach(async () => {
      save = jest.fn();
      skillRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('returns created skill', async () => {
      const cvId = 2;
      const createSkillDto: CreateSkillDto = {
        skillSubjectId: 1,
        experienceInYears: 2,
        interestLevel: 1,
        highlight: false,
      };
      const skill = await factory(Skill)().make({ ...createSkillDto, cvId });
      save.mockResolvedValue(skill);

      expect(save).not.toHaveBeenCalled();
      const result = await skillRepository.createSkill(cvId, createSkillDto);
      expect(result).toEqual(skill);

      expect(save).toHaveBeenCalled();
    });
  });

  describe('getOrCreateSkills', () => {
    let find: jest.Mock;
    let createSkill: jest.Mock;

    beforeEach(async () => {
      find = jest.fn();
      createSkill = jest.fn();
      skillRepository.find = find;
      skillRepository.createSkill = createSkill;
    });

    describe('empty skillSubjectIds', () => {
      it('returns empty array', async () => {
        const cvId = 2;
        const result = await skillRepository.getOrCreateSkills(cvId, []);
        expect(result).toEqual([]);

        expect(find).not.toHaveBeenCalled();
      });
    });

    describe('existing skills', () => {
      it('returns existing skills', async () => {
        const cvId = 2;

        const skill1 = await factory(Skill)().make({ cvId, skillSubjectId: 1 });
        const skill2 = await factory(Skill)().make({ cvId, skillSubjectId: 2 });
        find.mockResolvedValue([skill1, skill2]);

        const result = await skillRepository.getOrCreateSkills(cvId, [1, 2]);
        expect(result).toEqual([skill1, skill2]);

        expect(find).toHaveBeenCalled();
        expect(createSkill).not.toHaveBeenCalled();
      });
    });

    describe('new and existing skills', () => {
      it('creates new skill and returns existing and new skill', async () => {
        const cvId = 2;

        const skill1 = await factory(Skill)().make({ cvId, skillSubjectId: 1 });
        const skill2 = await factory(Skill)().make({ cvId, skillSubjectId: 2 });
        find.mockResolvedValue([skill1]);
        createSkill.mockResolvedValue(skill2);

        const result = await skillRepository.getOrCreateSkills(cvId, [1, 2]);
        expect(result).toEqual([skill1, skill2]);

        expect(find).toHaveBeenCalled();
        expect(createSkill).toHaveBeenCalledWith(cvId, {
          skillSubjectId: 2,
          experienceInYears: 0,
          interestLevel: 2,
          highlight: false,
        });
      });
    });
  });
});
