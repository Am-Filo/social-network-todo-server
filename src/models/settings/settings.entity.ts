import {
  Column,
  Entity,
  OneToOne,
  BaseEntity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";

import { Profile } from "../profile/profile.entity";

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

  @OneToOne(() => Profile, (profile) => profile.settings)
  @Field(() => Profile)
  profile: Profile;
}
