import { InputType, Field } from "type-graphql";

@InputType("settings")
export class SettingsInput {
  @Field({ nullable: true, defaultValue: "dark" })
  colorScheme: string;

  @Field({ nullable: true, defaultValue: "english" })
  language: string;

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  profilePrivate: boolean;
}
