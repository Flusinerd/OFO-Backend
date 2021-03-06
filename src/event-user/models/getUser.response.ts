import { ObjectType, Field, Int } from "@nestjs/graphql";
import { PlatformEntity } from "../../platform/models/platform.entity";
import { DateEntity } from "./date.entity";

@ObjectType()
class DateResponse{
  @Field(type => Int)
  id: number;

  @Field()
  startDate?: Date;

  @Field()
  endDate?: Date;
}

@ObjectType()
class PlatformResponse{
  @Field(type => Int)
  id: number;

  @Field()
  title: string;
}

@ObjectType()
class EventResponse{
  @Field(type => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  eventId: string;

  @Field({nullable: true})
  optimalDate?: DateEntity;

  @Field({ nullable: true })
  optimalPlatform?: PlatformResponse

  @Field(type => [DateResponse], {nullable: true})
  dates?: DateResponse[];

  @Field(type => [PlatformResponse], {nullable: true})
  platforms?: PlatformResponse[];
}

@ObjectType()
export class GetUserResponse{
  @Field(type => Int)
  id: number;

  @Field(type => [DateResponse], { nullable: true })
  dates?: DateResponse[];

  @Field(type => [PlatformEntity], { nullable: true })
  platforms?: PlatformEntity[];

  @Field({ nullable: true })
  event: EventResponse;

  @Field({nullable: true})
  name?: string;
}