import { Test, TestingModule } from '@nestjs/testing';
import { EventUserService } from './event-user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventUserEntity } from './models/event-user.entity';
import { PlatformEntity } from '../platform/models/platform.entity';
import { EventEntity } from '../event/models/event.entity';
import { DateEntity } from './models/date.entity';
import { EventService } from '../event/event.service';
import { EventServiceMock } from '../event/testing/event.service.mock';

describe('EventUserService', () => {
  let service: EventUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventUserService,
        { provide: EventService, useClass: EventServiceMock },
        { provide: getRepositoryToken(EventUserEntity), useClass: Repository },
        { provide: getRepositoryToken(PlatformEntity), useClass: Repository },
        { provide: getRepositoryToken(EventEntity), useClass: Repository },
        { provide: getRepositoryToken(DateEntity), useClass: Repository }
      ],
    }).compile();

    service = module.get<EventUserService>(EventUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
