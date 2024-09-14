import { faker } from "@faker-js/faker";
import { User } from "../models/userModel.js";

const createUser = async (numUser) => {
  try {
    const userPromise = [];
    for (let i = 0; i < numUser; i++) {
      userPromise.push(
        User.create({
          name: faker.person.fullName(),
          username: faker.internet.userName(),
          bio: faker.lorem.sentence(10),
          password: "password",
          avatar: {
            public_id: faker.system.fileName(),
            url: faker.image.avatar(),
          },
        })
      );
    }
    await Promise.all(userPromise);
    console.log("users created", numUser);
  } catch (error) {
    console.log("error in user creation", error);
    process.exit(1);
  }
};
export { createUser };
