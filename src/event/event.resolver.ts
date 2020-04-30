import {
  Resolver,
  Query,
  Args,
  Mutation,
  Subscription,
} from '@nestjs/graphql';
import { EventEntity } from './models/event.entity';
import { EventService } from './event.service';
import { CreateEventInput } from './models/event.input';
import { AddUserInput } from './models/addUser.input';
import { PubSub } from 'graphql-subscriptions';
import { GetEventInput } from './models/getEvent.input';

const pubSub = new PubSub();

@Resolver('Event')
export class EventResolver {
  constructor(private readonly _eventService: EventService) {}

  @Query(returns => [EventEntity], { name: 'events' })
  getEvents() {
    return this._eventService.getAll();
  }

  @Query(returns => EventEntity, { name: 'event' })
  getEvent(@Args('input', { type: () => GetEventInput }) x: GetEventInput) {
    return this._eventService.getOne(x);
  }

  @Mutation(returns => EventEntity, { name: 'createEvent' })
  createEvent(
    @Args('input', { type: () => CreateEventInput }) input: CreateEventInput,
  ) {
    const event = this._eventService.createOne(input);
    pubSub.publish('eventCreated', { eventCreated: event });
    return event;
  }

  @Mutation(returns => EventEntity, { name: 'addUser' })
  addUser(@Args('input') input: AddUserInput) {
    const event = this._eventService.addUser(input);
    pubSub.publish('eventCreated', { eventUpdated: event });
    return event;
  }

  @Subscription(returns => EventEntity)
  eventUpdated() {
    return pubSub.asyncIterator('eventUpdated');
  }

  @Subscription(returns => EventEntity)
  eventCreated() {
    return pubSub.asyncIterator('eventCreated');
  }
}
