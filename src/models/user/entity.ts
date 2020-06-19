import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";

import { Settings } from "../entity";

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

  @Field(() => Int)
  @Column("int", { default: 0 })
  tokenVersion: number;

  @Field(() => Settings)
  @OneToOne(() => Settings)
  @JoinColumn()
  settings: Settings;

  // @OneToOne(() => Settings, (settings) => settings.user)
  // @JoinColumn()
  // settings: Settings;
}
