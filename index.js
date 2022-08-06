const express = require("express");
const app = express();

// Logging messages using morgan middleware
const morgan = require("morgan");
app.use(morgan("tiny"));

let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// Returns phone book list entries
app.get("/api/persons", (request, response) => {
  response.json(phonebook);
});

// Implement info page
app.get("/info", (request, response) => {
  const entriesNum = phonebook.length;
  const entriesString = `
    <p>Phone book has info for ${entriesNum} people</p>
    <p>${Date()}</p>
  `;
  response.send(entriesString);
});

// Display a single phone book entry info
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const phonebookInfo = phonebook.find((entry) => entry.id === id);
  if (phonebookInfo) {
    response.json(phonebookInfo);
  } else {
    response.status(404).end();
  }
});

// Delete a phonebook entry from a HTTP DELETE request
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  phonebook = phonebook.filter((entry) => entry.id !== id);
  response.status(204).end();
});

// Add new phonebook entries
app.use(express.json());

app.post("/api/persons", (request, response) => {
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

  const nameExist = phonebook.some((entry) => entry.name === body.name); ;
  if (nameExist) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const maxId = Math.floor(Math.random() * 1000);
  const newEntry = {
    id: maxId,
    name: body.name,
    number: body.number,
  };

  phonebook = phonebook.concat(newEntry);
  response.json(newEntry);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
