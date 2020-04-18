import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { EventUserService } from './event-user.service';
import { EventUserEntity } from './models/event-user.entity';
import { EventUserInput } from './models/createUser.input';
import { AddPlatformInput } from './models/addPlatform.input';
import { GetUserResponse } from './models/getUser.response';
import { AddPlatformsInput } from './models/addPlatforms.input';
import { AddDateInput, AddDatesInput } from './models/addDate.input';

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

  @Mutation(returns => GetUserResponse, {name: 'addPlatform'})
  async addPlatform(@Args('input') input: AddPlatformInput){
    return this._eventUserService.addPlatform(input);
  }

  @Mutation(returns => GetUserResponse, {name: 'addPlatforms'})
  async addPlatforms(@Args('input') input: AddPlatformsInput){
    return this._eventUserService.addPlatforms(input);
  }

  @Mutation(returns => GetUserResponse, {name: 'addDate'})
  async addDate(@Args('input') input: AddDateInput){
    return this._eventUserService.addDate(input);
  }

  @Mutation(returns => GetUserResponse, {name: 'addDates'})
  async addDates(@Args('input') input: AddDatesInput){
    return this._eventUserService.addDates(input);
  }

  @Mutation(returns => EventUserEntity, {name: 'createEventUser'})
  async createUser(@Args('input') userData: EventUserInput){
    return this._eventUserService.createOne(userData);
  }
}
