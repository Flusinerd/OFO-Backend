import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from "typeorm";
import { ObjectType, Field, Int } from "@nestjs/graphql";
import { EventEntity } from "../../event/models/event.entity";
import { EventUserEntity } from "../../event-user/models/event-user.entity";

@Entity()
@ObjectType()
export class PlatformEntity {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column({type: "varchar", nullable: false})
  @Field(type => String)
  title: string;

  @ManyToMany(type => EventUserEntity, user => user.platforms, {cascade: ["insert", "update"]})
  @Field(type => [EventUserEntity])
  users?: EventUserEntity[];

  @ManyToOne(type => EventEntity, event => event.platforms)
  @Field(type => EventEntity, {nullable: true})
  event: EventEntity;
}