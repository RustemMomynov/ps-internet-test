import bcrypt from "bcryptjs";

const hashedPassword = bcrypt.hashSync("Qwerty123", 10);

export const fakeUser = {
  username: "admin",
  password: hashedPassword,
};
