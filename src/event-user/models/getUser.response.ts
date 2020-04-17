import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
class DateResponse{
  @Field(type => Int)
  id: number;

  @Field()
  date: Date;
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

  @Field()
  optimalDate: Date;

  @Field({ nullable: true })
  optimalPlatform: PlatformResponse

  @Field(type => Int)
  voted_count: number;
}

@ObjectType()
export class GetUserResponse{
  @Field(type => Int)
  id: number;

  @Field(type => [DateResponse])
  dates: DateResponse[];

  @Field(type => [PlatformResponse])
  platforms: PlatformResponse[];

  @Field({ nullable: true })
  event: EventResponse;
}