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

        console.log('---- Gerando tabela de pontos -----');
        for (let tabela = 1; tabela < 51; tabela++) {
            await redis.set("tabela:" + tabela, 0);
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
        let vencedor = false;

        while (!vencedor) {

            console.log("---- GIRANDO A ROLETA---");
            const numero = await redis.srandmember("roleta", 1);
            console.log("Saiu o numero " + numero + " !");

            //checka se usuario possui numero
            for (let usuario = 1; usuario < 51; usuario++) {

                const possuiNumero = await redis.sismember("cartela:" + usuario, numero);
                if (possuiNumero) {
                    console.log("cartela:" + usuario, " acertou!");

                    //soma pontuacao
                    let pontuacaoAtual = await redis.get("tabela:" + usuario);
                    pontuacaoAtual++;
                    await redis.set("tabela:" + usuario, pontuacaoAtual);

                    if (pontuacaoAtual === 15) {
                        console.log("USUARIO " + usuario + " É O VENCEDOR!");
                        vencedor = true;
                        break;
                    }

                    console.log("usuario:" + usuario + " possui " + pontuacaoAtual + " pontos!");
                }
            }
        }

        redis.disconnect();

    } catch (error) {
        console.error(error);
    }

}

main();