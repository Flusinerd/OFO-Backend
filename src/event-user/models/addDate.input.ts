import { Field, Int, InputType } from "@nestjs/graphql";
import { DateInput } from "./date.input";

@InputType()
export class AddDateInput{
  @Field(type => Int)
  userId: number;

  @Field({nullable: true})
  date?: DateInput;

  @Field(type => Int, {nullable: true})
  dateId?: number;
}

@InputType()
export class AddDatesInput{
  @Field(type => Int)
  userId: number;

  @Field(type => [DateInput], {nullable: true})
  dates?: DateInput[];

  @Field(type => [Int], {nullable: true})
  dateIds?: number[];
}