import { EventUserEntity } from "./event-user.entity";
import { Field, Int, InputType } from "@nestjs/graphql";
import { EventUserInput } from "./createUser.input";

@InputType()
export class DateInput{
  @Field(type => Int, {nullable: true})
  id: number;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field(type => EventUserInput, {nullable: true})
  user: EventUserEntity
}