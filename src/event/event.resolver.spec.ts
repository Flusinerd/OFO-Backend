import { Test, TestingModule } from '@nestjs/testing';
import { EventResolver } from './event.resolver';
import { EventService } from './event.service';
import { EventServiceMock } from '../../test/event.service.mock';

describe('EventResolver', () => {
  let resolver: EventResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventResolver,
        { provide: EventService, useClass: EventServiceMock }
      ],
    }).compile();

    resolver = module.get<EventResolver>(EventResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
