import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformEntity } from './models/platform.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformEntity])],
})
export class PlatformModule {}
