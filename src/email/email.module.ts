import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailResolver } from './email.resolver';
import { EventService } from '../event/event.service';
import { EventModule } from '../event/event.module';

@Module({
  providers: [EmailService, EmailResolver],
  imports: [EventModule]
})
export class EmailModule {}
