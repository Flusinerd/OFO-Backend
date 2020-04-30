import { Field, Int, InputType } from "@nestjs/graphql";

@InputType()
export class GetEventInput{
  @Field(type => Int, { nullable: true })
  id?: number;

  @Field({nullable: true})
  eventId: string;
}