import { Resolver } from "type-graphql";

// import { isAuth } from "./../../middleware/isAuth";
// import { TodoItem } from "../entity";

@Resolver()
export class TodoResolver {
  //   @Query(() => [TodoItem])
  //   todos() {
  //     return TodoItem.find();
  //   }
  //   @Mutation(() => TodoItem)
  //   @UseMiddleware(isAuth)
  //   async addTodo(
  //     // @Ctx() { payload }: MyContext,
  //     @Arg("text") text: string,
  //     @Arg("complete") complete: boolean
  //   ) {
  //     let todoID: any;
  //     let todo: any;
  //     try {
  //       await TodoItem.insert({
  //         text: text,
  //         complete: complete,
  //         // authorId: payload?.userId,
  //       }).then((res) => (todoID = res.raw[0].id));
  //     } catch (err) {
  //       console.log(err);
  //       return false;
  //     }
  //     todo = await TodoItem.findOne({ where: { id: todoID } });
  //     return todo;
  //   }
}
// @Service()
// export class PostService {
//   getPosts({ filter, limit, skip = 0 }: TodosArgs): Promise<Todo[]> {
//     const criteria: any = {};
//     if (filter) {
//       if (filter.createdAtMin) {
//         criteria.createdAt = { $gt: filter.createdAtMin };
//       }
//       if (filter.completed) {
//         criteria.complete = { $gt: filter.completed };
//       }
//       if (filter.authorId) {
//         criteria.authorId = filter.authorId;
//       }
//     }
//     return Todo.find(criteria);
// .limit(limit).skip(skip);
//   }
// }
