import { InputType, Field } from "type-graphql";

import { Settings } from "../entity/Settings";
import { SettingsInput } from "./Settings";

@InputType()
export class ProfileInput {
  @Field({ nullable: true, defaultValue: "usernname" })
  name: string;

  @Field({ nullable: true, defaultValue: "picture" })
  picture: string;

  @Field(() => SettingsInput)
  settings: Settings;
}
