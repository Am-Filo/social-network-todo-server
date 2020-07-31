import {
  Arg,
  Ctx,
  Root,
  Query,
  PubSub,
  Resolver,
  Mutation,
  PubSubEngine,
  Subscription,
  UseMiddleware,
} from "type-graphql";

import { isAuth } from "../../middleware/isAuth";
import { MyContext } from "../context";

// ******* entity *******
import { User } from "../entity/User";
import { Profile } from "../entity/Profile";
import { TodoList } from "../entity/TodoList";

// ******* input *******
import { TodoListInput } from "../inputs/TodoList";

@Resolver(TodoList)
export class TodoListResolver {
  /**
   * subscribers
   *
   * @see https://github.com/MichalLytek/type-graphql/blob/master/examples/simple-subscriptions/resolver.ts
   * @see https://typegraphql.com/docs/subscriptions.html
   */

  // ******* subscription *******

  @Subscription({ topics: "ADDED_TODO_LIST" })
  newTodoListAdded(@Root() todoList: TodoList): TodoList {
    return todoList;
  }

  // ******* querys *******

  // Fetch all todolists
  @Query(() => [TodoList])
  todoLists() {
    return TodoList.find({
      relations: ["items", "profile"],
    });
  }

  // Fetch all user todolists
  @Query(() => Profile)
  @UseMiddleware(isAuth)
  async userTodoLists(@Ctx() { payload }: MyContext) {
    const user = await User.findOne(payload!.userId, {
      relations: ["profile"],
    });

    return await Profile.findOne(user!.profile.id, {
      relations: ["todos"],
    });
  }

  // Delete users todolists
  // TODO: delete only user todoList
  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteUserTodoLists(
    @Ctx() { payload }: MyContext,
    @Arg("id", () => [Number]) id: number[]
  ) {
    const idToDelete: number[] = [];

    await User.findOne(payload!.userId).then((res) => {
      res?.profile.todos.map((list) => {
        if (id.includes(list.id)) idToDelete.push(list.id);
      });

      if (idToDelete.length <= 0)
        throw new Error(`user haven't todoList with id: ${id}`);
      else
        console.log(`delete items with id: ${idToDelete} from origin: ${id}`);
    });

    try {
      await TodoList.delete(idToDelete);
    } catch (error) {
      throw new Error(`can't delete todoLists Error: ${error}`);
    }
    return true;
  }

  // ******* mutations *******

  @Mutation(() => Profile)
  @UseMiddleware(isAuth)
  async createTodoList(
    @PubSub() pubSub: PubSubEngine,
    @Ctx() { payload }: MyContext,
    @Arg("todoInfo") todoInfo: TodoListInput
  ) {
    const user = await User.findOne(payload!.userId, {
      relations: ["profile"],
    });

    let profile = await Profile.findOne(user!.profile.id, {
      relations: ["user", "settings", "todos"],
    });

    if (!profile) throw new Error(`could not find user by ${payload!.userId}`);

    const todoList = new TodoList();
    todoList.sortID = 0;
    todoList.title = todoInfo.title;
    todoList.text = todoInfo.text;
    todoList.profile = profile;

    try {
      await todoList.save();
      await pubSub.publish("USERADDED", todoList);
    } catch (err) {
      console.log(err);
      return false;
    }

    profile = await Profile.findOne(user!.profile.id, {
      relations: ["user", "settings", "todos", "todos.items"],
    });

    return profile;
  }
}
