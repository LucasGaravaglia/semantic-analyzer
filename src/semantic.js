
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
            console.log(`Identificador '${symbolTable[i].symbol}' sendo usada na linha [${symbolTable[i].line}] sem ser declarada no escopo.`);
          } else if (symbolTable[j].status == "declaration" && symbolTable[i].escopo >= symbolTable[j].escopo) {
            symbolTable[i].dataType = symbolTable[j].dataType;
            flag = false;
          }
        }
      }
      if (flag) {
        console.log(`Identificador '${symbolTable[i].symbol}' sendo usada na linha [${symbolTable[i].line}] sem ser declarada.`);
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
/**
 * Função que verifica se as as funções estão sendo passadas com os parâmetros corretamente.
 * @param {Object} symbolTable Tabela de símbolos.
 */
const verifyParametersFunction = (symbolTable) => {
  let flagErro = false;
  let parameters = [];
  for (let i = 0; i < symbolTable.length; i++){
    if (symbolTable[i].token == "tokenIdentifier" && symbolTable[i+1].token == "tokenStartFunction" && symbolTable[i-1].token != "tokenDataType") {
      for (let j = i+1; j < symbolTable.length; j++){
        if (symbolTable[j].token == "tokenFinalFunction") break;
        if (symbolTable[j].token != "tokenSeparator" && symbolTable[j].token == "tokenIdentifier") {
          parameters.push(symbolTable[j].dataType);
        }
      }

      for (let j = 0; j < i; j++){
        if (symbolTable[j].symbol == symbolTable[i].symbol && symbolTable[j + 1].token == "tokenStartFunction") {
          for (let k = j; k < i; k++){
            if (symbolTable[k].token == "tokenFinalFunction") break;
            if (symbolTable[k].token == "tokenDataType" && parameters.length > 0 && symbolTable[k].dataType == parameters[0]) {
              parameters.shift();
            } else if (symbolTable[k].token == "tokenDataType" && (symbolTable[k].dataType != parameters[0] || parameters.length <= 0)) {
              flagErro = true;
              console.log(`Erro na linha ${symbolTable[i].line}, header nao condiz com o que esta sendo passado.`);
              break;
            }
          }
        }
      }
      if (parameters.length > 0) {
        flagErro = true;
        console.log(`Erro na linha ${symbolTable[i].line}, header nao condiz com o que esta sendo passado.`);
      }
    }
  }
  return flagErro;
}

module.exports = { verifyDeclaration, verifyTypeAssignment, verifyParametersFunction};