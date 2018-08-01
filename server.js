const { readJsonFileAsync } = require("./util");

const express = require("express");
const app = express();

let payload = {};
let messages = [];

let lastUpdate = new Date().getTime() - 3600 * 1000; // last hour
let uniqeId = 0;

readJsonFileAsync("./message.json", (err, msgs) => {
  messages = msgs;
});

app.options("/*", (req, res) => {
  console.log("=====>");
  res.set({
    "Access-Control-Allow-Origin": req.get("origin"),
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Headers": [
      "Content-Type",
      "Authorization",
      "Content-Length",
      "X-Requested-With",
      "sym-jwt-internal"
    ].join(","),
    "Access-Control-Allow-Methods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "OPTIONS"
    ].join(",")
  });
  res.sendStatus(200);
});

// respond with "hello world" when a GET request is made to the homepage
app.get("/datafeed/v2/feeds/:id/events", function(req, res) {
  console.log("Get Id", req.params.id);
  res.set({
    "Access-Control-Allow-Origin": req.get("origin"),
    "Access-Control-Allow-Credentials": true
  });

  const payload = {
    lastAccessTime: 0,
    ackId: "string",
    eventsDropped: true,
    events: []
  };
  const newMessages = [];
  for (let i = 0, max = 3; i < max; i++) {
    newMessages.push(
      ...messages
        .map(({ message }) => ({
          feedId: "string",
          eventId: "string",
          name: message.version,
          payload: {
            ...message,
            messageId: `${message.messageId}-${uniqeId++}`,
            ingestionDate: lastUpdate + Math.random() * 1000
          }
        }))
        .sort((a, b) => a.ingestionDate - b.ingestionDate)
    );
    lastUpdate += 1000; // next mintue
  }
  payload.events = newMessages;
  res.send(payload);
  console.log("Done");
});

app.listen(3003);
