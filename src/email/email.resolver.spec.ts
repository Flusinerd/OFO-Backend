import { Test, TestingModule } from '@nestjs/testing';
import { EmailResolver } from './email.resolver';

describe('EmailResolver', () => {
  let resolver: EmailResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailResolver],
    }).compile();

    resolver = module.get<EmailResolver>(EmailResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
