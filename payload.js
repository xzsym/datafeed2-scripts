const { readJsonFileAsync } = require("./util");

let lastUpdate = new Date().getTime() - 3600 * 1000; // last hour
// duplicate the message 50 times
readJsonFileAsync("./message.json", (err, messages) => {
  const payload = {
    lastAccessTime: 0,
    ackId: "string",
    eventsDropped: true,
    events: []
  };
  const newMessages = [];
  for (let i = 0, max = 1; i < max; i++) {
    newMessages.push(
      ...messages
        .map(({ message }) => ({
          feedId: "string",
          eventId: "string",
          name: message.version,
          payload: {
            ...message,
            messageId: `${message.messageId}-${i}`,
            ingestionDate: lastUpdate + Math.random() * 1000
          }
        }))
        .sort((a, b) => a.ingestionDate - b.ingestionDate)
    );
    lastUpdate += 1000; // next mintue
  }
  payload.events = newMessages;
  console.log(JSON.stringify(newMessages));
  resolve(payload);
});
