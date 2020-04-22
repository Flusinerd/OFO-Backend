import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, JoinTable } from "typeorm";
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

  @OneToMany(type => DateEntity, date => date.user, {eager: true, cascade: true, nullable: true})
  @Field(type => [DateEntity], { nullable: true })
  dates?: DateEntity[];

  @ManyToMany(type => PlatformEntity, platformEntity => platformEntity.users, {eager: true, cascade: true, nullable: true})
  @JoinTable()
  @Field(type => [PlatformEntity], { nullable: true })
  platforms?: PlatformEntity[];

  @ManyToOne(type => EventEntity, event => event.users, {eager: true})
  event?: EventEntity;
}