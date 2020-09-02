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
import { MyContext } from "../../helpers/context";

// ******* entity *******
import { User } from "../user/user.entity";
import { Profile } from "../profile/profile.entity";
import { TodoList } from "../todo-list/todo-list.entity";

// ******* input *******
import { TodoListInput, ReorderTodoListInputs } from "./todo-list.inputs";

// ******* types *******
import { TodoListSubscriber } from "./todo-list.types";

@Resolver(TodoList)
export class TodoListResolver {
  /**
   * subscribers
   *
   * @see https://github.com/MichalLytek/type-graphql/blob/master/examples/simple-subscriptions/resolver.ts
   * @see https://typegraphql.com/docs/subscriptions.html
   */

  // ******* subscription *******

  @Subscription({ topics: "SUB_TODO_LIST" })
  newTodoListAdded(
    @Root() incomimgData: { type: string; ids: number[] }
  ): TodoListSubscriber {
    const data: any = {};

    switch (incomimgData.type) {
      case "add":
        data.type = "add";
        data.id = incomimgData.ids[0];
        data.content = TodoList.findOne(incomimgData.ids[0]);
        break;
      case "update":
        data.type = "update";
        data.id = incomimgData.ids[0];
        data.content = TodoList.findOne(incomimgData.ids[0]);
        break;
      case "private":
        data.type = "private";
        data.id = incomimgData.ids[0];
        break;
      case "delete":
        data.type = "delete";
        data.ids = incomimgData.ids;
        break;
    }

    return data;
  }

  // ******* querys *******

  // Fetch all todolists
  @Query(() => [TodoList])
  todoLists() {
    return TodoList.find({
      where: {
        private: false,
      },
      relations: ["items", "profile"],
    });
  }

  // Fetch all user todo lists
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

  // ******* mutations *******

  // Create user todo list
  @Mutation(() => TodoList)
  @UseMiddleware(isAuth)
  async createTodoList(
    @PubSub() pubSub: PubSubEngine,
    @Ctx() { payload }: MyContext,
    @Arg("todoInfo") todoInfo: TodoListInput
  ) {
    const user = await User.findOne(payload!.userId);

    if (!user) throw new Error(`could not find user by ${payload!.userId}`);

    const profile = await Profile.findOne(user!.profile.id);

    if (!profile)
      throw new Error(`could not find user profile by ${user!.profile.id}`);

    const todoList = new TodoList();
    todoList.sortID = 0;
    todoList.title = todoInfo.title || "New todo list";
    todoList.text =
      todoInfo.text || "Write some information about this todo list";
    todoList.private = todoInfo.private || false;
    todoList.profile = profile;

    try {
      await todoList.save();
    } catch (err) {
      console.log(err);
      return false;
    }

    if (!todoList.private)
      await pubSub.publish("SUB_TODO_LIST", {
        type: "add",
        ids: [todoList.id],
      });

    return todoList;
  }

  // Edit user todo list
  @Mutation(() => TodoList)
  @UseMiddleware(isAuth)
  async editUserTodoList(
    @PubSub() pubSub: PubSubEngine,
    @Ctx() { payload }: MyContext,
    @Arg("id", () => Number) id: number,
    @Arg("data") _todoList: TodoListInput
  ) {
    const todoId = await User.findOne(payload!.userId).then((res) => {
      return res?.profile.todos.find((list) => {
        return list.id === id;
      });
    });

    if (!todoId) throw new Error(`user haven't todo list with id: ${id}`);

    let todoList = await TodoList.findOne(todoId.id);

    if (!todoList)
      throw new Error(`can't find user todo list by todoListId ${todoId.id}`);

    try {
      TodoList.update(todoId.id, _todoList);
    } catch (err) {
      console.log(
        `can't update user todo list (userId: ${
          payload!.userId
        }, todoListId: ${todoId})`,
        err
      );
      throw new Error(
        `can't update user todo list (userId: ${
          payload!.userId
        }, todoListId: ${todoId})`
      );
    }

    todoList = await TodoList.findOne(todoId.id);

    if (todoList)
      await pubSub.publish("SUB_TODO_LIST", {
        type: todoList.private ? "private" : "update",
        ids: [todoList.id],
      });

    return todoList;
  }

  // Reorder user todo list in todo list
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async reorderTodoItem(
    @Ctx() { payload }: MyContext,
    @Arg("reorderData", () => [ReorderTodoListInputs]) reorderTodoLists: [ReorderTodoListInputs]
  ) {
    const user = await User.findOne(payload!.userId);

    if (!user) throw new Error(`could not find user by ${payload!.userId}`);

    const profile = await Profile.findOne(user!.profile.id);

    if (!profile)
      throw new Error(`could not find user profile by ${user!.profile.id}`);


    if (!reorderTodoLists)
      throw new Error(`could not find user profile by ${user!.profile.id}`);

    const toFindListId: any = [];

    reorderTodoLists.map(t => {
      toFindListId.push(t.id)
    });

    const toReorderTodoLists: any = [];

    await User.findOne(payload!.userId).then((res) => {
      res?.profile.todos.map((list) => {
        if (toFindListId.includes(list.id)) toReorderTodoLists.push(reorderTodoLists.find(i => i.id  === list.id));
      });

      if (toReorderTodoLists.length <= 0)
        throw new Error(`user haven't todoList with id: ${toReorderTodoLists}`);
      else
        console.log(`reorder items with id: ${toReorderTodoLists} from origin: ${reorderTodoLists}`);
    });

    toReorderTodoLists.map(async (item: any) => {
      try {
        await TodoList.update(item.id, { sortID: item.sort });
      } catch (error) {
        throw new Error(`can't delete todo list items Error: ${error}`);
      }
    })

    return true;
  }

  // Delete user todo list
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteUserTodoLists(
    @PubSub() pubSub: PubSubEngine,
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

      await pubSub.publish("SUB_TODO_LIST", {
        type: "delete",
        ids: id,
      });
    } catch (error) {
      throw new Error(`can't delete todoLists Error: ${error}`);
    }
    return true;
  }
}
