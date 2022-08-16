const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 3000;

let clients = [];
let facts = [];

const handleEventRequest = (request, response, next) => {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  response.writeHead(200, headers);
  const data = `data: ${JSON.stringify(
    facts.map((x) => `${JSON.stringify(x)}\n\n`)
  )}\n\n`;
  response.write(data);

  const clientId = Date.now();
  clients.push({ id: clientId, response });
  request.on("close", () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter((client) => client.id !== clientId);
  });
};
function sendEventsToAll(newFact) {
  clients.forEach((client) =>
    client.response.write(`data: ${JSON.stringify(newFact)}\n\n`)
  );
}

app.post("/fact", (request, respsonse, next) => {
  const newFact = request.body;
  facts.push(newFact);
  respsonse.json(newFact);
  return sendEventsToAll(newFact);
});

app.get("/events", handleEventRequest);
app.get("/status", (request, response) =>
  response.json({ clients: clients.length })
);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
