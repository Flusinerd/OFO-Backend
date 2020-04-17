import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class PlatformInput {
  @Field()
  title: string;
}