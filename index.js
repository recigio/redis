const redis = require("redis");
const client = redis.createClient();

client.on("error", function(error) {
    console.error("Erro ao conectar",error);
});


//criar usuarios
//name: “user01”, bcartela: “cartela:01”, bscore: “score:01”

//criar cartelas

//criar scores por usuario

client.set("key", "recigio", redis.print);
client.get("key", redis.print);