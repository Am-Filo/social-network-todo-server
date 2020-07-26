import express from "express";
import { verify } from "jsonwebtoken";

import { sendRefreshToken } from "../utils/sendRefreshToken";
import { createRefreshToken, createAccessToken } from "../utils/auth";

// entity
import { User } from "../app/entity/User";

const appRouter = express.Router();

appRouter.get("/", (_req, res) => res.send("hello"));
appRouter.post("/refresh_token", async (req, res) => {
  const token = req.cookies.jid;

  if (!token) {
    return res.send({
      ok: false,
      accessToken: "",
    });
  }

  let payload: any = null;
  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
  } catch (err) {
    console.log(err);
    return res.send({
      ok: false,
      accessToken: "",
    });
  }

  const user = await User.findOne({ id: payload.userId });

  if (!user) {
    return res.send({
      ok: false,
      accessToken: "",
    });
  }

  if (user.tokenVersion !== payload.tokenVersion) {
    return res.send({
      ok: false,
      accessToken: "",
    });
  }
  sendRefreshToken(res, createRefreshToken(user));

  return res.send({
    ok: true,
    accessToken: createAccessToken(user),
  });
});

export default appRouter;
