import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { SkillGroupRepository } from './skill-group.repository';
import { SkillGroup } from './skill-group.entity';
import { CreateSkillGroupDto } from './dto/create-skill-group.dto';

describe('SkillGroupRepository', () => {
  let skillGroupRepository: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SkillGroupRepository],
    }).compile();

    skillGroupRepository = module.get<SkillGroupRepository>(
      SkillGroupRepository,
    );
  });

  describe('createSkillGroup', () => {
    let save: any;

    beforeEach(async () => {
      save = jest.fn();
      skillGroupRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('returns created skillGroup', async () => {
      const createSkillGroupDto: CreateSkillGroupDto = { name: 'Programming' };
      const skillGroup = await factory(SkillGroup)().make(createSkillGroupDto);
      save.mockResolvedValue(skillGroup);

      expect(save).not.toHaveBeenCalled();
      const result = await skillGroupRepository.createSkillGroup(
        createSkillGroupDto,
      );
      expect(save).toHaveBeenCalled();
      expect(result).toEqual(skillGroup);
    });
  });
});
