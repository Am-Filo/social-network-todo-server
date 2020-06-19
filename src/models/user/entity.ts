import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinColumn,
  OneToOne,
} from "typeorm";

import { Profile } from "../entity";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column("text")
  email: string;

  @Column("text")
  password: string;

  @Column("int", { default: 0 })
  tokenVersion: number;

  @Field(() => Profile)
  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;

  // @OneToOne(() => Settings, (settings) => settings.user)
  // @JoinColumn()
  // settings: Settings;
}
