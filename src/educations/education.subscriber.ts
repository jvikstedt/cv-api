import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Connection, EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent } from 'typeorm';
import { Education } from './education.entity';
import { QUEUE_NAME_EDUCATIONS, EventType } from '../constants';

@Injectable()
export class EducationSubscriber implements EntitySubscriberInterface {

  constructor(
    @InjectConnection() readonly connection: Connection,

    @InjectQueue(QUEUE_NAME_EDUCATIONS)
    private educationsQueue: Queue,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Education;
  }

  async afterInsert(event: InsertEvent<Education>) {
    return this.educationsQueue.add(EventType.Insert, {
      ...event.entity,
    });
  };

  async afterUpdate(event: UpdateEvent<Education>) {
    return this.educationsQueue.add(EventType.Update, {
      old: event.databaseEntity,
      new: event.entity,
    });
  };

  async afterRemove(event: RemoveEvent<Education>) {
    return this.educationsQueue.add(EventType.Remove, {
      ...event.databaseEntity,
    });
  };
}
