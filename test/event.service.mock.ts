import { EventEntity } from "../src/event/models/event.entity";
import { CreateEventInput } from "../src/event/models/event.input";
import { AddUserInput } from "../src/event/models/addUser.input";

export class EventServiceMock{
  async getOne(x: number): Promise<EventEntity>;
  async getOne(x: EventEntity): Promise<EventEntity>;
  async getOne(x): Promise<EventEntity>
  {
    return new EventEntity;
  }

  async getAll(): Promise<EventEntity[]> {
    return [new EventEntity];
  }

  async createOne(input: CreateEventInput): Promise<EventEntity> {
    return new EventEntity;
  }

  async addUser(input: AddUserInput){
    // Check if input is defined
    if (!input.userData && !input.userId){
      throw new Error('No user specified')
    }
    return new EventEntity;
  }
}