import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { EventUserService } from '../event-user/event-user.service';
import { EventUserServiceMock } from '../event-user/testing/event-user.service.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventUserEntity } from '../event-user/models/event-user.entity';
import { Repository } from 'typeorm';
import { EventEntity } from './models/event.entity';

describe('EventService', () => {
  let service: EventService;
  let repo: Repository<EventUserEntity>;
  let eventRepo: Repository<EventEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        { provide: EventUserService, useClass: EventUserServiceMock},
        { provide: getRepositoryToken(EventUserEntity), useClass: Repository},
        { provide: getRepositoryToken(EventEntity), useClass: Repository},
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    repo = module.get<Repository<EventUserEntity>>(getRepositoryToken(EventUserEntity));
    eventRepo = module.get<Repository<EventEntity>>(getRepositoryToken(EventEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
