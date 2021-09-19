const verifyDeclaration = (symbolTable) => {
  let flag = true;
  for (let i = 0; i < symbolTable.length; i++){
    if (symbolTable[i].status == "usage") {
      for (let j = 0; j < i; j++){
        if(symbolTable[j].symbol == symbolTable[i].symbol){
          if (symbolTable[j].status == "declaration" && symbolTable[i].escopo < symbolTable[j].escopo) {
            console.log("Variável " + symbolTable[i].symbol + " nao declarada dentro do escopo.");
          } else if (symbolTable[j].status == "declaration" && symbolTable[i].escopo >= symbolTable[j].escopo) {
            flag = false;
          }
        }
      }
      if (flag) {
        console.log("Variável "+ symbolTable[i].symbol + " nao declarada.")
      } else {
        flag = true;
      }
    }
  }
}

const verifyAssignmentDataType = () => {
  
}
module.exports = { verifyDeclaration };