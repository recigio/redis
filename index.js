const Redis = require("ioredis");
const redis = new Redis();

async function main() {

    try {

        //cria set de numeros de 1 99 para sorteio
        for (let numero = 1; numero < 100; numero++) {
            await redis.sadd("roleta", numero);
        }

        //criar usuarios
        for (let usuario = 1; usuario < 51; usuario++) {

            await redis.hset("user" + usuario, "bcartela", "cartela:" + usuario, "bscore", "score:" + usuario);
            await redis.hgetall("user" + usuario, function (err, value) {
                console.log(value);
            });
        }

        //name: “user01”, bcartela: “cartela:01”, bscore: “score:01”

        //criar cartelas

        //criar scores por usuario

        const membros = await redis.smembers("roleta");

        console.log(membros);

        const result = await redis.srandmember("roleta", 1);

        console.log(result);

        redis.disconnect();

    } catch (error) {
        console.error(error);
    }

}

main();