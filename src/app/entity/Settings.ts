import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
} from "typeorm";

import { Profile } from "./Profile";

@Entity("settings")
@ObjectType()
export class Settings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { nullable: true, default: "dark" })
  @Field(() => String)
  colorScheme: string;

  @Column("text", { nullable: true, default: "english" })
  @Field(() => String)
  language: string;

  @Column("boolean", { nullable: true, default: true })
  @Field(() => Boolean)
  private: boolean;

  @OneToOne(() => Profile, (profile) => profile.settings, {
    cascade: true,
  })
  @Field(() => Profile)
  profile: Profile;
}
