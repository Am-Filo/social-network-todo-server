import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn,
} from "typeorm";

import { Settings } from "../entity";

@ObjectType()
@Entity("profile")
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column("text", { nullable: true, default: "newuser" })
  name: string;

  @Field(() => String)
  @Column("text", { nullable: true, default: "avatar-placeholder.png" })
  picture: string;

  @Field(() => Settings)
  @OneToOne(() => Settings)
  @JoinColumn()
  settings: Settings;

  // @OneToOne(() => User, (user) => user.settings)
  // user: User;
}
