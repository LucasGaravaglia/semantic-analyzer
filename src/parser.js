const { writeFile } = require("./file");

/**
 * Classe que simula o analisador sintático.
 */
class parser {
  /**
   * Construtor da classe parser
   * @param {Object} syntacticTable Tabela sintática
   * @param {Array} pilha pilha para a analise.
   */
  constructor() {
    this.syntacticTable = {
      "<STA>": [
        ["tokenConditional", "<EXPFUNC>"],
        ["tokenStartBlockFunction", "<ENDBLOCK>"],
        ["tokenWhile", "<EXPFUNC>"],
        ["tokenReturn", "<EXP>", "tokenEndLine", "<STA>"],
        ["tokenIdentifier", "<K>", "tokenEndLine", "<STA>"],
        ["tokenDataType", "<DECVAR>"],
        ["tokenUnsigned", "tokenDataType", "<DECVAR>"],
        ["tokenTypeDef","tokenDataType","tokenIdentifier","tokenEndLine","<STA>"],
        ["$"],
      ],
      "<ENDBLOCK>": [
        ["<STA>", "tokenFinalBlockFunction", "<STA>"],
      ],
      "<EXPFUNC>": [
        ["tokenStartFunction", "<EXP>", "tokenFinalFunction", "<STA>"],
      ],
      "<T>": [
        ["tokenAssignments", "<EXP>"],
        ["tokenSeparator", "tokenIdentifier", "<T>"],
      ],
      "<L>": [
        ["tokenStartFunction", "<P>", "tokenFinalFunction"],
        ["<T>", "tokenEndLine"],
      ],
      "<DECVAR>": [
        ["tokenIdentifier", "<L>", "<STA>"],
      ],
      "<EXP>": [
        ["tokenIdentifier", "<S>"],
        ["tokenStartFunction", "<EXP>", "tokenFinalFunction"],
        ["tokenNumber", "<S>"],
      ],
      "<K>": [
        ["tokenAssignments", "<EXP>"],
        ["tokenStartFunction", "tokenIdentifier", "<B>", "tokenFinalFunction"],
      ],
      "<B>": [
        ["tokenSeparator", "tokenIdentifier", "<B>"], ["$"]
      ],
      "<S>": [
        ["tokenOperator", "<EXP>"], ["tokenExpression", "<EXP>"], ["$"]
      ],
      "<F>": [
        ["tokenDataType","tokenIdentifier","tokenStartFunction","<P>","tokenFinalFunction","<STA>"],
        ["tokenUnsigned","tokenIdentifier","tokenDataType","tokenStartFunction","<P>","tokenFinalFunction","<STA>"],
        ["$"],
      ],
      "<P>": [
        ["tokenDataType", "tokenIdentifier", "<Z>"], 
        ["$"]
      ],
      "<Z>": [
        ["tokenSeparator", "tokenIdentifier", "<Z>"], 
        ["$"]
      ],
      "<TD>": [
        ["tokenTypeDef", "tokenDataType", "tokenIdentifier", "tokenEndLine"],
      ],
    };
    this.pilha = [];
  }
  /**
   * Recebe um vetor de token e os empilha para derivações futuras.
   * @param {Array} vet Vetor de token para a derivação da cadeia.
   */
  stackUp(vet) {
    for (let i = vet.length - 1; i >= 0; i--) {
      this.pilha.push(vet[i]);
    }
  }

  /**
   * Método responsável pela logica do analisador sintático.
   * @param {Array} tokenList Vetor de token que sera analisado pelo analisador sintático.
   */
  process(tokenList, path) {
    let escopoList = [];
    let escopo = 0;
    let message = "";
    this.pilha.push("<STA>");
    let state;
    let temp = [];
    let file = "";
    while (tokenList[0] != undefined || this.pilha[0] != undefined) {
      temp = [];
      tokenList.map((item) => {
        temp.unshift(item);
      });
      file = `${file} Lista de símbolos :`;
      temp.map((item) => {
        file = `${file} ${item.token}`;
      });
      file = `${file} \n`;
      file = `${file} Pilha             :`;
      this.pilha.map((item) => {
        file = `${file} ${item.token}`;
      });
      file = `${file} \n\n`;
      state = this.pilha[this.pilha.length - 1];
      this.pilha.pop();
      if (state == "tokenFinalBlockFunction") escopo--;
      else if (state == "tokenStartBlockFunction") escopo++;
      if (/<[a-z]*>/i.test(state)) {
        for (let i = 0; i < this.syntacticTable[state].length; i++) {
          if (this.syntacticTable[state][i][0] == tokenList[0].token) {
            this.stackUp(this.syntacticTable[state][i]);
            break;
          } else if (/<[a-z]*>/i.test(this.syntacticTable[state][i][0])) {
            this.stackUp(this.syntacticTable[state][i]);
            break;
          }
        }
      } else {
        if (state != tokenList[0].token) {
          message = "Erros na analise sintática";
          break;
        } else {
          escopoList.push(escopo);
          tokenList.shift();
        }
      }
    }

    if (message) {
      console.log(message);
    } else {
      console.log("Sem erros sintáticos.");
    }
    path = `arvore_${path}`;
    writeFile(path, file);
    return escopoList;
  }
}
module.exports = { parser };
