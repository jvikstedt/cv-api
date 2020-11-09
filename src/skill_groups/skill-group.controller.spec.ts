import { Test } from '@nestjs/testing';
import { useSeeding, factory } from 'typeorm-seeding';
import { PassportModule } from '@nestjs/passport';
import { SkillGroupsService } from './skill-groups.service';
import { SkillGroupsController } from './skill-groups.controller';
import { SkillGroup } from './skill-group.entity';
import { PatchSkillGroupDto } from './dto/patch-skill-group.dto';

const mockSkillGroupService = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
  patch: jest.fn(),
});

describe('SkillGroupsController', () => {
  let skillGroupsController: any;
  let skillGroupsService: any;

  beforeAll(async () => {
    await useSeeding({ configName: 'src/config/typeorm.config.ts' });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [SkillGroupsController],
      providers: [
        { provide: SkillGroupsService, useFactory: mockSkillGroupService },
      ],
    }).compile();

    skillGroupsController = module.get<SkillGroupsController>(
      SkillGroupsController,
    );
    skillGroupsService = module.get<SkillGroupsService>(SkillGroupsService);
  });

  describe('findAll', () => {
    it('calls service findAll', async () => {
      const skillGroup = await factory(SkillGroup)().make();
      skillGroupsService.findAll.mockResolvedValue([skillGroup]);

      expect(skillGroupsService.findAll).not.toHaveBeenCalled();
      const result = await skillGroupsController.findAll();
      expect(skillGroupsService.findAll).toHaveBeenCalled();
      expect(result).toEqual([skillGroup]);
    });
  });

  describe('findOne', () => {
    it('calls service findOne with passed id', async () => {
      const skillGroup = await factory(SkillGroup)().make();
      skillGroupsService.findOne.mockResolvedValue(skillGroup);

      expect(skillGroupsService.findOne).not.toHaveBeenCalled();
      const result = await skillGroupsController.findOne(1);
      expect(skillGroupsService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(skillGroup);
    });
  });

  describe('delete', () => {
    it('calls service delete with passed id', async () => {
      skillGroupsService.delete.mockResolvedValue();

      expect(skillGroupsService.delete).not.toHaveBeenCalled();
      await skillGroupsController.delete(1);
      expect(skillGroupsService.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('calls service create with passed data', async () => {
      const skillGroup = await factory(SkillGroup)().make();
      skillGroupsService.create.mockResolvedValue(skillGroup);

      expect(skillGroupsService.create).not.toHaveBeenCalled();
      const result = await skillGroupsController.create({
        name: skillGroup.name,
      });
      expect(skillGroupsService.create).toHaveBeenCalledWith({
        name: skillGroup.name,
      });
      expect(result).toEqual(skillGroup);
    });
  });

  describe('patch', () => {
    it('calls service patch', async () => {
      const skillGroup = await factory(SkillGroup)().make({
        id: 1,
        name: 'old skillGroup',
      });
      const patchSkillGroupDto: PatchSkillGroupDto = {
        name: 'new skillGroup',
      };

      skillGroupsService.patch.mockResolvedValue({
        ...skillGroup,
        ...patchSkillGroupDto,
      });

      expect(skillGroupsService.patch).not.toHaveBeenCalled();
      const result = await skillGroupsController.patch(1, patchSkillGroupDto);
      expect(skillGroupsService.patch).toHaveBeenCalledWith(
        1,
        patchSkillGroupDto,
      );
      expect(result).toEqual({ ...skillGroup, ...patchSkillGroupDto });
    });
  });
});
