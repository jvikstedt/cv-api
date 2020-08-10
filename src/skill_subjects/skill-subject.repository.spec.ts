import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { SkillSubjectRepository } from './skill-subject.repository';
import { SkillSubject } from './skill-subject.entity';
import { CreateSkillSubjectDto } from './dto/create-skill-subject.dto';

describe('SkillSubjectRepository', () => {
  let skillSubjectRepository: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SkillSubjectRepository],
    }).compile();

    skillSubjectRepository = module.get<SkillSubjectRepository>(
      SkillSubjectRepository,
    );
  });

  describe('createSkillSubject', () => {
    let save: any;

    beforeEach(async () => {
      save = jest.fn();
      skillSubjectRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('returns created skillSubject', async () => {
      const mockCreateSkillSubjectDto: CreateSkillSubjectDto = {
        name: 'Typescript',
        skillGroupId: 1,
      };
      const skillSubject = await factory(SkillSubject)().make();
      save.mockResolvedValue(skillSubject);

      expect(save).not.toHaveBeenCalled();
      const result = await skillSubjectRepository.createSkillSubject(
        mockCreateSkillSubjectDto,
      );
      expect(save).toHaveBeenCalled();
      expect(result).toEqual(skillSubject);
    });
  });
});
