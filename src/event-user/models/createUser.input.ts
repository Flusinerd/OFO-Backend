import { InputType, Field, GraphQLISODateTime, Int } from "@nestjs/graphql";
import { DateInput } from "./date.input";
import { DateEntity } from "./date.entity";
import { PlatformInput } from "../../platform/models/platform.input";

@InputType()
export class EventUserInput{
  @Field(type => [DateInput], { nullable: true })
  dates: DateEntity[];

  @Field(type => [PlatformInput], {nullable: true})
  platforms: PlatformInput[];

  @Field(type => Int)
  eventId: number;
}