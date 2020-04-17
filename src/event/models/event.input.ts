import { InputType, Field } from "@nestjs/graphql";
import { EventUserEntity } from "../../event-user/models/event-user.entity";
import { EventUserInput } from "../../event-user/models/createUser.input";
import { PlatformInput } from "../../platform/models/platform.input";
import { PlatformEntity } from "../../platform/models/platform.entity";

@InputType()
export class CreateEventInput {
  @Field()
  title: string;

  @Field(type => [EventUserInput], {nullable: true})
  users: EventUserEntity[];

  @Field(type => [PlatformInput], {nullable: true})
  platforms: PlatformEntity[];
}