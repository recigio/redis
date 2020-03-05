const redis = require("redis");
const client = redis.createClient();

client.on("error", function(error) {
    console.error("Erro ao conectar",error);
});

//cria set de numeros de 1 99 para sorteio
for (let numero=1; numero <100; numero++){
    client.sadd("roleta", numero);
}

//criar usuarios
//name: “user01”, bcartela: “cartela:01”, bscore: “score:01”

//criar cartelas

//criar scores por usuario

client.smembers("roleta", redis.print);