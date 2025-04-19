import type { NextApiRequest, NextApiResponse } from "next";
const cookie = require("cookie");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    })
  );

  res.status(200).json({ message: "Logged out" });
}
