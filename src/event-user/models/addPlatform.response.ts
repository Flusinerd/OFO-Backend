import { Field, Int, ObjectType } from "@nestjs/graphql";
import { DateEntity } from "./date.entity";
import { AddPlatformPlatformResponse } from "../../platform/models/platformWithoutUser";
import { EventEntity } from "../../event/models/event.entity";

@ObjectType()
export class AddPlatformResponse {
  @Field(type => Int)
  id: number;

  @Field(type => [DateEntity], { nullable: true })
  dates: DateEntity[];

  @Field(type => [AddPlatformPlatformResponse])
  platforms: AddPlatformPlatformResponse[];

  @Field(type => EventEntity)
  event?: EventEntity;
}