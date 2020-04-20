import { Test, TestingModule } from '@nestjs/testing';
import { EventUserResolver } from './event-user.resolver';
import { EventUserService } from './event-user.service';
import { EventUserServiceMock } from './testing/event-user.service.mock';
import { EventServiceMock } from '../event/testing/event.service.mock';
import { EventService } from '../event/event.service';

describe('EventUserResolver', () => {
  let resolver: EventUserResolver;
  let service: EventUserServiceMock
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventUserResolver,
      {provide: EventUserService,  useClass: EventUserServiceMock},
      { provide: EventService, useClass: EventServiceMock },],
    }).compile();

    resolver = module.get<EventUserResolver>(EventUserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
