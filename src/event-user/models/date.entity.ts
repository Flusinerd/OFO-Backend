import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { EventUserEntity } from "./event-user.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { EventEntity } from "../../event/models/event.entity";

@ObjectType()
@Entity()
export class DateEntity{
  @Field(type => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  startDate: Date;

  @Field()
  @Column()
  endDate: Date;

  @Field(type => [EventUserEntity])
  @ManyToMany(type => EventUserEntity, user => user.dates, {cascade: ["insert", "update"]})
  @JoinTable()
  users: EventUserEntity[]

  @ManyToOne(type => EventEntity, event => event.dates)
  event: EventEntity;
}