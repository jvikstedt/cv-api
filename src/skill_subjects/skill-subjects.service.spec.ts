import { useSeeding, factory } from 'typeorm-seeding';
import { Test } from '@nestjs/testing';
import { SkillSubjectsService } from './skill-subjects.service';
import { SkillSubjectRepository } from './skill-subject.repository';
import { NotFoundException } from '@nestjs/common';
import { CreateSkillSubjectDto } from './dto/create-skill-subject.dto';
import { UpdateSkillSubjectDto } from './dto/update-skill-subject.dto';
import { SkillSubject } from './skill-subject.entity';

const mockSkillSubjectRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  createSkillSubject: jest.fn(),
  save: jest.fn(),
});

describe('SkillSubjectsService', () => {
  let skillSubjectsService: any;
  let skillSubjectRepository: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SkillSubjectsService,
        {
          provide: SkillSubjectRepository,
          useFactory: mockSkillSubjectRepository,
        },
      ],
    }).compile();

    skillSubjectsService = module.get<SkillSubjectsService>(
      SkillSubjectsService,
    );
    skillSubjectRepository = module.get<SkillSubjectRepository>(
      SkillSubjectRepository,
    );
  });

  describe('findAll', () => {
    it('gets all skillSubjects from the repository', async () => {
      skillSubjectRepository.find.mockResolvedValue([]);

      expect(skillSubjectRepository.find).not.toHaveBeenCalled();
      const result = await skillSubjectsService.findAll();
      expect(skillSubjectRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('calls skillSubjectRepository.findOne() and successfully retrieves and return skillSubject', async () => {
      const skillSubject = await factory(SkillSubject)().make();
      skillSubjectRepository.findOne.mockResolvedValue(skillSubject);

      const result = await skillSubjectsService.findOne(1);
      expect(result).toEqual(skillSubject);

      expect(skillSubjectRepository.findOne).toHaveBeenCalledWith(1, {
        relations: ['skillGroup'],
      });
    });

    it('throws an error as skillSubject is not found', async () => {
      skillSubjectRepository.findOne.mockResolvedValue(null);

      await expect(skillSubjectsService.findOne(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('calls skillSubjectRepository.delete(id) and deletes retrieves affected result', async () => {
      skillSubjectRepository.delete.mockResolvedValue({ affected: 1 });

      expect(skillSubjectRepository.delete).not.toHaveBeenCalled();
      await skillSubjectsService.delete(1);
      expect(skillSubjectRepository.delete).toHaveBeenCalledWith(1);
    });

    it('throws an error if affected result is 0', async () => {
      skillSubjectRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(skillSubjectsService.delete(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    const getMany = jest.fn();

    beforeEach(async () => {
      skillSubjectRepository.createQueryBuilder = jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        getMany,
      }));
    });

    it('calls skillSubjectRepository.createSkillSubject(createSkillSubjectDto) and successfully retrieves and return skillSubject', async () => {
      const createSkillSubjectDto: CreateSkillSubjectDto = {
        name: 'Vue',
        skillGroupId: 1,
      };
      const skillSubject = await factory(SkillSubject)().make(
        createSkillSubjectDto,
      );
      skillSubjectRepository.createSkillSubject.mockResolvedValue(skillSubject);
      getMany.mockResolvedValue([]);

      expect(skillSubjectRepository.createSkillSubject).not.toHaveBeenCalled();
      const result = await skillSubjectsService.create(createSkillSubjectDto);
      expect(result).toEqual(skillSubject);
      expect(skillSubjectRepository.createSkillSubject).toHaveBeenCalledWith(
        createSkillSubjectDto,
      );
    });
  });

  describe('update', () => {
    it('calls skillSubjectRepository.findOne(id) and skillSubjectRepository.save(skillSubject) successfully retrieves and return skillSubject', async () => {
      const updateSkillSubjectDto: UpdateSkillSubjectDto = { name: 'Vue' };
      const skillSubject = await factory(SkillSubject)().make();
      skillSubjectRepository.findOne.mockResolvedValue(skillSubject);
      skillSubjectRepository.save.mockResolvedValue({
        ...skillSubject,
        name: 'Vue',
      });

      expect(skillSubjectRepository.findOne).not.toHaveBeenCalled();
      expect(skillSubjectRepository.save).not.toHaveBeenCalled();
      const result = await skillSubjectsService.update(
        1,
        updateSkillSubjectDto,
      );
      expect(result).toEqual({ ...skillSubject, name: 'Vue' });
      expect(skillSubjectRepository.findOne).toHaveBeenCalledWith(1, {
        relations: ['skillGroup'],
      });
      expect(skillSubjectRepository.save).toHaveBeenCalledWith({
        ...skillSubject,
        name: 'Vue',
      });
    });

    it('throws an error as skillSubject is not found', async () => {
      const updateSkillSubjectDto: UpdateSkillSubjectDto = { name: 'Vue' };
      skillSubjectRepository.findOne.mockResolvedValue(null);

      await expect(
        skillSubjectsService.update(1, updateSkillSubjectDto),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
