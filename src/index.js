const personagens = {
  mario: {
    NOME: "Mario",
    VELOCIDADE: 4,
    MANOBRABILIDADE: 3,
    PODER: 3,
    PONTOS: 0,
  },
  luigi: {
    NOME: "Luigi",
    VELOCIDADE: 3,
    MANOBRABILIDADE: 4,
    PODER: 4,
    PONTOS: 0,
  },
  peach: {
    NOME: "Peach",
    VELOCIDADE: 3,
    MANOBRABILIDADE: 4,
    PODER: 2,
    PONTOS: 0,
  },
  yoshi: {
    NOME: "Yoshi",
    VELOCIDADE: 2,
    MANOBRABILIDADE: 4,
    PODER: 3,
    PONTOS: 0,
  },
  bowser: {
    NOME: "Bowser",
    VELOCIDADE: 5,
    MANOBRABILIDADE: 2,
    PODER: 5,
    PONTOS: 0,
  },
  donkey: {
    NOME: "Donkey Kong",
    VELOCIDADE: 2,
    MANOBRABILIDADE: 2,
    PODER: 5,
    PONTOS: 0,
  },
};

const { log } = require("console");
const readline = require("readline");

function promptUser(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    })
  );
}

function esperarSegundos(segundos) {
  return new Promise((resolve) => setTimeout(resolve, segundos * 1000));
}

async function escolherPersonagem(
  numeroProibido = null,
  mensagemIntro = "Escolha um corredor: "
) {
  const lista = Object.values(personagens);
  console.log(`\n${mensagemIntro}`);
  await esperarSegundos(1.25);

  for (let i = 0; i < lista.length; i++) {
    await esperarSegundos(1);
    console.log(`[${i + 1}] ${lista[i].NOME}`);
  }

  let escolha;
  while (true) {
    await esperarSegundos(1.5);
    escolha = await promptUser("Digite o número do personagem: ");

    // Validações
    if (!escolha || escolha.trim() === "") {
      console.log("Valor nulo não é permitido. Tente novamente.");
      continue;
    }

    if (!/^\d+$/.test(escolha)) {
      console.log("Apenas números são aceitos. Tente novamente.");
      continue;
    }

    const index = parseInt(escolha) - 1;

    if (isNaN(index) || index < 0 || index >= lista.length) {
      console.log("Número inválido. Tente novamente.");
      continue;
    }

    if (index === numeroProibido) {
      console.log("Não é permitido escolher o mesmo personagem duas vezes.");
      continue;
    }

    return { personagem: { ...lista[index] }, index };
  }
}

async function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock() {
  let random = Math.random();
  let result;

  switch (true) {
    case random < 0.33:
      result = "RETA";
      break;

    case random < 0.66:
      result = "CURVA";
      break;

    default:
      result = "CONFRONTO";
  }

  return result;
}

async function logRollResult(characterName, block, diceResult, attribute) {
  console.log(
    `${characterName} 🎲 rolou um dado de ${block} ${diceResult} + ${attribute} = ${
      diceResult + attribute
    }`
  );
  await esperarSegundos(2);
}

