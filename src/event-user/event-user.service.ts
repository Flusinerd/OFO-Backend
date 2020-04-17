import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventUserEntity } from './models/event-user.entity';
import { Repository } from 'typeorm';
import { EventUserInput } from './models/createUser.input';
import { AddPlatformInput } from './models/addPlatform.input';
import { EventEntity } from '../event/models/event.entity';
import { PlatformEntity } from '../platform/models/platform.entity';

@Injectable()
export class EventUserService {
  constructor(
    @InjectRepository(EventUserEntity)
    private _eventUserRepo: Repository<EventUserEntity>,

    @InjectRepository(PlatformEntity)
    private _platformRepo: Repository<PlatformEntity>,

    @InjectRepository(EventEntity)
    private _eventRepository: Repository<EventEntity>,
  ) {}

  async getOne(id: number): Promise<EventUserEntity> {
    return this._eventUserRepo
      .createQueryBuilder('user')
      .where({id})
      .leftJoinAndSelect('user.dates', 'date')
      .leftJoinAndSelect('user.platforms', 'platform')
      .leftJoinAndSelect('user.event', 'event')
      .leftJoinAndSelect('event.optimalPlatform', 'optimalPlatform')
      .getOne();
  }

  async getAll(): Promise<EventUserEntity[]> {
    return this._eventUserRepo
      .createQueryBuilder('user')
      .select()
      .leftJoinAndSelect('user.dates', 'date')
      .leftJoinAndSelect('user.platforms', 'platform')
      .leftJoinAndSelect('user.event', 'event')
      .leftJoinAndSelect('event.optimalPlatform', 'optimalPlatform')
      .getMany();
  }

  async getAllOfEvent(event: EventEntity | number): Promise<EventUserEntity[]> {
    return this._eventUserRepo.find({ where: { event } });
  }

  async createOne(data: EventUserInput): Promise<EventUserEntity> {
    let event;
    if (data.eventId) {
      event = await this._eventRepository.findOne(data.eventId);
    }
    const entity = this._eventUserRepo.create(data);
    entity.event = event;
    return this._eventUserRepo.save(entity);
  }

  async addPlatform(input: AddPlatformInput) {
    let user = await this._eventUserRepo.findOne(input.userId, {
      relations: ['event'],
    });
    if (!user)
      throw new Error('User with id: "' + input.userId + '" does not exist');
    if (!input.platform && !input.platformId)
      throw new Error('No platform data provided');

    let platform: PlatformEntity;
    if (input.platform) {
      platform = this._platformRepo.create(input.platform);
    } else {
      platform = await this._platformRepo.findOne(input.platformId);
    }

    if (!platform) throw new Error('Platform could not be found');
    if (platform.user) throw new Error('Platform already has a user');

    platform.user = user;
    platform.event = user.event;

    await this._platformRepo.save(platform);
    return await this._eventUserRepo
      .createQueryBuilder('user')
      .where({ 'user.id': user.id })
      .leftJoinAndSelect('user.event', 'event')
      .leftJoinAndSelect('user.dates', 'date')
      .leftJoinAndSelect('user.platforms', 'platform')
      .getOne();
  }
}
