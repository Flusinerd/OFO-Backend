import { Test, TestingModule } from '@nestjs/testing';
import { EmailResolver } from './email.resolver';
import { EmailService } from './email.service';
import { EmailServiceMock } from '../../test/email.service.mock';

describe('EmailResolver', () => {
  let resolver: EmailResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailResolver,
        {provide: EmailService, useClass: EmailServiceMock}
      ],
    }).compile();

    resolver = module.get<EmailResolver>(EmailResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