async function playRaceEngine(character1, character2) {
  for (let round = 1; round <= 5; round++) {
    console.log(`🏁 Rodada ${round}`);
    await esperarSegundos(5); //espera antes da rodada

    //sortear bloco
    let block = await getRandomBlock();
    console.log(`Bloco: ${block}`);
    await esperarSegundos(1.5);

    //rolar os dados
    let diceResult1 = await rollDice();
    let diceResult2 = await rollDice();

    //teste de habilidade
    let totalTestSkill1 = 0;
    let totalTestSkill2 = 0;

    if (block === "RETA") {
      totalTestSkill1 = diceResult1 + character1.VELOCIDADE;
      totalTestSkill2 = diceResult2 + character2.VELOCIDADE;

      await logRollResult(
        character1.NOME,
        "velocidade",
        diceResult1,
        character1.VELOCIDADE
      );
      await esperarSegundos(1.5);

      await logRollResult(
        character2.NOME,
        "velocidade",
        diceResult2,
        character2.VELOCIDADE
      );
      await esperarSegundos(1.5);
    }
    if (block === "CURVA") {
      totalTestSkill1 = diceResult1 + character1.MANOBRABILIDADE;
      totalTestSkill2 = diceResult2 + character2.MANOBRABILIDADE;

      await logRollResult(
        character1.NOME,
        "manobrabilidade",
        diceResult1,
        character1.MANOBRABILIDADE
      );
      await esperarSegundos(1.5);

      await logRollResult(
        character2.NOME,
        "manobrabilidade",
        diceResult2,
        character2.MANOBRABILIDADE
      );
      await esperarSegundos(1.5);
    }
    if (block === "CONFRONTO") {
      let powerResult1 = diceResult1 + character1.PODER;
      let powerResult2 = diceResult2 + character2.PODER;

      console.log(`${character1.NOME} confrontou com ${character2.NOME}!🥊`);
      await esperarSegundos(1.5);

      await logRollResult(
        character1.NOME,
        "poder",
        diceResult1,
        character1.PODER
      );
      await esperarSegundos(1.5);

      await logRollResult(
        character2.NOME,
        "poder",
        diceResult2,
        character2.PODER
      );
      await esperarSegundos(1.5);

      if (powerResult1 > powerResult2) {
        if (character2.PONTOS > 0) {
          await esperarSegundos(2);
          console.log(
            `${character1.NOME} venceu o confronto! ${character2.NOME} perdeu 1 ponto 🐢`
          );
          character2.PONTOS--;
        } else {
          await esperarSegundos(2);
          console.log(
            `${character1.NOME} venceu o confronto, mas ${character2.NOME} não perdeu ponto porque está com 0 ponto 🛡️`
          );
        }
      }
      if (powerResult2 > powerResult1) {
        if (character1.PONTOS > 0) {
          await esperarSegundos(2);
          console.log(
            `${character2.NOME} venceu o confronto! ${character1.NOME} perdeu 1 ponto 🐢`
          );
          character1.PONTOS--;
        } else {
          await esperarSegundos(2);
          console.log(
            `${character2.NOME} venceu o confronto, mas ${character1.NOME} não perdeu ponto porque está com 0 ponto 🛡️`
          );
        }
      }
      await esperarSegundos(2);
      console.log(
        powerResult2 === powerResult1
          ? "Confronto empatado! Nenhum ponto foi perdido."
          : ""
      );
      await esperarSegundos(1.5);
    }

    //verificando o vencedor da rodada
    if (totalTestSkill1 > totalTestSkill2) {
      await esperarSegundos(2);
      console.log(`${character1.NOME} marcou 1 ponto!`);
      character1.PONTOS++;
    } else if (totalTestSkill2 > totalTestSkill1) {
      await esperarSegundos(2);
      console.log(`${character2.NOME} marcou 1 ponto!`);
      character2.PONTOS++;
    } else if (totalTestSkill1 === totalTestSkill2 && block !== "CONFRONTO") {
      await esperarSegundos(2);
      console.log("Empate! Nenhum ponto foi marcado.");
    }

    await esperarSegundos(1.5);
    console.log("-------------------------------------------------------");
  }
}

async function declareWinner(character1, character2) {
  await esperarSegundos(5);
  console.log(`E o vencedor é...`);
  await esperarSegundos(5);

  if (character1.PONTOS > character2.PONTOS) {
    console.log(
      `\n${character1.NOME} venceu a corrida! Parabéns, ${character1.NOME}!🏆`
    );
  } else if (character2.PONTOS > character1.PONTOS) {
    console.log(
      `\n${character2.NOME} venceu a corrida! Parabéns, ${character2.NOME}!🏆`
    );
  } else {
    console.log("A corrida terminou em empate!");
  }

  await esperarSegundos(2);
  console.log("\nResultado final:");
  await esperarSegundos(1);

  console.log(`${character1.NOME}: ${character1.PONTOS} ponto(s)`);
  await esperarSegundos(1);

  console.log(`${character2.NOME}: ${character2.PONTOS} ponto(s)`);
  await esperarSegundos(1);
}

