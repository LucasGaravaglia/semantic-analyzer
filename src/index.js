const { readFile, process } = require("./file");
const readline = require("readline-sync");
const {
  startBlockFunctionClass,
  FinalBlockFunctionClass,
  startFunctionMarkerClass,
  finalFunctionMarkerClass,
  identifierClass,
  numberClass,
  loopClass,
  functionReturnClass,
  functionConditionalClass,
  integerTypeClass,
  assignmentClass,
  expressionsClass,
  operatorClass,
  endLineClass,
  separatorClass,
  typeDefClass
} = require("./tokenClass");
const {parser} = require("./parser")


var symbolTable = [];

/**
 * Objeto que simula o funcionamento de um automato.
 * @param {states[]} states Vetor de estados ja instanciados.
 */
const automaton = (states) => {
  const indexOf = (name) => {
    for (var i = 0; i < states.length; i++) {
      if (states[i].getName() == name) return i;
    }
  };
  const execute = (word) => {
    var currentState = "q0";
    var currentWordPosition = 0;
    for (var i = 0; i < word.length; i++, currentWordPosition++) {
      currentState = states[indexOf(currentState)].getNextState(
        word[currentWordPosition]
      );
      if (currentState == false) {
        return false;
      }
      if (currentState == "Identificador mal formado")
        this.error = currentState;
      else if (currentState == "Numero mal formado") this.error = currentState;
      else this.error = "Nao pertence a nenhuma classe de token";
    }
    return states[indexOf(currentState)].isFinal;
  };
  const getError = () => {
    return this.error;
  };
  return {
    execute,
    getError,
  };
};

/**
 * Lista das classes de tokens
 */
const tokens = [
  startBlockFunctionClass(),
  FinalBlockFunctionClass(),
  separatorClass(),
  startFunctionMarkerClass(),
  finalFunctionMarkerClass(),
  loopClass(),
  typeDefClass(),
  functionReturnClass(),
  functionConditionalClass(),
  integerTypeClass(),
  assignmentClass(),
  expressionsClass(),
  operatorClass(),
  endLineClass(),
  numberClass(),
  identifierClass(),
];

function scanner(path) {
  try {
    const dataFile = readFile(path); //Le o arquivo e recebe um vetor de string, cada posição do vetor sendo uma linha do arquivo
    let data;
    let lexicalError = "";
    for (let line = 0; line < dataFile.length; line++) {
      console.log(line + 1, " ", dataFile[line]);
      data = process(dataFile[line]); //Separa a string em um vetor de tokens
      let valid = false;
      //Roda o vetor de tokens
      for (let j = 0; j < data.length; j++) {
        //Roda a lista de autômatos
        for (let i = 0; i < tokens.length; i++) {
          if (automaton(tokens[i].states).execute(data[j])) {
            valid = true;
            symbolTable.push({symbol: data[j],token:tokens[i].name});
            break;
          }
        }
        if (!valid) {
          lexicalError += `Erro na linha [${line + 1}], '${
            data[j]
          }' ${automaton().getError()}\n`; //Identifica o erro, se houve, do processamento do token
          symbolTable.push({symbol: data[j],token:"error"});
        }
        valid = false;
      }
    }
    console.log(lexicalError);
    console.log("Concluído !");
  } catch (err) {
    console.log("Erro ao abrir o arquivo.");
    console.log(err);
  }
}

const pars = new parser();
const path = readline.question("Digite o caminho do arquivo: ");
console.clear();
scanner(path);
let tokenList = [];
symbolTable.map((pos) => {
  tokenList.push(pos.token);
})
tokenList.push("$");
pars.process(tokenList,path);
readline.question();
