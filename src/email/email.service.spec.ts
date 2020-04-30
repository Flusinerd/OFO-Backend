import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { MailerService } from '@nestjs-modules/mailer';
import { MailerServiceMock } from '../../test/mailer.service.mock';
import { EventService } from '../event/event.service';
import { EventServiceMock } from '../../test/event.service.mock';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {provide: MailerService, useClass: MailerServiceMock},
        {provide: EventService, useClass: EventServiceMock}
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
