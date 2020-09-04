import { Service, Inject } from "typedi";
// import { Injectable } from "@graphql-modules/di";
// ? https://github.com/MichalLytek/type-graphql/blob/master/examples/graphql-modules/user/user.service.ts

import { User } from "./user.entity";
import { GetUsersInput, FindUserInput } from './user.inputs';
// import { Request } from "express";

@Service()
@Inject("User_Service")
export class UserService {
   constructor(
      // @Injectable({ scope: Scope.REQUEST }) private readonly req: Request,
      // private req: Request,
      // private res: Response
   ){ }

   public getAll(data: GetUsersInput) {

      // console.log('reqres', this.req);

      return User.find({ skip: data.startIndex, take: data.endIndex });
   }

   public async getById(id: string) {
      return await User.findOne(id);
   }

   public getByEmail(email: string) {
      return User.findOne({ email });
   }

   public async findBy(data: FindUserInput) {
      if(!data) throw new Error(`please provide user email or id`);

      const user = await User.find(data);
      if (!user || user.length === 0) throw new Error(`user not found: ${data}`);

      return user;
   }
}