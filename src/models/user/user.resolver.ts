import {
  Int,
  Arg,
  Ctx,
  Root,
  Query,
  PubSub,
  Resolver,
  Mutation,
  Subscription,
  PubSubEngine,
  UseMiddleware,
} from 'type-graphql';
import { Service } from 'typedi';
import { getConnection } from 'typeorm';

import { isAuth } from '../../middleware/isAuth';
import { MyContext } from '../../helpers/context';
import { sendRefreshToken } from '../../helpers/sendRefreshToken';

// ******* entities *******
import { User } from './user.entity';

// ******* types *******
import { LoginResponse } from './user.types';

// ******* services *******
import { UserService } from './user.service';

// ******* inputs *******
import {
  CreateUserInput,
  EditUserInput,
  FindUserInput,
  GetUsersInput,
  LoginUserInput,
  DeleteUserInput,
} from './user.inputs';

@Service()
@Resolver(User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  /**
   * subscribers
   *
   * @see https://github.com/MichalLytek/type-graphql/blob/master/examples/simple-subscriptions/resolver.ts
   * @see https://typegraphql.com/docs/subscriptions.html
   */

  // ******* subscription *******

  @Subscription({ topics: 'USERADDED' })
  newUserAdded(@Root() user: User): User {
    return user;
  }

  // ******* querys *******

  // Get all users
  @Query(() => [User])
  users(@Arg('filter', () => GetUsersInput) data: GetUsersInput) {
    return this.userService.getAll(data);
  }

  // Get user by id or email
  @Query(() => User)
  async findUser(@Arg('filter', () => FindUserInput) data: FindUserInput) {
    return await this.userService.findBy(data);
  }

  // Get authorize user information
  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  me(@Ctx() { payload }: MyContext) {
    return this.userService.getById(payload!.userId);
  }

  // ******* mutations *******

  // Register
  @Mutation(() => Boolean)
  async register(
    @PubSub() pubSub: PubSubEngine,
    @Arg('data', () => CreateUserInput) data: CreateUserInput
  ) {
    try {
      const newUser = await this.userService.createUser(data);
      await pubSub.publish('USERADDED', newUser);
      return !!newUser;
    } catch (err) {
      throw err;
    }
  }

  // Edit user
  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async editUser(
    @Ctx() { payload }: MyContext,
    @Arg('data', () => EditUserInput) data: EditUserInput
  ) {
    try {
      return await this.userService.editUser(data, payload!.userId);
    } catch (err) {
      throw err;
    }
  }

  // Delete user
  @Mutation(() => Boolean)
  async deleteUser(@Arg('data', () => DeleteUserInput) data: DeleteUserInput) {
    try {
      return !!(await this.userService.deleteUser(data));
    } catch (err) {
      throw err;
    }
  }

  // Login
  @Mutation(() => LoginResponse)
  async login(
    @Arg('data', () => LoginUserInput) data: LoginUserInput,
    @Ctx() { res }: MyContext
  ) {
    return await this.userService.login(data, res);
  }

  // Logout
  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: MyContext) {
    sendRefreshToken(res, '');
    return true;
  }

  // Revorkere fresh tokens for user
  @Mutation(() => Boolean)
  async revorkerefreshTokensForUser(@Arg('userId', () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, 'tokenVersion', 1);

    return true;
  }
}
