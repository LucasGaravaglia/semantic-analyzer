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
        {syntaticRules: ["tokenConditional", "tokenStartFunction", "<EXPFUNC>"],semanticRules:()=>{this.escopo+=1}},
        {syntaticRules: ["tokenStartBlockFunction", "<STA>", "<ENDBLOCK>"]},
        {syntaticRules: ["tokenWhile", "tokenStartFunction", "<EXPFUNC>"],semanticRules:()=>{this.escopo+=1}},
        {syntaticRules: ["tokenReturn", "<EXP>", "tokenEndLine", "<STA>"]},
        {syntaticRules: ["tokenIdentifier", "<K>", "tokenEndLine", "<STA>"]},
        {syntaticRules: ["tokenDataType", "<DECFUNC>"]},
        {syntaticRules: ["tokenUnsigned", "tokenDataType", "<DECFUNC>"]},
        {syntaticRules: ["tokenTypeDef","<TD>","<STA>"]},
        {syntaticRules: ["$"]},
      ],
      "<ENDBLOCK>": [
        { syntaticRules: ["tokenFinalBlockFunction", "<STA>"],semanticRules:()=>{this.escopo-=1}},
      ],
      "<EXPFUNC>": [
        { syntaticRules: ["<EXP>", "tokenFinalFunction", "tokenStartBlockFunction", "<STA>", "<ENDBLOCK>"] },
      ],
      "<T>": [
        {syntaticRules:["tokenAssignments", "<EXP>"]},
        {syntaticRules:["tokenSeparator", "tokenIdentifier", "<T>"]},
      ],
      "<L>": [
        {syntaticRules:["tokenStartFunction", "<P>", "tokenFinalFunction"],semanticRules:()=>{this.escopo+=1}},
        {syntaticRules:["<T>", "tokenEndLine"]},
      ],
      "<DECFUNC>": [
        { syntaticRules: ["tokenIdentifier", "<L>", "<STA>"] }
      ],
      "<EXP>": [
        {syntaticRules:["tokenIdentifier", "<S>"]},
        {syntaticRules:["tokenStartFunction", "<EXP>", "tokenFinalFunction"]},
        {syntaticRules:["tokenNumber", "<S>"]},
      ],
      "<K>": [
        {syntaticRules:["tokenAssignments", "<EXP>"]},
        {syntaticRules:["tokenStartFunction", "tokenIdentifier", "<B>", "tokenFinalFunction"]},
      ],
      "<B>": [
        {syntaticRules:["tokenSeparator", "tokenIdentifier", "<B>"]},
        {syntaticRules:["$"]},
      ],
      "<S>": [
        {syntaticRules:["tokenOperator", "<EXP>"]},
        {syntaticRules:["tokenExpression", "<EXP>"]},
        {syntaticRules:["$"]},
      ],
      "<F>": [
        {syntaticRules:["tokenDataType","tokenIdentifier","tokenStartFunction","<P>","tokenFinalFunction","<STA>"]},
        {syntaticRules:["tokenUnsigned","tokenIdentifier","tokenDataType","tokenStartFunction","<P>","tokenFinalFunction","<STA>"]},
        {syntaticRules:["$"]},
      ],
      "<P>": [
        {syntaticRules:["tokenDataType", "tokenIdentifier", "<Z>"]},
        {syntaticRules:["$"]},
      ],
      "<Z>": [
        {syntaticRules:["tokenSeparator", "tokenIdentifier", "<Z>"]},
        {syntaticRules:["$"]},
      ],
      "<TD>": [
        { syntaticRules: ["tokenDataType", "tokenIdentifier", "tokenEndLine"]}
      ],
    };
    this.pilha = [];
    this.escopo = 0;
    this.declarationVerify = false;
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
    let dataTypeList = [];
    let status = [];
    let lastToken = "";
    let lastSymbol = "";
    let message = "";
    this.pilha.push("<STA>");
    let state;
    let temp = [];
    let file = "";
    while (tokenList[0] != undefined || this.pilha[0] != undefined) {
      file = `${file}Lista de símbolos :`;
      tokenList.map((item) => {
        file = `${file} ${item.token}`;
      });
      file = `${file}\n`;
      file = `${file}Pilha             :`;
      temp = [];
      this.pilha.map((item) => {
        temp.unshift(item);
      });
      temp.map((item) => {
        file = `${file} ${item}`;
      });
      file = `${file} \n\n`;
      state = this.pilha[this.pilha.length - 1];
      this.pilha.pop();
      if (/<[a-z]*>/i.test(state)) {
        for (let i = 0; i < this.syntacticTable[state].length; i++) {
          if (this.syntacticTable[state][i].syntaticRules[0] == tokenList[0].token) {
            this.stackUp(this.syntacticTable[state][i].syntaticRules);
            if (this.syntacticTable[state][i].semanticRules != undefined)
              (this.syntacticTable[state][i].semanticRules());
            break;
          } else if (/<[a-z]*>/i.test(this.syntacticTable[state][i].syntaticRules[0])) {
            this.stackUp(this.syntacticTable[state][i].syntaticRules);
            if (this.syntacticTable[state][i].semanticRules != undefined)
              (this.syntacticTable[state][i].semanticRules());
            break;
          }
        }
      } else {
        if (state != tokenList[0].token) {
          message = `Erro na linha [${tokenList[0].line}] na analise sintática, token esperado: ${state}.`;
          break;
        } else {
          if (state == "tokenNumber") {
            dataTypeList.push("int");
          }else if (state == "tokenDataType") {
            dataTypeList.push(tokenList[0].symbol);
          } else if (state == "tokenIdentifier" && (lastToken == "tokenDataType" || lastToken == "tokenSeparator")) {
            let tempItemT;
            dataTypeList.map(item => {
              if (item != undefined) {
                tempItemT = item;
              }
            })
            dataTypeList.push(tempItemT);
          }else{
            dataTypeList.push(undefined);
          }
          if (state == "tokenIdentifier" && (lastToken == "tokenDataType" || lastToken == "tokenSeparator") ) {
            status.push("declaration")
          }else if (state == "tokenIdentifier" && this.pilha[this.pilha.length - 1] == "tokenAssignments") {
            status.push("assignment")
          } else if ((state == "tokenIdentifier")){
            status.push("usage")
          } else {
            status.push("not defined")
          }
          escopoList.push(this.escopo);
          lastToken = state;
          lastSymbol = tokenList[0].symbol;
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
    return {escopoList,dataTypeList,status};
  }
}
module.exports = { parser };
