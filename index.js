const Redis = require("ioredis");
const redis = new Redis();

async function main() {

    try {

        //limpa banco
        redis.flushall();

        //cria set de numeros de 1 99 para sorteio
        console.log('---- Gerando roleta -----');
        for (let numero = 1; numero < 100; numero++) {
            await redis.sadd("roleta", numero);
        }

        const roleta = await redis.smembers("roleta");
        console.log(roleta);

        //criar usuarios
        console.log('---- Gerando usuarios -----');
        for (let usuario = 1; usuario < 51; usuario++) {

            await redis.hset("user" + usuario, "bcartela", "cartela:" + usuario, "bscore", "score:" + usuario);
            const usuarios = await redis.hgetall("user" + usuario);
            console.log("user" + usuario, usuarios);
        }

        //monta cartelas
        for (let cartela = 1; cartela < 51; cartela++) {

            for (let numeroSorteado = 1; numeroSorteado < 16; numeroSorteado++) {
                const result = await redis.srandmember("roleta", 1);
                await redis.sadd("cartela:" + cartela, result[0]);
            }

            const cartelas = await redis.smembers("cartela:" + cartela);
            console.log("cartela" + cartela, cartelas);
        }

        //começa sorteio
        

        redis.disconnect();

    } catch (error) {
        console.error(error);
    }

}

main();