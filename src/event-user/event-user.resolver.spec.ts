import { Test, TestingModule } from '@nestjs/testing';
import { EventUserResolver } from './event-user.resolver';
import { EventUserService } from './event-user.service';
import { EventUserServiceMock, EventUserMock } from '../../test/event-user.service.mock';
import { EventServiceMock } from '../../test/event.service.mock';
import { EventService } from '../event/event.service';
import { async } from 'rxjs/internal/scheduler/async';
import { EventUserInput } from './models/createUser.input';

describe('EventUserResolver', () => {
  let resolver: EventUserResolver;
  let eventUserService: EventUserServiceMock
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventUserResolver,
      {provide: EventUserService,  useClass: EventUserServiceMock},
      { provide: EventService, useClass: EventServiceMock },],
    }).compile();

    resolver = module.get<EventUserResolver>(EventUserResolver);
    eventUserService = module.get<EventUserService>(EventUserService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should allow get all users', async() => {
    spyOn(eventUserService, 'getAll');
    await resolver.getUsers();
    expect(eventUserService.getAll).toHaveBeenCalled();
  })

  it('should allow to get a single user using id', async() => {
    spyOn(eventUserService, 'getOne');
    await resolver.getUser(1);
    expect(eventUserService.getOne).toHaveBeenCalledWith(1);
  })

  it('should allow to add a single platform', async() => {
    spyOn(resolver.pubSub, 'publish');
    spyOn(eventUserService, 'addPlatform').and.callThrough();
    const input = {userId: 1};
    await resolver.addPlatform(input);
    expect(eventUserService.addPlatform).toHaveBeenCalledWith(input);
    expect(resolver.pubSub.publish).toHaveBeenCalledTimes(2);
  })

  it('should throw an error, when addPlatform was unsucessfull', async() => {
    const user = new EventUserMock();
    delete user.event;
    spyOn(eventUserService, 'addPlatform').and.returnValue(user);
    spyOn(resolver, 'addPlatform').and.callThrough();
    return expect(resolver.addPlatform({userId: 1})).rejects.toThrowError();
  })

  it('should allow to add multiple platforms', async() => {
    spyOn(resolver.pubSub, 'publish');
    spyOn(eventUserService, 'addPlatforms').and.callThrough();
    const input = {userId: 1};
    await resolver.addPlatforms(input);
    expect(eventUserService.addPlatforms).toHaveBeenCalledWith(input);
    expect(resolver.pubSub.publish).toHaveBeenCalledTimes(2);
  })

  it('should throw an error, when addPlatforms was unsucessfull', async() => {
    const user = new EventUserMock();
    delete user.event;
    spyOn(eventUserService, 'addPlatforms').and.returnValue(user);
    spyOn(resolver, 'addPlatforms').and.callThrough();
    return expect(resolver.addPlatforms({userId: 1})).rejects.toThrowError();
  })

  it('should allow to add a single date', async() => {
    spyOn(resolver.pubSub, 'publish');
    spyOn(eventUserService, 'addDate').and.callThrough();
    const input = {userId: 1};
    await resolver.addDate(input);
    expect(eventUserService.addDate).toHaveBeenCalledWith(input);
    expect(resolver.pubSub.publish).toHaveBeenCalledTimes(2);
  })

  it('should throw an error, when addDate was unsucessfull', async() => {
    const user = new EventUserMock();
    delete user.event;
    spyOn(eventUserService, 'addDate').and.returnValue(user);
    spyOn(resolver, 'addDate').and.callThrough();
    return expect(resolver.addDate({userId: 1})).rejects.toThrowError();
  })

  it('should allow to add multiple dates', async() => {
    spyOn(resolver.pubSub, 'publish');
    spyOn(eventUserService, 'addDates').and.callThrough();
    const input = {userId: 1};
    await resolver.addDates(input);
    expect(eventUserService.addDates).toHaveBeenCalledWith(input);
    expect(resolver.pubSub.publish).toHaveBeenCalledTimes(2);
  })

  it('should throw an error, when addDates was unsucessfull', async() => {
    const user = new EventUserMock();
    delete user.event;
    spyOn(eventUserService, 'addDates').and.returnValue(user);
    spyOn(resolver, 'addDates').and.callThrough();
    return expect(resolver.addDates({userId: 1})).rejects.toThrowError();
  })

  it('should allow to create User', async() => {
    spyOn(resolver.pubSub, 'publish');
    spyOn(eventUserService, 'createOne').and.callThrough();
    const returnValue = await resolver.createUser({eventId: 1});
    expect(resolver.pubSub.publish).toHaveBeenCalledTimes(2);
    return expect(returnValue).toBeInstanceOf(EventUserMock);
  })

  it('should provide a userUpdated Subscription', async () => {
    spyOn(resolver.pubSub, 'asyncIterator');
    await resolver.userUpdated();
    expect(resolver.pubSub.asyncIterator).toHaveBeenCalledWith('userUpdated');
  })

  it('should provide a userCreated Subscription', async () => {
    spyOn(resolver.pubSub, 'asyncIterator');
    await resolver.userCreated();
    expect(resolver.pubSub.asyncIterator).toHaveBeenCalledWith('userCreated');
  })
});
