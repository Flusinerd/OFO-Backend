import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventUserEntity } from './models/event-user.entity';
import { Repository } from 'typeorm';
import { EventUserInput } from './models/createUser.input';
import { AddPlatformInput } from './models/addPlatform.input';
import { EventEntity } from '../event/models/event.entity';
import { PlatformEntity } from '../platform/models/platform.entity';
import { AddPlatformsInput } from './models/addPlatforms.input';
import { AddDateInput, AddDatesInput } from './models/addDate.input';
import { DateEntity } from './models/date.entity';

@Injectable()
export class EventUserService {
  constructor(
    @InjectRepository(EventUserEntity)
    private _eventUserRepo: Repository<EventUserEntity>,

    @InjectRepository(PlatformEntity)
    private _platformRepo: Repository<PlatformEntity>,

    @InjectRepository(EventEntity)
    private _eventRepository: Repository<EventEntity>,

    @InjectRepository(DateEntity)
    private _dateRepository: Repository<DateEntity>,
  ) {}

  async getOne(id: number): Promise<EventUserEntity> {
    return this._eventUserRepo
      .createQueryBuilder('user')
      .where({ id })
      .leftJoinAndSelect('user.dates', 'date')
      .leftJoinAndSelect('user.platforms', 'platform')
      .leftJoinAndSelect('platform.event', 'platformEvent')
      .leftJoinAndSelect('user.event', 'event')
      .leftJoinAndSelect('event.optimalPlatform', 'optimalPlatform')
      .getOne();
  }

  async getAll(): Promise<EventUserEntity[]> {
    return this._eventUserRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.dates', 'date')
      .leftJoinAndSelect('user.platforms', 'platform')
      .leftJoinAndSelect('platform.event', 'platformEvent')
      .leftJoinAndSelect('user.event', 'event')
      .leftJoinAndSelect('event.optimalPlatform', 'optimalPlatform')
      .getMany();
  }

  /**
   * Unused atm
   * @param event
   */
  async getAllOfEvent(event: EventEntity | number): Promise<EventUserEntity[]> {
    return this._eventUserRepo
      .createQueryBuilder('user')
      .where({ event })
      .leftJoinAndSelect('user.dates', 'date')
      .leftJoinAndSelect('user.platforms', 'platform')
      .leftJoinAndSelect('platform.event', 'platformEvent')
      .leftJoinAndSelect('user.event', 'event')
      .leftJoinAndSelect('event.optimalPlatform', 'optimalPlatform')
      .getMany();
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
    return this.getOne(user.id);
  }

  async addPlatforms(input: AddPlatformsInput) {
    if (!input.platforms && !input.platformIds)
      throw new Error('No platform data provided');
    let user = await this._eventUserRepo.findOne(input.userId, {
      relations: ['event'],
    });
    if (!user)
      throw new Error('User with id: "' + input.userId + '" does not exist');

    const promises = [];
    if (input.platforms) {
      for (const platform of input.platforms) {
        let createdPlatform: PlatformEntity;
        createdPlatform = this._platformRepo.create(platform);
        createdPlatform.user = user;
        createdPlatform.event = user.event;
        promises.push(this._platformRepo.save(platform));
      }
    }
    if (input.platformIds) {
      for (const id of input.platformIds) {
        let foundPlatform: PlatformEntity;
        try {
          foundPlatform = await this._platformRepo.findOneOrFail(id);
          if (foundPlatform.user)
            throw new Error('Platform already has a user');
          foundPlatform.user = user;
          foundPlatform.event = user.event;
          promises.push(this._platformRepo.save(foundPlatform));
        } catch (error) {
          continue;
        }
      }
    }

    await Promise.all(promises);
    return this.getOne(user.id);
  }

  async addDate(input: AddDateInput) {
    if (!input.date && !input.dateId) throw new Error('No Date data provided');
    let user = await this.getOne(input.userId);
    if (!user) throw new Error('No user with id: "' + input.userId + '" found');

    let date: DateEntity;
    if (input.date) {
      date = await this._dateRepository.create(input.date);
    } else {
      date = await this._dateRepository.findOne(input.dateId);
    }
    if (!date) throw new Error('Date could not be found/created');
    if (date.user) throw new Error('Date already has a user assigned');

    date.user = user;
    date = await this._dateRepository.save(date);

    return this.getOne(input.userId);
  }

  async addDates(input: AddDatesInput) {
    if (
      (!input.dateIds || input.dateIds.length === 0) &&
      (!input.dates || input.dates.length === 0)
    )
      throw new Error('No Date data provided');
    let user = await this.getOne(input.userId);
    if (!user)
      throw new Error('No user with the id: "' + input.userId + '" found');

    const promises = [];
    if (input.dateIds) {
      for (const dateId of input.dateIds) {
        promises.push(this.addDate({userId: input.userId, dateId}));
      }
    }
    if (input.dates) {
      for (const date of input.dates){
        promises.push(this.addDate({userId: input.userId, date}));
      }
    }

    // Wait for all to finsh and return
    await Promise.all(promises);
    return this.getOne(user.id);
  }
}
