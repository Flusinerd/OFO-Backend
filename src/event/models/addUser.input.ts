import { Field, Int, InputType } from "@nestjs/graphql";
import { EventUserInput } from "../../event-user/models/createUser.input";

@InputType()
export class AddUserInput {
  @Field(type => Int)
  eventId: number;

  @Field(type => EventUserInput, { nullable: true })
  userData?: EventUserInput;

  @Field(type => Int, { nullable: true})
  userId?: number;
}