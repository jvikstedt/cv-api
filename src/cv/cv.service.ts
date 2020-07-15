import * as R from 'ramda';
import * as config from 'config';
import { Queue } from 'bull';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import * as esb from 'elastic-builder';
import { CV } from './cv.entity';
import { CVRepository } from './cv.repository';
import { PatchCVDto } from './dto/patch-cv.dto';
import { ELASTIC_INDEX_CV } from '../constants';
import { SearchCVDto, SkillSearch } from './dto/search-cv.dto';
import { QUEUE_NAME_CV, CONFIG_QUEUE, CONFIG_QUEUE_CV_RELOAD, EventType } from '../constants';
import { InjectQueue } from '@nestjs/bull';

const queueConfig = config.get(CONFIG_QUEUE);
const cvReloadDelay = queueConfig[CONFIG_QUEUE_CV_RELOAD];

@Injectable()
export class CVService {
  constructor(
    @InjectRepository(CVRepository)
    private readonly cvRepository: CVRepository,

    private readonly elasticsearchService: ElasticsearchService,

    @InjectQueue(QUEUE_NAME_CV)
    private cvQueue: Queue,
  ) {}

  async patch(cvId: number, patchCVDto: PatchCVDto): Promise<CV> {
    const oldCV = await this.findOne(cvId)

    const newCV = await this.cvRepository.save(
      R.merge(oldCV, patchCVDto),
    );

    await this.cvQueue.add(EventType.Reload, {
      id: cvId,
    }, {
      delay: cvReloadDelay,
    });

    return newCV;
  }

  async findAll(): Promise<CV[]> {
    return this.cvRepository.find({ relations: ['user'] });
  }

  async findOne(cvId: number): Promise<CV> {
    const entity = await this.cvRepository.findOne(cvId, {
      relations: ['user'],
    });
    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async search(searchCVDto: SearchCVDto): Promise<CV[]> {
    const body = esb.requestBodySearch().query(
      esb.boolQuery()
        .must([
          R.isEmpty(searchCVDto.fullName) ? esb.matchAllQuery() : esb.matchQuery('fullName', searchCVDto.fullName),
          ...R.map((skill: SkillSearch) =>
            esb.nestedQuery()
              .path('skills')
              .query(esb.termQuery('skills.skillSubjectId', skill.skillSubjectId)),
            R.filter(skill => skill.required, searchCVDto.skills))
        ])
        .should(
          R.map((skill: SkillSearch) =>
            esb.nestedQuery()
              .path('skills')
              .query(esb.termQuery('skills.skillSubjectId', skill.skillSubjectId)),
            R.reject(skill => skill.required, searchCVDto.skills))
        )
    );

    const res = await this.elasticsearchService.search({
      index: ELASTIC_INDEX_CV,
      size: searchCVDto.limit,
      body,
    });

    if (res.statusCode !== 200) {
      throw new Error(`Elasticsearch returned status: ${res.statusCode}`);
    }
    return R.map(h => h._source, res.body.hits.hits);
  }
}
