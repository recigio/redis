const redis = require("redis");
const client = redis.createClient();

client.on("error", function(error) {
    console.error(error);
});

client.set("key", "recigio", redis.print);
client.get("key", redis.print);