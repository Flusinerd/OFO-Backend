import { InputType, Field, Int } from "@nestjs/graphql";
import { PlatformInput } from "../../platform/models/platform.input";

@InputType()
export class AddPlatformInput {
  @Field(type => Int)
  userId: number;

  /**
   * Pass either new Platform data or existing platformId
   */
  @Field({ nullable: true })
  platform: PlatformInput;

  /**
   * Pass either new Platform data or existing platformId
   */
  @Field(type => Int, { nullable: true })
  platformId?: number;
}