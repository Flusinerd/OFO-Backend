import { EventUserEntity } from "../models/event-user.entity";
import { EventUserInput } from "../models/createUser.input";
import { AddPlatformInput } from "../models/addPlatform.input";
import { EventEntity } from "../../event/models/event.entity";

export class EventUserServiceMock {
  async getOne(id: number): Promise<EventUserEntity> {
    return new EventUserEntity();
  }

  async getAll(): Promise<EventUserEntity[]> {
    return [new EventUserEntity()];
  }

  async getAllOfEvent(event: EventEntity | number): Promise<EventUserEntity[]> {
    return [new EventUserEntity()];
  }

  async createOne(data: EventUserInput): Promise<EventUserEntity> {
    return new EventUserEntity();
  }

  async addPlatform(input: AddPlatformInput) {
    return new EventUserEntity;
  }
}