import express from "express";
import mockUsers from "../constance/utlities/mockUsers.mjs"; // Correct path
import Joi from "joi";

const router = express.Router();

const resolveUserById = (request, response, next) => {
  const { params } = request;
  const parsedId = parseInt(params.id);
  if (isNaN(parsedId)) return response.status(400).send({ msg: "Invalid ID" });
  const findIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findIndex === -1)
    return response.status(404).send({ msg: "User not found" });
  request.findIndex = findIndex;
  next();
};
const schema = Joi.object({
  name: Joi.string().required(),
  displayName: Joi.string().required(),
});

router.patch("/users/:id", resolveUserById, (request, response) => {
  const { body, findIndex } = request;
  mockUsers[findIndex] = { ...mockUsers[findIndex], ...body };
  return response
    .status(200)
    .send({ msg: "User updated", data: mockUsers[findIndex] });
});
router.get("/users", (request, response) => {
  console.log(request.query); // for query parameters
  const {
    query: { filter, value },
  } = request;

  if (filter && value) {
    return response
      .status(200)
      .send(mockUsers.filter((user) => user[filter].includes(value)));
  }

  response.status(200).send(mockUsers);
});
router.post("/users", (request, response) => {
  const { error, value } = schema.validate(request.body);
  if (error) {
    return response.status(400).send({ error: error.details[0].message });
  }

  console.log(request.body); // for body
  const { body } = request;
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
  mockUsers.push(newUser);
  response.status(201).send({ msg: "User created", data: newUser });
});
router.get("/users/:id", resolveUserById, (request, response) => {
  const { findIndex } = request;
  return response.status(200).send({ data: mockUsers[findIndex] });
});
router.put("/users/:id", resolveUserById, (request, response) => {
  const { body, findIndex } = request;
  mockUsers[findIndex] = { id: findIndex, ...body };
  return response
    .status(200)
    .send({ msg: "User updated", data: mockUsers[findIndex] });
});
router.delete("/users/:id", resolveUserById, (request, response) => {
  const { findIndex } = request;
  mockUsers.splice(findIndex, 1);
  return response.status(200).send({ msg: "User deleted" });
});

export default router;
