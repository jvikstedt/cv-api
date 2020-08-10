import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { PassportModule } from '@nestjs/passport';
import { WorkExperienceService } from './work-experience.service';
import { WorkExperienceController } from './work-experience.controller';
import { WorkExperience } from './work-experience.entity';
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';
import { PatchWorkExperienceDto } from './dto/patch-work-experience.dto';

const mockWorkExperienceService = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  create: jest.fn(),
  patch: jest.fn(),
});

describe('WorkExperienceController', () => {
  let workExperienceController: any;
  let workExperienceService: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [WorkExperienceController],
      providers: [
        {
          provide: WorkExperienceService,
          useFactory: mockWorkExperienceService,
        },
      ],
    }).compile();

    workExperienceController = module.get<WorkExperienceController>(
      WorkExperienceController,
    );
    workExperienceService = module.get<WorkExperienceService>(
      WorkExperienceService,
    );
  });

  describe('patch', () => {
    it('calls service patch with passed data', async () => {
      const cvId = 2;
      const workExperienceId = 1;
      const patchWorkExperienceDto: PatchWorkExperienceDto = { endYear: 2020 };
      const oldWorkExperience = await factory(WorkExperience)().make({
        id: workExperienceId,
        endYear: 2019,
      });
      workExperienceService.patch.mockResolvedValue({
        ...oldWorkExperience,
        ...patchWorkExperienceDto,
      });

      expect(workExperienceService.patch).not.toHaveBeenCalled();
      const result = await workExperienceController.patch(
        cvId,
        workExperienceId,
        patchWorkExperienceDto,
      );
      expect(workExperienceService.patch).toHaveBeenCalledWith(
        cvId,
        workExperienceId,
        patchWorkExperienceDto,
      );
      expect(result).toEqual({
        ...oldWorkExperience,
        ...patchWorkExperienceDto,
      });
    });
  });

  describe('create', () => {
    it('calls service create with passed data', async () => {
      const cvId = 2;
      const createWorkExperienceDto: CreateWorkExperienceDto = {
        companyId: 1,
        jobTitle: 'Developer',
        description: '',
        startYear: 2000,
        startMonth: 1,
        endYear: 2004,
        endMonth: 12,
      };
      const workExperience = await factory(WorkExperience)().make(
        createWorkExperienceDto,
      );
      workExperienceService.create.mockResolvedValue(workExperience);

      expect(workExperienceService.create).not.toHaveBeenCalled();
      const result = await workExperienceController.create(
        cvId,
        createWorkExperienceDto,
      );
      expect(workExperienceService.create).toHaveBeenCalledWith(
        cvId,
        createWorkExperienceDto,
      );
      expect(result).toEqual(workExperience);
    });
  });

  describe('findAll', () => {
    it('calls service findAll', async () => {
      const workExperience = await factory(WorkExperience)().make();
      workExperienceService.findAll.mockResolvedValue([workExperience]);

      expect(workExperienceService.findAll).not.toHaveBeenCalled();
      const result = await workExperienceController.findAll();
      expect(workExperienceService.findAll).toHaveBeenCalled();
      expect(result).toEqual([workExperience]);
    });
  });

  describe('findOne', () => {
    it('calls service findOne with passed id', async () => {
      const cvId = 2;
      const workExperienceId = 1;
      const workExperience = await factory(WorkExperience)().make();
      workExperienceService.findOne.mockResolvedValue(workExperience);

      expect(workExperienceService.findOne).not.toHaveBeenCalled();
      const result = await workExperienceController.findOne(
        cvId,
        workExperienceId,
      );
      expect(workExperienceService.findOne).toHaveBeenCalledWith(
        cvId,
        workExperienceId,
      );
      expect(result).toEqual(workExperience);
    });
  });

  describe('remove', () => {
    it('calls service remove with passed id', async () => {
      const cvId = 2;
      const workExperienceId = 1;
      workExperienceService.remove.mockResolvedValue();

      expect(workExperienceService.remove).not.toHaveBeenCalled();
      await workExperienceController.remove(cvId, workExperienceId);
      expect(workExperienceService.remove).toHaveBeenCalledWith(
        cvId,
        workExperienceId,
      );
    });
  });
});
