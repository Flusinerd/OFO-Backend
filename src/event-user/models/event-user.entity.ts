import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { DateEntity } from "./date.entity";
import { ObjectType, Field, Int } from "@nestjs/graphql";
import { PlatformEntity } from "../../platform/models/platform.entity";
import { EventEntity } from "../../event/models/event.entity";

@Entity()
@ObjectType()
export class EventUserEntity {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @OneToMany(type => DateEntity, date => date.user, {eager: true, cascade: true})
  @Field(type => [DateEntity], { nullable: true })
  dates: DateEntity[];

  @OneToMany(type => PlatformEntity, platformEntity => platformEntity.user, {eager: true, cascade: true})
  @Field(type => [PlatformEntity])
  platforms: PlatformEntity[];

  @ManyToOne(type => EventEntity, event => event.users, {eager: true})
  event?: EventEntity;
}