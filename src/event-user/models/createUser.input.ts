import { InputType, Field, GraphQLISODateTime, Int } from "@nestjs/graphql";
import { DateInput } from "./date.input";
import { DateEntity } from "./date.entity";
import { PlatformInput } from "../../platform/models/platform.input";

@InputType()
export class EventUserInput {
  @Field(type => Int)
  eventId: number;

  @Field({nullable: true})
  name?: string;
}