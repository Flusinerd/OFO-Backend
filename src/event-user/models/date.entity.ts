import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { EventUserEntity } from "./event-user.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity()
export class DateEntity{
  @Field(type => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  date: Date

  @Field(type => EventUserEntity)
  @ManyToOne(type => EventUserEntity, user => user.dates, {cascade: ["insert", "update"]})
  user: EventUserEntity
}