import { Field, InputType } from "type-graphql";

@InputType("settings")
export class SettingsInput {
  @Field({ nullable: true, defaultValue: "white" })
  colorScheme: string;

  @Field({ nullable: true, defaultValue: "english" })
  language: string;

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  private?: boolean;
}
