import { InputType, Field, Int } from "@nestjs/graphql";

@InputType()
export class SendEmailsInput{
  @Field(type => Int)
  eventId: number;

  @Field(type => [String])
  emails: string[];

  @Field(type => String)
  link: String;
}