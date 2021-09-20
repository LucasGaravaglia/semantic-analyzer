
/**
 * Função que verifica se todas as variáveis usadas no programa foram declaradas,
 * se foi o tipo da mesma é atribuído na tabela.
 * @param {Object} symbolTable Tabela de símbolos.
 */
const verifyDeclaration = (symbolTable) => {
  let flag = true;
  let flagErro = false;
  for (let i = 0; i < symbolTable.length; i++){
    if (symbolTable[i].status == "usage") {
      for (let j = 0; j < i; j++){
        if(symbolTable[j].symbol == symbolTable[i].symbol){
          if (symbolTable[j].status == "declaration" && symbolTable[i].escopo < symbolTable[j].escopo) {
            console.log("Variável " + symbolTable[i].symbol + " nao declarada dentro do escopo.");
          } else if (symbolTable[j].status == "declaration" && symbolTable[i].escopo >= symbolTable[j].escopo) {
            symbolTable[i].dataType = symbolTable[j].dataType;
            flag = false;
          }
        }
      }
      if (flag) {
        console.log(`Variável '${symbolTable[i].symbol}' sendo usada na linha [${symbolTable[i].line}] sem ser declarada.`);
        flagErro = true;
      } else {
        flag = true;
      }
    }
  }
  return flagErro;
}

/**
 * Função que verifica se as atribuições estão com as tipagens corretas.
 * @param {Object} symbolTable Tabela de símbolos.
 */
const verifyTypeAssignment = (symbolTable) => {
  let posAss;
  let flagErro = false;
  for (let i = 0; i < symbolTable.length; i++){
    if (symbolTable[i].token == "tokenAssignments") {
      posAss = symbolTable[i - 1].dataType;
      for (let j = i+1; j < symbolTable.length; j++){
        if (symbolTable[j].token == "tokenEndLine") break;
        if (symbolTable[j].token != "tokenOperator" && symbolTable[j].dataType != posAss) {
          console.log(`Atribuição na linha [${symbolTable[i].line}] errada, tipo esperado ${posAss}, tipo recebido ${symbolTable[j].dataType}.`);
          flagErro = true;
        }
      }
    }
  }
  return flagErro;
}

module.exports = { verifyDeclaration, verifyTypeAssignment };