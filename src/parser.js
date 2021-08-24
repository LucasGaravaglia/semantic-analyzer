const { writeFile } = require("./file");

/**
 * Classe que simula o analisador sintático.
 */
class parser{
  /**
   * Construtor da classe parser
   * @param {Object} syntacticTable Tabela sintática
   * @param {Array} pilha pilha para a analise.
   */
  constructor() {
    this.syntacticTable = {
    "<STA>": [
      ["tokenConditional", "tokenStartFunction", "<EXP>", "tokenFinalFunction", "<STA>"],
      ["tokenStartBlockFunction", "<STA>", "tokenFinalBlockFunction","<STA>"],
      ["tokenWhile", "tokenStartFunction", "<EXP>", "tokenFinalFunction", "<STA>"],
      ["tokenReturn","<EXP>", "tokenEndLine","<STA>"],
      ["tokenIdentifier", "<K>", "tokenEndLine","<STA>"],
      ["tokenDataType","tokenIdentifier", "<L>","<STA>"],
      ["tokenUnsigned", "tokenDataType","tokenIdentifier", "<L>","<STA>"],
      ["tokenTypeDef", "tokenDataType", "tokenIdentifier", "tokenEndLine", "<STA>"],
      ["$"],
      
    ],
    "<T>": [
      ["tokenAssignments", "<EXP>"],
      ["tokenSeparator", "tokenIdentifier", "<T>"],
      ],
    "<L>": [
        ["tokenStartFunction", "<P>", "tokenFinalFunction"],
        ["<T>","tokenEndLine"],
      ],
    "<EXP>": [
      ["tokenIdentifier", "<S>"],
      ["tokenStartFunction", "<EXP>", "tokenFinalFunction"],
      ["tokenNumber","<S>"],
    ],
    "<K>": [
      ["tokenAssignments", "<EXP>"],
      ["tokenStartFunction","tokenIdentifier","<B>","tokenFinalFunction"],
    ],
    "<B>": [
      ["tokenSeparator", "tokenIdentifier", "<B>"],
      ["$"],
    ],
    "<S>": [
      ["tokenOperator", "<EXP>"],
      ["tokenExpression", "<EXP>"],
      ["$"],
    ],
    "<F>": [
      ["tokenDataType","tokenIdentifier", "tokenStartFunction","<P>","tokenFinalFunction","<STA>"],
      ["tokenUnsigned","tokenIdentifier","tokenDataType", "tokenStartFunction","<P>","tokenFinalFunction","<STA>"],
      ["$"],
    ],
    "<P>": [
      ["tokenDataType", "tokenIdentifier","<Z>"],
      ["$"],
    ],
    "<P>": [
      ["tokenSeparator", "tokenIdentifier","<Z>"],
      ["$"],
    ],
    "<TD>": [
      ["tokenTypeDef", "tokenDataType","tokenIdentifier","tokenEndLine"],
    ]
    }
    this.pilha = [];
  }
  /**
   * Recebe um vetor de token e os empilha para derivações futuras.
   * @param {Array} vet Vetor de token para a derivação da cadeia.
   */
  stackUp(vet) {
    for (let i = vet.length-1; i >= 0; i--){
      this.pilha.push(vet[i]);
    }
  }

  /**
   * Método responsável pela logica do analisador sintático.
   * @param {Array} tokenList Vetor de token que sera analisado pelo analisador sintático.
   */
  process(tokenList,path) {
    let message = "";
    this.pilha.push("<STA>");
    let state;
    let temp = [];
    let file = "";
    let erro=0;
    while (tokenList[0] != undefined || this.pilha[0] != undefined) {
      temp = [];
      tokenList.map((item) => {
        temp.unshift(item)
      })
      // tempFileOutPut ={ Lista: temp, pilha: this.pilha };
      file = `${file} Lista de símbolos :`
      temp.map((item) => {
        file = `${file} ${item}`
      })
      file = `${file} \n`
      file = `${file} Pilha             :`
      this.pilha.map((item) => {
        file = `${file} ${item}`
      })
      file = `${file} \n\n`
      state = this.pilha[this.pilha.length - 1];
      this.pilha.pop();
      if ((/<[a-z]*>/i).test(state)) {
        for (let i = 0; i < this.syntacticTable[state].length; i++) {
          if (this.syntacticTable[state][i][0] == tokenList[0]) {
            this.stackUp(this.syntacticTable[state][i])
            break;
          } else if ((/<[a-z]*>/i).test(this.syntacticTable[state][i][0])) {
            this.stackUp(this.syntacticTable[state][i])
            break;
          }
        }
      } else {
        if (state != tokenList[0]) {
          message = "Erros na analise sintática";
          break;
        }else{
          tokenList.shift();
        }
      }
    }

    if (message) {
      console.log(message)
    } else {
      console.log("Sem erros sintáticos.")
    }
    path = `arvore_${path}`
    writeFile(path, file);
  }
}
module.exports = { parser };