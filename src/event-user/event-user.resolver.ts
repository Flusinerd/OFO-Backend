import {
  Resolver,
  Query,
  Args,
  Int,
  Mutation,
  Subscription,
} from '@nestjs/graphql';
import { EventUserService } from './event-user.service';
import { EventUserInput } from './models/createUser.input';
import { AddPlatformInput } from './models/addPlatform.input';
import { GetUserResponse } from './models/getUser.response';
import { AddPlatformsInput } from './models/addPlatforms.input';
import { AddDateInput, AddDatesInput } from './models/addDate.input';
import { PubSub } from 'graphql-subscriptions';
import { EventService } from '../event/event.service';

@Resolver('EventUser')
export class EventUserResolver {
  constructor(
    private _eventUserService: EventUserService,
    private _eventService: EventService,
  ) {}
  pubSub = new PubSub();

  @Query(type => [GetUserResponse], { name: 'eventUsers' })
  async getUsers() {
    return this._eventUserService.getAll();
  }

  @Query(type => GetUserResponse, { name: 'eventUser' })
  async getUser(@Args('id', { type: () => Int }) id: number) {
    return this._eventUserService.getOne(id);
  }

  @Mutation(returns => GetUserResponse, { name: 'addPlatform' })
  async addPlatform(@Args('input') input: AddPlatformInput) {
    const user = await this._eventUserService.addPlatform(input);
    const event = this._eventService.getOne(user.event.id);
    this.pubSub.publish('eventUpdated', { eventUpdated: event });
    this.pubSub.publish('userUpdated', { userUpdated: user });
    return user;
  }

  @Mutation(returns => GetUserResponse, { name: 'addPlatforms' })
  async addPlatforms(@Args('input') input: AddPlatformsInput) {
    const platform = await this._eventUserService.addPlatforms(input);
    const event = await this._eventService.getOne(platform.event.id);
    this.pubSub.publish('eventUpdated', { eventUpdated: event });
    this.pubSub.publish('userUpdated', { userUpdated: platform });
    return platform;
  }

  @Mutation(returns => GetUserResponse, { name: 'addDate' })
  async addDate(@Args('input') input: AddDateInput) {
    const date = this._eventUserService.addDate(input);
    const event = this._eventService.getOne((await date).event.id);
    this.pubSub.publish('eventUpdated', { eventUpdated: event });
    this.pubSub.publish('userUpdated', { userUpdated: date });
    return date;
  }

  @Mutation(returns => GetUserResponse, { name: 'addDates' })
  async addDates(@Args('input') input: AddDatesInput) {
    const date = this._eventUserService.addDates(input);
    const event = this._eventService.getOne((await date).event.id);
    this.pubSub.publish('eventUpdated', { eventUpdated: event });
    this.pubSub.publish('userUpdated', { userUpdated: date });
    return date;
  }

  @Mutation(returns => GetUserResponse, { name: 'createEventUser' })
  async createUser(@Args('input') userData: EventUserInput) {
    const user = this._eventUserService.createOne(userData);
    const event = this._eventService.getOne((await user).event.id);
    this.pubSub.publish('eventUpdated', { eventUpdated: event });
    this.pubSub.publish('userCreated', { userCreated: user });
    return user;
  }

  @Subscription(returns => GetUserResponse)
  async userUpdated() {
    return this.pubSub.asyncIterator('userUpdated');
  }

  @Subscription(returns => GetUserResponse)
  async userCreated() {
    return this.pubSub.asyncIterator('userCreated');
  }
}
