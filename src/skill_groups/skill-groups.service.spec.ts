import { useSeeding, factory } from 'typeorm-seeding';
import { Test } from '@nestjs/testing';
import { SkillGroupsService } from './skill-groups.service';
import { SkillGroupRepository } from './skill-group.repository';
import { NotFoundException } from '@nestjs/common';
import { CreateSkillGroupDto } from './dto/create-skill-group.dto';
import { PatchSkillGroupDto } from './dto/patch-skill-group.dto';
import { SkillGroup } from './skill-group.entity';

const mockSkillGroupRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  createSkillGroup: jest.fn(),
  save: jest.fn(),
});

describe('SkillGroupService', () => {
  let skillGroupsService: any;
  let skillGroupRepository: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SkillGroupsService,
        { provide: SkillGroupRepository, useFactory: mockSkillGroupRepository },
      ],
    }).compile();

    skillGroupsService = module.get<SkillGroupsService>(SkillGroupsService);
    skillGroupRepository = module.get<SkillGroupRepository>(
      SkillGroupRepository,
    );
  });

  describe('findAll', () => {
    it('gets all skill groups from the repository', async () => {
      skillGroupRepository.find.mockResolvedValue([]);

      expect(skillGroupRepository.find).not.toHaveBeenCalled();
      const result = await skillGroupsService.findAll();
      expect(skillGroupRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('calls skillGroupRepository.findOne() and successfully retrieves and return skillGroup', async () => {
      const skillGroup = await factory(SkillGroup)().make();
      skillGroupRepository.findOne.mockResolvedValue(skillGroup);

      const result = await skillGroupsService.findOne(1);
      expect(result).toEqual(skillGroup);

      expect(skillGroupRepository.findOne).toHaveBeenCalledWith(1);
    });

    it('throws an error as skillGroup is not found', async () => {
      skillGroupRepository.findOne.mockResolvedValue(null);

      await expect(skillGroupsService.findOne(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('calls skillGroupRepository.delete(id) and deletes retrieves affected result', async () => {
      skillGroupRepository.delete.mockResolvedValue({ affected: 1 });

      expect(skillGroupRepository.delete).not.toHaveBeenCalled();
      await skillGroupsService.delete(1);
      expect(skillGroupRepository.delete).toHaveBeenCalledWith(1);
    });

    it('throws an error if affected result is 0', async () => {
      skillGroupRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(skillGroupsService.delete(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    const getMany = jest.fn();

    beforeEach(async () => {
      skillGroupRepository.createQueryBuilder = jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        getMany,
      }));
    });

    it('calls skillGroupRepository.createSkillGroup(createSkillGroupDto) and successfully retrieves and return skillGroup', async () => {
      const createSkillGroupDto: CreateSkillGroupDto = { name: 'Metropolia' };
      const skillGroup = await factory(SkillGroup)().make(createSkillGroupDto);
      skillGroupRepository.createSkillGroup.mockResolvedValue(skillGroup);
      getMany.mockResolvedValue([]);

      expect(skillGroupRepository.createSkillGroup).not.toHaveBeenCalled();
      const result = await skillGroupsService.create(createSkillGroupDto);
      expect(result).toEqual(skillGroup);
      expect(skillGroupRepository.createSkillGroup).toHaveBeenCalledWith(
        createSkillGroupDto,
      );
    });
  });

  describe('patch', () => {
    it('finds skillGroup by id and updates it', async () => {
      const skillGroup = await factory(SkillGroup)().make({ id: 1 });
      const patchSkillGroupDto: PatchSkillGroupDto = { name: 'New skillGroup' };

      skillGroupRepository.findOne.mockResolvedValue(skillGroup);
      skillGroupRepository.save.mockResolvedValue({
        ...skillGroup,
        ...patchSkillGroupDto,
      });

      expect(skillGroupRepository.findOne).not.toHaveBeenCalled();
      expect(skillGroupRepository.save).not.toHaveBeenCalled();
      const result = await skillGroupsService.patch(1, patchSkillGroupDto);
      expect(result).toEqual({ ...skillGroup, ...patchSkillGroupDto });
      expect(skillGroupRepository.findOne).toHaveBeenCalledWith(1);
      expect(skillGroupRepository.save).toHaveBeenCalledWith({
        ...skillGroup,
        ...patchSkillGroupDto,
      });
    });

    it('throws an error as skillGroup is not found', async () => {
      skillGroupRepository.findOne.mockResolvedValue(null);

      await expect(skillGroupsService.patch(1, {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
