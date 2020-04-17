import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './models/event.entity';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { EventUserModule } from '../event-user/event-user.module';
import { EventUserEntity } from '../event-user/models/event-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventEntity, EventUserEntity]),
    EventUserModule,
  ],
  providers: [EventService, EventResolver]
})
export class EventModule {}
