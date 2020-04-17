import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AddPlatformPlatformResponse{
  @Field(type => Int)
  id: number;

  @Field(type => String)
  title: string;
}