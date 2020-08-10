import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { PassportModule } from '@nestjs/passport';
import { EducationsService } from './educations.service';
import { EducationsController } from './educations.controller';
import { Education } from './education.entity';
import { CreateEducationDto } from './dto/create-education.dto';
import { PatchEducationDto } from './dto/patch-education.dto';

const mockEducationsService = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  create: jest.fn(),
  patch: jest.fn(),
});

describe('EducationsController', () => {
  let educationsController: any;
  let educationsService: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [EducationsController],
      providers: [
        { provide: EducationsService, useFactory: mockEducationsService },
      ],
    }).compile();

    educationsController = module.get<EducationsController>(
      EducationsController,
    );
    educationsService = module.get<EducationsService>(EducationsService);
  });

  describe('patch', () => {
    it('calls service patch with passed data', async () => {
      const cvId = 2;
      const educationId = 1;
      const patchEducationDto: PatchEducationDto = { endYear: 2020 };
      const oldEducation = await factory(Education)().make({
        id: educationId,
        endYear: 2019,
      });
      educationsService.patch.mockResolvedValue({
        ...oldEducation,
        ...patchEducationDto,
      });

      expect(educationsService.patch).not.toHaveBeenCalled();
      const result = await educationsController.patch(
        cvId,
        educationId,
        patchEducationDto,
      );
      expect(educationsService.patch).toHaveBeenCalledWith(
        cvId,
        educationId,
        patchEducationDto,
      );
      expect(result).toEqual({ ...oldEducation, ...patchEducationDto });
    });
  });

  describe('create', () => {
    it('calls service create with passed data', async () => {
      const cvId = 2;
      const createEducationDto: CreateEducationDto = {
        schoolId: 1,
        degree: "Bachelor's degree, Information Technology",
        fieldOfStudy: 'Computer Software Engineering',
        description: '',
        startYear: 2000,
        endYear: 2004,
        highlight: false,
      };
      const education = await factory(Education)().make(createEducationDto);
      educationsService.create.mockResolvedValue(education);

      expect(educationsService.create).not.toHaveBeenCalled();
      const result = await educationsController.create(
        cvId,
        createEducationDto,
      );
      expect(educationsService.create).toHaveBeenCalledWith(
        cvId,
        createEducationDto,
      );
      expect(result).toEqual(education);
    });
  });

  describe('findAll', () => {
    it('calls service findAll', async () => {
      const education = await factory(Education)().make();
      educationsService.findAll.mockResolvedValue([education]);

      expect(educationsService.findAll).not.toHaveBeenCalled();
      const result = await educationsController.findAll();
      expect(educationsService.findAll).toHaveBeenCalled();
      expect(result).toEqual([education]);
    });
  });

  describe('findOne', () => {
    it('calls service findOne with passed id', async () => {
      const cvId = 2;
      const educationId = 1;
      const education = await factory(Education)().make();
      educationsService.findOne.mockResolvedValue(education);

      expect(educationsService.findOne).not.toHaveBeenCalled();
      const result = await educationsController.findOne(cvId, educationId);
      expect(educationsService.findOne).toHaveBeenCalledWith(cvId, educationId);
      expect(result).toEqual(education);
    });
  });

  describe('remove', () => {
    it('calls service remove with passed id', async () => {
      const cvId = 2;
      const educationId = 1;
      educationsService.remove.mockResolvedValue();

      expect(educationsService.remove).not.toHaveBeenCalled();
      await educationsController.remove(cvId, educationId);
      expect(educationsService.remove).toHaveBeenCalledWith(cvId, educationId);
    });
  });
});
