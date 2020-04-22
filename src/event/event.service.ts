import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from './models/event.entity';
import { CreateEventInput } from './models/event.input';
import { AddUserInput } from './models/addUser.input';
import { EventUserEntity } from '../event-user/models/event-user.entity';
import { EventUserService } from '../event-user/event-user.service';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private _eventRepository: Repository<EventEntity>,

    @InjectRepository(EventUserEntity)
    private _eventUserRepository: Repository<EventUserEntity>,

    private _eventUserService: EventUserService,
  ) {}

  async getOne(x: number): Promise<EventEntity>;
  async getOne(x: EventEntity): Promise<EventEntity>;
  async getOne(x): Promise<EventEntity>
  {
    return this._eventRepository.findOne(x, {relations: ["users", "optimalPlatform", "platforms"]});
  }

  async getAll(): Promise<EventEntity[]> {
    return this._eventRepository.find({relations: ["users", "optimalPlatform", "platforms"]});
  }

  async createOne(input: CreateEventInput): Promise<EventEntity> {
    const event = this._eventRepository.create(input);
    return this._eventRepository.save(event);
  }

  async addUser(input: AddUserInput){
    // Check if input is defined
    if (!input.userData && !input.userId){
      throw new Error('No user specified')
    }

    const event = await this._eventRepository.findOne(input.eventId, { relations: ['users'] });
    if (!event) throw new Error('No Event with the id "' + input.eventId + '" found');
    
    // Create or get user
    let user: EventUserEntity;
    if (input.userId){
      this._eventUserRepository.findOne()
      user = await this._eventUserService.getOne(input.userId);
    } else {
      user = await this._eventUserService.createOne(input.userData);
    }
    
    // Check if already linked
    if(event.users.some((searchElement: EventUserEntity) => {return searchElement.id === user.id})) throw new Error('User already linked to event');
    
    // Create relation
    user.event = event;
    user = await this._eventUserRepository.save(user);
    event.users.push(user);
    await this._eventRepository.save(event);
    await this._eventUserService.getOptimalPlatform(event);
    return this.getOne(event.id);
  }
}
