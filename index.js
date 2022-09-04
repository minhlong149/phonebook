require("dotenv").config();

const express = require("express");
const app = express();

const Person = require("./models/person");

app.use(express.static("build"));

// Logging messages using morgan middleware
const morgan = require("morgan");
app.use(
  morgan("tiny", {
    skip: function (req, res) {
      return req.method === "POST";
    },
  })
);

// Creating new tokens for logging data in HTTP POST requests
morgan.token("data", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :data",
    {
      skip: function (req, res) {
        return req.method !== "POST";
      },
    }
  )
);

// Allow requests from other origins
const cors = require("cors");
app.use(cors());

// Returns phone book list entries
app.get("/api/persons", async (request, response) => {
  const phoneBookList = await Person.find({});
  response.json(phoneBookList);
});

// Implement info page
app.get("/info", async (request, response) => {
  const entriesNum = await Person.find({}).count();
  const infoPage = `
    <p>Phone book has info for ${entriesNum} people</p>
    <p>${Date()}</p>
  `;
  response.send(infoPage);
});

// Display a single phone book entry info
app.get("/api/persons/:id", async (request, response) => {
  const id = request.params.id;
  const person = await Person.findById(id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

// Delete a phonebook entry from a HTTP DELETE request
app.delete("/api/persons/:id", async (request, response) => {
  const id = request.params.id;
  await Person.findByIdAndRemove(id);
  response.status(204).end();
});

// Add new phonebook entries
app.use(express.json());

app.post("/api/persons", async (request, response) => {
  const body = request.body;

  // error handling
  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  // At this stage,  users can create all phonebook entries.
  // Phone book can have multiple entries with the same name.

  const name = body.name;
  const number = body.number;

  const person = new Person({
    name: name,
    phoneNumber: number,
  });

  const newEntry = await person.save();
  console.log(`added ${name} number ${number} to phonebook`);
  response.json(newEntry);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
