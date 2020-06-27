import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Connection, EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent } from 'typeorm';
import { Skill } from './skill.entity';
import { QUEUE_NAME_SKILLS, EventType } from '../constants';

@Injectable()
export class SkillSubscriber implements EntitySubscriberInterface {

  constructor(
    @InjectConnection() readonly connection: Connection,

    @InjectQueue(QUEUE_NAME_SKILLS)
    private skillsQueue: Queue,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Skill;
  }

  async afterInsert(event: InsertEvent<Skill>) {
    return this.skillsQueue.add(EventType.Insert, {
      ...event.entity,
    });
  };

  async afterUpdate(event: UpdateEvent<Skill>) {
    return this.skillsQueue.add(EventType.Update, {
      old: event.databaseEntity,
      new: event.entity,
    });
  };

  async afterRemove(event: RemoveEvent<Skill>) {
    return this.skillsQueue.add(EventType.Remove, {
      ...event.databaseEntity,
    });
  };
}