async function desejaJogarNovamente() {
  while (true) {
    const resposta = await promptUser(
      "\nDeseja jogar novamente?\n[1] Sim\n[2] Não\nDigite sua escolha: "
    );

    if (resposta === "1") {
      return true;
    } else if (resposta === "2") {
      return false;
    } else {
      console.log("Entrada inválida. Digite 1 para Sim ou 2 para Não.");
    }
  }
}

// (async function main() {
//   await esperarSegundos(2);
//   console.log("\nBem-vindo à corrida Mario Kart!🏎️  🏁 🏆");
//   await esperarSegundos(2);
//   console.log("Como vocês já leram sobre as regras do jogo");
//   await esperarSegundos(2.5);
//   console.log("e as habilidades dos personagens");
//   await esperarSegundos(2.5);
//   console.log("vamos comecar a corrida!");

//   //tempo antes da escolha do primeiro personagem
//   await esperarSegundos(2);
//   const { personagem: player1, index: index1 } = await escolherPersonagem(
//     null,
//     "Escolha o primeiro corredor:"
//   );

//   //tempo antes da escolha do segundo personagem
//   await esperarSegundos(2);
//   const { personagem: player2 } = await escolherPersonagem(
//     index1,
//     "Escolha o segundo corredor:"
//   );

//   await esperarSegundos(3);
//   console.log(`\nPreparando a corrida...`);
//   await esperarSegundos(5);

//   console.log(
//     `\n🏁🚨 Corrida entre ${player1.NOME} e ${player2.NOME} começando...`
//   );
//   await esperarSegundos(2);
//   console.log(`\nEu sou...`);
//   await esperarSegundos(2);
//   console.log(`a velocidade!\n`);
//   await esperarSegundos(1.5);

//   console.log("3");
//   await esperarSegundos(1);
//   console.log("2");
//   await esperarSegundos(1);
//   console.log("1");
//   await esperarSegundos(1);
//   console.log("CORRAM!🏁");
//   await esperarSegundos(1);
//   console.log("-------------------------------------------------------");

//   await playRaceEngine(player1, player2);
//   await declareWinner(player1, player2);
// })();

(async function main() {
  let continuar = true;

  while (continuar) {
    await esperarSegundos(2);
    console.log("\nBem-vindo à corrida Mario Kart!🏎️  🏁 🏆");
    await esperarSegundos(2);
    console.log("Como vocês já leram sobre as regras do jogo");
    await esperarSegundos(2.5);
    console.log("e as habilidades dos personagens");
    await esperarSegundos(2.5);
    console.log("vamos comecar a corrida!");

    await esperarSegundos(2);
    const { personagem: player1, index: index1 } = await escolherPersonagem(
      null,
      "Escolha o primeiro corredor:"
    );

    await esperarSegundos(2);
    const { personagem: player2 } = await escolherPersonagem(
      index1,
      "Escolha o segundo corredor:"
    );

    await esperarSegundos(3);
    console.log(`\nPreparando a corrida...`);
    await esperarSegundos(5);

    console.log(
      `\n🏁🚨 Corrida entre ${player1.NOME} e ${player2.NOME} começando...`
    );
    await esperarSegundos(2);
    console.log(`\nEu sou...`);
    await esperarSegundos(2);
    console.log(`a velocidade!\n`);
    await esperarSegundos(1.5);

    console.log("3");
    await esperarSegundos(1);
    console.log("2");
    await esperarSegundos(1);
    console.log("1");
    await esperarSegundos(1);
    console.log("CORRAM!🏁");
    await esperarSegundos(1);
    console.log("-------------------------------------------------------");

    await playRaceEngine(player1, player2);
    await declareWinner(player1, player2);

    continuar = await desejaJogarNovamente();
  }

  console.log("\nObrigado por jogar Mario Kart! Até a próxima! 👋 🏁");
})();
