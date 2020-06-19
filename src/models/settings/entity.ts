import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  // OneToOne,
} from "typeorm";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
@Entity("settings")
export class Settings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column("text", { nullable: true, default: "dark" })
  colorScheme: string;

  @Field(() => String)
  @Column("text", { nullable: true, default: "english" })
  language: string;

  @Field(() => Boolean)
  @Column("boolean", { nullable: true, default: true })
  profilePrivate: boolean;

  // @OneToOne(() => User)
  // user: User;

  // @OneToOne(() => User, (user) => user.settings)
  // user: User;
}
