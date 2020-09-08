import { Min, Max } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType('settingsInput')
export class SettingsInput {
  @Field({ nullable: true, defaultValue: 'white' })
  colorScheme: string;

  @Field({ nullable: true, defaultValue: 'english' })
  language: string;

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  private?: boolean;
}

@InputType('editSettingsInput')
export class EditSettingsInput {
  @Field({ nullable: true, defaultValue: 'white' })
  colorScheme: string;

  @Field({ nullable: true, defaultValue: 'english' })
  language: string;

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  private?: boolean;
}

@InputType('findSettingsInput')
export class FindSettingsInput {
  @Field(() => Int, { nullable: true })
  @Min(1)
  id: number;
}

@InputType('GetSettingsInput')
export class GetSettingsInput {
  @Field(() => Int, { defaultValue: 0 })
  @Min(0)
  skip: number;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  take = 25;

  @Field({ nullable: true })
  onlineType?: boolean;

  get startIndex(): number {
    return this.skip;
  }
  get endIndex(): number {
    return this.skip + this.take;
  }
}
