function readJsonFileAsync(filepath, callback) {
  var fs = require("fs");
  fs.readFile(filepath, "utf-8", function(err, data) {
    if (err) {
      callback(err, null);
    } else {
      result = JSON.parse(data);
      if (result) {
        callback(null, result);
      } else {
        callback("parse error", null);
      }
    }
  });
}

// generate multiple messages for different rooms
readJsonFileAsync("./message.json", (err, message) => {
  const payload = {
    lastAccessTime: 0,
    ackId: "string",
    eventsDropped: true,
    events: []
  };
  const messages = [];
  for (let i = 0, max = 2; i < max; i++) {
    messages.push({
      feedId: "string",
      eventId: "string",
      payload: {
        ...message,
        messageId: `${message.messageId}-${i}`
      }
    });
  }
  payload.events = messages;
  console.log(JSON.stringify(messages));
});
