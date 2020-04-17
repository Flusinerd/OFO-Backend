import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { EventUserService } from './event-user.service';
import { EventUserEntity } from './models/event-user.entity';
import { EventUserInput } from './models/createUser.input';
import { AddPlatformInput } from './models/addPlatform.input';
import { AddPlatformResponse } from './models/addPlatform.response';
import { GetUserResponse } from './models/getUser.response';

@Resolver('EventUser')
export class EventUserResolver {
  constructor(private _eventUserService: EventUserService) {}

  @Query(type => [GetUserResponse], {name: 'eventUsers'})
  async getUsers() {
    return this._eventUserService.getAll();
  }

  @Query(type => GetUserResponse, { name: 'eventUser' })
  async getUser(@Args('id', { type: () => Int })id: number) {
    return this._eventUserService.getOne(id);
  }

  @Mutation(returns => AddPlatformResponse, {name: 'addPlatform'})
  async addPlatform(@Args('input') input: AddPlatformInput){
    return this._eventUserService.addPlatform(input);
  }

  @Mutation(returns => EventUserEntity, {name: 'createEventUser'})
  async createUser(@Args('input') userData: EventUserInput){
    return this._eventUserService.createOne(userData);
  }
}
