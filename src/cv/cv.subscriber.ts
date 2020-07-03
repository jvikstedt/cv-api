import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Connection, EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent } from 'typeorm';
import { CV } from './cv.entity';
import { QUEUE_NAME_CV, EventType } from '../constants';

@Injectable()
export class CVSubscriber implements EntitySubscriberInterface {

  constructor(
    @InjectConnection() readonly connection: Connection,

    @InjectQueue(QUEUE_NAME_CV)
    private cvQueue: Queue,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return CV;
  }

  async afterInsert(event: InsertEvent<CV>) {
    return this.cvQueue.add(EventType.Insert, {
      ...event.entity,
    });
  };

  async afterUpdate(event: UpdateEvent<CV>) {
    return this.cvQueue.add(EventType.Update, {
      old: event.databaseEntity,
      new: event.entity,
    });
  };

  async afterRemove(event: RemoveEvent<CV>) {
    return this.cvQueue.add(EventType.Remove, {
      ...event.databaseEntity,
    });
  };
}
