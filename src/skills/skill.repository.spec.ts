import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { SkillRepository } from './skill.repository';
import { Skill } from './skill.entity';

describe('SkillRepository', () => {
  let skillRepository: any;

  beforeAll(async () => {
    await useSeeding();
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SkillRepository,
      ],
    }).compile();

    skillRepository = module.get<SkillRepository>(SkillRepository);
  });

  describe('createSkill', () => {
    let save: any;

    beforeEach(async () => {
      save = jest.fn();
      skillRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('returns created skillSkill', async () => {
      const mockCreateSkillSubjectDto = { skillSubjectId: 1, userId: 1 };
      const skill = await factory(Skill)().make(mockCreateSkillSubjectDto);
      save.mockResolvedValue(skill);

      expect(save).not.toHaveBeenCalled();
      const result = await skillRepository.createSkill(mockCreateSkillSubjectDto);
      expect(save).toHaveBeenCalled();
      expect(result).toEqual(skill);
    });
  });
});
