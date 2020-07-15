import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
} from "typeorm";
import { ObjectType, Field } from "type-graphql";

import { Profile } from "../entity";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column("text")
  email: string;

  @Field(() => String)
  @Column("text")
  password: string;

  @Column("int", { default: 0 })
  tokenVersion: number;

  @Field(() => Profile)
  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn()
  profile: Profile;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @CreateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
