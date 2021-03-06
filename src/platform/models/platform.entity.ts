import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { ObjectType, Field, Int } from "@nestjs/graphql";
import { EventEntity } from "../../event/models/event.entity";
import { EventUserEntity } from "../../event-user/models/event-user.entity";

@Entity()
@ObjectType()
export class PlatformEntity {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column()
  @Field(type => String)
  title: string;

  @ManyToMany(type => EventUserEntity, user => user.platforms, {cascade: true})
  @Field(type => [EventUserEntity])
  @JoinTable()
  users?: EventUserEntity[];

  @ManyToOne(type => EventEntity, event => event.platforms)
  @Field(type => EventEntity, {nullable: true})
  event: EventEntity;
}