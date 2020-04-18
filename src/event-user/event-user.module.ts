import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventUserEntity } from './models/event-user.entity';
import { EventUserService } from './event-user.service';
import { EventUserResolver } from './event-user.resolver';
import { PlatformEntity } from '../platform/models/platform.entity';
import { EventEntity } from '../event/models/event.entity';
import { PlatformModule } from '../platform/platform.module';
import { DateEntity } from './models/date.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventUserEntity, PlatformEntity, EventEntity, DateEntity]), PlatformModule],
  providers: [EventUserService, EventUserResolver],
  controllers: [],
  exports: [EventUserService]
})
export class EventUserModule {}
