import { EventUserEntity } from '../src/event-user/models/event-user.entity';
import { EventUserInput } from '../src/event-user/models/createUser.input';
import { AddPlatformInput } from '../src/event-user/models/addPlatform.input';
import { EventEntity } from '../src/event/models/event.entity';
import { DateEntity } from '../src/event-user/models/date.entity';
import { PlatformEntity } from '../src/platform/models/platform.entity';

export class EventUserServiceMock {
  async getOne(id: number): Promise<EventUserEntity> {
    return new EventUserMock();
  }

  async getAll(): Promise<EventUserEntity[]> {
    return [new EventUserMock()];
  }

  async getAllOfEvent(event: EventEntity | number): Promise<EventUserEntity[]> {
    return [new EventUserMock()];
  }

  async createOne(data: EventUserInput): Promise<EventUserEntity> {
    return new EventUserMock();
  }

  async addPlatform(input: AddPlatformInput) {
    return new EventUserMock();
  }

  async addPlatforms(input: AddPlatformInput) {
    return new EventUserMock();
  }

  async addDate(input: AddPlatformInput) {
    return new EventUserMock();
  }

  async addDates(input: AddPlatformInput) {
    return new EventUserMock();
  }
}

export class EventUserMock extends EventUserEntity {
  id = 1;
  platforms? = [new PlatformMock()];
  event? = new EventMock;
}

export class EventMock extends EventEntity {
  id = 1;
  eventId = 'MockEventID';
  optimalDate: DateEntity = {id: 1, startDate: new Date(), endDate: new Date(), users: [{id: 1}]};
  title = 'MockEventTitle';
  voted_count = 0;
  dates = [];
  users = [];
  platforms = [new PlatformMock(this)];
  optimalPlatform = new PlatformMock(this);
}

export class DateMock extends DateEntity {
  id = 1;
  endDate = new Date();
  startDate = new Date();
  event = new EventMock();
  users = [new EventUserMock()];
}

export class PlatformMock extends PlatformEntity {
  id = 1;
  title = 'PlatformMockTitle';
  event;

  constructor();
  constructor(event: EventMock);
  constructor(event?: EventMock){
    super();
    if (event) {
      this.event = event;
    }
  }
}
