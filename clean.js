const fetch = require("node-fetch");
const https = require("https");

const jwt = process.env.JWT;
const host = process.env.HOST;
const args = process.argv;
let doNotDelete = true;

args.slice(2).some((param) => {
  if(param === '-d') {
    doNotDelete = false;
    return true;
  }
});

if (!jwt) {
  console.log("Missing JWT token");
} else if (!host) {
  console.log("Missing host");
}

const agent = new https.Agent({
  rejectUnauthorized: false
});
const headers = {
  "Cache-Control": "no-cache",
  "content-type": "application/json",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36",
  "sym-jwt-internal": jwt,
  "Origin": "https://ui.ac8-dev.symphony.com:9090"
};

fetch(`https://${host}/datafeed/v2/feeds`, {
  headers,
  agent
})
  .then(result => result.json())
  .then(feeds => {
    console.log('-----', doNotDelete);
    console.log(feeds);
    console.log('-----');
    if (doNotDelete) {
      return;
    }
    return Promise.all(
      feeds.map(({ feedId }) => {
        console.log("FeedId:", feedId);
        return fetch(`https://${host}/datafeed/v2/feeds/${feedId}`, {
          method: "DELETE",
          headers,
          agent
        });
      })
    )
  }

  )
  .then(() => {
    console.log("Done with delting");
  });
