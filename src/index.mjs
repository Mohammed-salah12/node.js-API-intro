import express from "express";
import Joi from "joi";
import mockUsers from "./constance/utlities/mockUsers.mjs"; // Correct the path here
import router from "./routes/users.mjs"; // Ensure you have the correct path and file extension

const app = express();

app.use(express.json());
app.use(router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (request, response) => {
  response.status(200).send({ msg: "Hello, World!" });
});
