import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Connection, EntitySubscriberInterface, UpdateEvent } from 'typeorm';
import { User } from './user.entity';
import { QUEUE_NAME_USERS, EventType } from '../constants';

@Injectable()
export class UserSubscriber implements EntitySubscriberInterface {

  constructor(
    @InjectConnection() readonly connection: Connection,

    @InjectQueue(QUEUE_NAME_USERS)
    private usersQueue: Queue,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async afterUpdate(event: UpdateEvent<User>) {
    console.log('after update');
    console.log(event);
    return this.usersQueue.add(EventType.Update, {
      old: event.databaseEntity,
      new: event.entity,
    });
  };
}
