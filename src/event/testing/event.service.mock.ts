import { EventEntity } from "../models/event.entity";
import { CreateEventInput } from "../models/event.input";
import { AddUserInput } from "../models/addUser.input";

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