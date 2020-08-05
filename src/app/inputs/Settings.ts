import { Field, InputType } from "type-graphql";

@InputType("settings")
export class SettingsInput {
  @Field({ nullable: true })
  colorScheme: string;

  @Field({ nullable: true })
  language: string;

  @Field(() => Boolean, { nullable: true })
  private?: boolean;
}
