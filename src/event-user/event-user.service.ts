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
import { EventService } from '../event/event.service';

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
    const user = this._eventUserRepo
      .createQueryBuilder('user')
      .where({ id })
      .leftJoinAndSelect('user.dates', 'date')
      .leftJoinAndSelect('user.platforms', 'platform')
      .leftJoinAndSelect('platform.event', 'platformEvent')
      .leftJoinAndSelect('user.event', 'event')
      .leftJoinAndSelect('event.users', 'eventUsers')
      .leftJoinAndSelect('eventUsers.platforms', 'eventUserPlatforms')
      .leftJoinAndSelect('event.optimalPlatform', 'optimalPlatform')
      .leftJoinAndSelect('event.dates', 'eventDates')
      .leftJoinAndSelect('eventDates.users', 'eventDateUsers')
      .getOne();
    console.log(await user);
    return user;
  }

  async getAll(): Promise<EventUserEntity[]> {
    const user = this._eventUserRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.dates', 'date')
      .leftJoinAndSelect('user.platforms', 'platform')
      .leftJoinAndSelect('platform.event', 'platformEvent')
      .leftJoinAndSelect('user.event', 'event')
      .leftJoinAndSelect('event.users', 'eventUsers')
      .leftJoinAndSelect('eventUsers.platforms', 'eventUserPlatforms')
      .leftJoinAndSelect('event.optimalPlatform', 'optimalPlatform')
      .leftJoinAndSelect('event.dates', 'eventDates')
      .leftJoinAndSelect('eventDates.users', 'eventDateUsers')
      .getMany();
    return user;
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
    let user = await this.getOne(input.userId);
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
    if (!platform.users) platform.users = [];
    if (platform.users.find(check => check.id === user.id))
      throw new Error('Platform already has this user');

    platform.users.push(user);
    if (!platform.event) {
      platform.event = user.event;
    }
    await this._platformRepo.save(platform);
    await this.getOptimalPlatform(user.event);
    return this.getOne(user.id);
  }

  async addPlatforms(input: AddPlatformsInput) {
    if (!input.platforms && !input.platformIds)
      throw new Error('No platform data provided');
    let user = await this.getOne(input.userId);
    if (!user)
      throw new Error('User with id: "' + input.userId + '" does not exist');

    const promises = [];
    if (input.platforms) {
      for (const platform of input.platforms) {
        let createdPlatform: PlatformEntity;
        createdPlatform = this._platformRepo.create(platform);
        createdPlatform.users = [user];
        createdPlatform.event = user.event;
        promises.push(this._platformRepo.save(platform));
      }
    }
    if (input.platformIds) {
      for (const id of input.platformIds) {
        let foundPlatform: PlatformEntity;
        try {
          foundPlatform = await this._platformRepo.findOneOrFail(id);
          if (foundPlatform.users.find(check => check.id === user.id))
            throw new Error('Platform already has this user');
          foundPlatform.users.push(user);
          foundPlatform.event = user.event;
          promises.push(this._platformRepo.save(foundPlatform));
        } catch (error) {
          continue;
        }
      }
    }

    await Promise.all(promises);
    await this.getOptimalPlatform(user.event);
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

    if (!date.users) {
      date.users = [];
    }
    if (!date) throw new Error('Date could not be found/created');
    if (date.users.some(check => check.id === user.id))
      throw new Error('Date already has this user assigned');

    date.users.push(user);
    date = await this._dateRepository.save(date);

    await this.getOptimalDate(user.event);
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
        promises.push(this.addDate({ userId: input.userId, dateId }));
      }
    }
    if (input.dates) {
      for (const date of input.dates) {
        promises.push(this.addDate({ userId: input.userId, date }));
      }
    }

    // Wait for all to finsh and return
    await Promise.all(promises);
    await this.getOptimalDate(user.event);
    return this.getOne(user.id);
  }

  async getOptimalPlatform(event: EventEntity) {
    if (!event.users) throw new Error('No users in event');
    const users = event.users;
    const platforms = {};

    //Iterate trough all users
    for (const user of users) {
      // Iterate through platforms of a single user
      for (const platform of user.platforms) {
        // Check if platform already exists
        if (!platforms[platform.id]) {
          platforms[platform.id] = { platform, count: 1 };
        } else {
          platforms[platform.id] = {
            platform,
            count: platforms[platform.id].count + 1,
          };
        }
      }
    }

    let highestCount = 0;
    let optimalPlatform;
    for (const platform in platforms) {
      if (platforms.hasOwnProperty(platform)) {
        const element = platforms[platform];
        if (element.count > highestCount) {
          highestCount = element.count;
          optimalPlatform = element;
        }
      }
    }

    event.optimalPlatform = optimalPlatform;
    delete event.users;
    this._eventRepository.save(event);
  }

  async getOptimalDate(event: EventEntity) {
    console.log(event);
    if (!event.users) throw new Error('No users in event');
    const users = event.users;
    let dates = event.dates;

    let highestCount = 0;
    let optimalDate;
    for (const date of dates) {
      if (date.users.length > highestCount) {
        optimalDate = date;
        highestCount = date.users.length;
      }
    }

    event.optimalDate = optimalDate;
    this._eventRepository.save(event);
  }
}
