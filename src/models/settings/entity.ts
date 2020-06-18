import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
} from "typeorm";
import { ObjectType } from "type-graphql";
import { User } from "../entity";

@ObjectType()
@Entity("settings")
export class Settings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { nullable: true, default: "dark" })
  colorScheme: string;

  @Column("text", { nullable: true, default: "english" })
  language: string;

  @Column("boolean", { nullable: true, default: true })
  profilePrivate: boolean;

  @OneToOne(() => User, (user) => user.settings)
  user: User;
}
