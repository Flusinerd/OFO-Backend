import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { EventEntity } from './models/event.entity';
import { EventService } from './event.service';
import { CreateEventInput } from './models/event.input';
import { AddUserInput } from './models/addUser.input';

@Resolver('Event')
export class EventResolver {
  constructor(
    private readonly _eventService: EventService,
  ) {}

  @Query(returns => [EventEntity], { name: 'events'})
  getEvents(){
    return this._eventService.getAll();
  }

  @Query(returns => EventEntity, { name: 'event' })
  getEvent(@Args('id', {type: () => Int}) x: number){
    return this._eventService.getOne(x);
  }
  
  @Mutation(returns => EventEntity, { name: 'createEvent' })
  createEvent(@Args('input', { type: () => CreateEventInput}) input: CreateEventInput) {
    return this._eventService.createOne(input);
  }

  @Mutation(returns => EventEntity, { name: 'addUser' })
  addUser(@Args('input') input: AddUserInput) {
    return this._eventService.addUser(input);
  }
}
