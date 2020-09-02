import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";

// ******* entity *******
import { Profile } from "../profile/profile.entity";

@Entity("user")
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number;

  @Column("text")
  @Field(() => String)
  email: string;

  @Column("text")
  @Field(() => String)
  password: string;

  @Column("int", { default: 0 })
  tokenVersion: number;

  @OneToOne(() => Profile, (profile) => profile.user, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  @Field(() => Profile)
  profile: Profile;

  @Column("boolean", { default: false })
  confirm: boolean;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @CreateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
