import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { SkillRepository } from './skill.repository';
import { Skill } from './skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';

describe('SkillRepository', () => {
  let skillRepository: any;

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
    let save: any;

    beforeEach(async () => {
      save = jest.fn();
      skillRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('returns created skill', async () => {
      const cvId = 2;
      const createSkillDto: CreateSkillDto = {
        skillSubjectId: 1,
        experienceInYears: 2,
        highlight: false,
      };
      const skill = await factory(Skill)().make({ ...createSkillDto, cvId });
      save.mockResolvedValue(skill);

      expect(save).not.toHaveBeenCalled();
      const result = await skillRepository.createSkill(cvId, createSkillDto);
      expect(save).toHaveBeenCalled();
      expect(result).toEqual(skill);
    });
  });
});
