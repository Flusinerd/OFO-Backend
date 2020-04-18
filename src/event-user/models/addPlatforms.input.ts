import { InputType, Field, Int } from "@nestjs/graphql";
import { PlatformInput } from "../../platform/models/platform.input";

@InputType()
export class AddPlatformsInput {
  @Field(type => Int)
  userId: number;

  /**
   * Pass either new Platform data or existing platformId
   */
  @Field(type => [PlatformInput], { nullable: true })
  platforms?: PlatformInput[];

  /**
   * Pass either new Platform data or existing platformId
   */
  @Field(type => [Int], { nullable: true })
  platformIds?: number[];
}