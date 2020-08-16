import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { PassportModule } from '@nestjs/passport';
import { SkillSubjectsService } from './skill-subjects.service';
import { SkillSubjectsController } from './skill-subjects.controller';
import { SkillSubject } from './skill-subject.entity';
import { PatchSkillSubjectDto } from './dto/patch-skill-subject.dto';

const mockSkillSubjectsService = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
  patch: jest.fn(),
});

describe('SkillSubjectsController', () => {
  let skillSubjectsController: any;
  let skillSubjectsService: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [SkillSubjectsController],
      providers: [
        { provide: SkillSubjectsService, useFactory: mockSkillSubjectsService },
      ],
    }).compile();

    skillSubjectsController = module.get<SkillSubjectsController>(
      SkillSubjectsController,
    );
    skillSubjectsService = module.get<SkillSubjectsService>(
      SkillSubjectsService,
    );
  });

  describe('findAll', () => {
    it('calls service findAll', async () => {
      const skillSubject = await factory(SkillSubject)().make();
      skillSubjectsService.findAll.mockResolvedValue([skillSubject]);

      expect(skillSubjectsService.findAll).not.toHaveBeenCalled();
      const result = await skillSubjectsController.findAll();
      expect(skillSubjectsService.findAll).toHaveBeenCalled();
      expect(result).toEqual([skillSubject]);
    });
  });

  describe('findOne', () => {
    it('calls service findOne with passed id', async () => {
      const skillSubject = await factory(SkillSubject)().make();
      skillSubjectsService.findOne.mockResolvedValue(skillSubject);

      expect(skillSubjectsService.findOne).not.toHaveBeenCalled();
      const result = await skillSubjectsController.findOne(1);
      expect(skillSubjectsService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(skillSubject);
    });
  });

  describe('delete', () => {
    it('calls service delete with passed id', async () => {
      skillSubjectsService.delete.mockResolvedValue();

      expect(skillSubjectsService.delete).not.toHaveBeenCalled();
      await skillSubjectsController.delete(1);
      expect(skillSubjectsService.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('calls service create with passed data', async () => {
      const skillSubject = await factory(SkillSubject)().make();
      skillSubjectsService.create.mockResolvedValue(skillSubject);

      expect(skillSubjectsService.create).not.toHaveBeenCalled();
      const result = await skillSubjectsController.create({
        name: skillSubject.name,
      });
      expect(skillSubjectsService.create).toHaveBeenCalledWith({
        name: skillSubject.name,
      });
      expect(result).toEqual(skillSubject);
    });
  });

  describe('patch', () => {
    it('calls service patch', async () => {
      const skillSubject = await factory(SkillSubject)().make({
        id: 1,
        name: 'vue',
      });
      const patchSkillSubjectDto: PatchSkillSubjectDto = {
        name: 'Vue.js',
      };

      skillSubjectsService.patch.mockResolvedValue({
        ...skillSubject,
        ...patchSkillSubjectDto,
      });

      expect(skillSubjectsService.patch).not.toHaveBeenCalled();
      const result = await skillSubjectsController.patch(
        1,
        patchSkillSubjectDto,
      );
      expect(skillSubjectsService.patch).toHaveBeenCalledWith(
        1,
        patchSkillSubjectDto,
      );
      expect(result).toEqual({ ...skillSubject, ...patchSkillSubjectDto });
    });
  });
});
