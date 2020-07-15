import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { PassportModule } from '@nestjs/passport';
import { SkillSubjectsService } from './skill-subjects.service';
import { SkillSubjectsController } from './skill-subjects.controller';
import { SkillSubject } from './skill-subject.entity';

const mockSkillSubjectsService = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
});

describe('SkillSubjectsController', () => {
  let skillSubjectsController: any;
  let skillSubjectsService: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
      ],
      controllers: [SkillSubjectsController],
      providers: [
        { provide: SkillSubjectsService, useFactory: mockSkillSubjectsService },
      ],
    })
    .compile();

    skillSubjectsController = module.get<SkillSubjectsController>(SkillSubjectsController);
    skillSubjectsService = module.get<SkillSubjectsService>(SkillSubjectsService);
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
      const result = await skillSubjectsController.create({ name: skillSubject.name });
      expect(skillSubjectsService.create).toHaveBeenCalledWith({ name: skillSubject.name });
      expect(result).toEqual(skillSubject);
    });
  });

  describe('update', () => {
    it('calls service update with id and passed data', async () => {
      const skillSubject = await factory(SkillSubject)().make();
      skillSubjectsService.update.mockResolvedValue({ ...skillSubject, name: 'Vue.js' });

      expect(skillSubjectsService.update).not.toHaveBeenCalled();
      const result = await skillSubjectsController.update(1, { name: 'Vue.js' });
      expect(skillSubjectsService.update).toHaveBeenCalledWith(1, { name: 'Vue.js' });
      expect(result).toEqual({ ...skillSubject, name: 'Vue.js' });
    });
  });
});
