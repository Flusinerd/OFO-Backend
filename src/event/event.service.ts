import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from './models/event.entity';
import { CreateEventInput } from './models/event.input';
import { AddUserInput } from './models/addUser.input';
import { EventUserEntity } from '../event-user/models/event-user.entity';
import { EventUserService } from '../event-user/event-user.service';
import { GetEventInput } from './models/getEvent.input';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private _eventRepository: Repository<EventEntity>,

    @InjectRepository(EventUserEntity)
    private _eventUserRepository: Repository<EventUserEntity>,

    private _eventUserService: EventUserService,
  ) {}

  /**
   * Fetches one event using the provided identifier
   * @param x event identifier
   */
  async getOne(x: number): Promise<EventEntity>;
  async getOne(x: EventEntity): Promise<EventEntity>;
  async getOne(x: GetEventInput): Promise<EventEntity>;
  async getOne(x): Promise<EventEntity>
  {
    if (typeof x === "object"){
      if (x.eventId){
        return this._eventRepository.createQueryBuilder('event')
        .where({eventId: x.eventId})
        .leftJoinAndSelect('event.users', 'eventUsers')
        .leftJoinAndSelect('event.optimalPlatform', 'optimalPlatform')
        .leftJoinAndSelect('event.optimalDate', 'optimalDate')
        .leftJoinAndSelect('optimalDate.users', 'optimalDateUser')
        .leftJoinAndSelect('event.platforms', 'platforms')
        .leftJoinAndSelect('optimalPlatform.users', 'optimalPlatformUser')
        .leftJoinAndSelect('platforms.users', 'platformUsers')
        .leftJoinAndSelect('event.dates', 'dates')
        .leftJoinAndSelect('dates.users', 'dateUsers')
        .getOne();
      } if (x.id){
        return this._eventRepository.createQueryBuilder('event')
        .where({id: x.id})
        .leftJoinAndSelect('event.users', 'eventUsers')
        .leftJoinAndSelect('event.optimalPlatform', 'optimalPlatform')
        .leftJoinAndSelect('event.optimalDate', 'optimalDate')
        .leftJoinAndSelect('optimalDate.users', 'optimalDateUser')
        .leftJoinAndSelect('event.platforms', 'platforms')
        .leftJoinAndSelect('optimalPlatform.users', 'optimalPlatformUser')
        .leftJoinAndSelect('platforms.users', 'platformUsers')
        .leftJoinAndSelect('event.dates', 'dates')
        .leftJoinAndSelect('dates.users', 'dateUsers')
        .getOne();
      } else {
        throw new Error('Please provide either the eventId or the id');
      }
    }
    if (typeof x === "number"){
      return this._eventRepository.createQueryBuilder('event')
        .where({id: x})
        .leftJoinAndSelect('event.users', 'eventUsers')
        .leftJoinAndSelect('event.optimalPlatform', 'optimalPlatform')
        .leftJoinAndSelect('event.optimalDate', 'optimalDate')
        .leftJoinAndSelect('optimalDate.users', 'optimalDateUser')
        .leftJoinAndSelect('event.platforms', 'platforms')
        .leftJoinAndSelect('optimalPlatform.users', 'optimalPlatformUser')
        .leftJoinAndSelect('platforms.users', 'platformUsers')
        .leftJoinAndSelect('event.dates', 'dates')
        .leftJoinAndSelect('dates.users', 'dateUsers')
        .getOne();
    }
  }

  /**
   * Fetches all events
   */
  async getAll(): Promise<EventEntity[]> {
    return this._eventRepository.createQueryBuilder('event')
    .leftJoinAndSelect('event.users', 'eventUsers')
    .leftJoinAndSelect('event.optimalPlatform', 'optimalPlatform')
    .leftJoinAndSelect('event.optimalDate', 'optimalDate')
    .leftJoinAndSelect('optimalDate.users', 'optimalDateUser')
    .leftJoinAndSelect('event.platforms', 'platforms')
    .leftJoinAndSelect('optimalPlatform.users', 'optimalPlatformUser')
    .leftJoinAndSelect('platforms.users', 'platformUsers')
    .leftJoinAndSelect('event.dates', 'dates')
    .leftJoinAndSelect('dates.users', 'dateUsers')
    .getMany();
  }

  /**
   * Creates one event
   * @param input event Data
   */
  async createOne(input: CreateEventInput): Promise<EventEntity> {
    const event = this._eventRepository.create(input);
    event.eventId = Buffer.from(new Date().valueOf().toString()).toString('base64');
    event.eventId = event.eventId.replace(/=/g, "");
    event.eventId = event.eventId.replace(/\+/g, "");
    event.eventId = event.eventId.replace(/\//g, "");
    return this._eventRepository.save(event);
  }
}
