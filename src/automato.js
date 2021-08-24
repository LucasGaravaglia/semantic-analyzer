/**
 * Classe que simula uma transição de um automato
 */
class transition {
  /**
   * Construtor da classe transition
   * @param {String} symbol carácter que será lido na transição
   * @param {String} destinationState Estado destino
   * @param {String} currentState Nome do estado atual
   * @param {String} symbolReg Cadeia de caracteres que será lido na transição
   */
  constructor(symbol, destinationState, currentState, symbolReg) {
    this.symbol = symbol;
    this.destinationState = destinationState;
    this.currentState = currentState;
    this.symbolReg = symbolReg;
  }
  getSymbol() {
    return this.symbol;
  }
  getState() {
    return this.destinationState;
  }
  getSymbolReg() {
    return this.symbolReg;
  }
}

/**
 * Classe que simula um estado de um automato.
 */
class state {
  /**
   * Construtor da classe transition
   * @param {String} name Nome do estado
   * @param {Boolean} isFinal verificador se o estado é final ou não
   */
  constructor(name, isFinal) {
    this.isFinal = isFinal;
    this.name = name;
    this.transitions = [];
  }
  /**
   * Cria uma transição para esse estado
   * @param {String} symbol Carácter que será lido nessa transição
   * @param {String} destinationState Estado destinho da transição
   * @param {String} currentState Estado que a transição pertence
   * @param {RegExp} symbolReg Cadeia de caracteres que será lido nessa transição
   */
  newTransition(symbol, destinationState, currentState, symbolReg = /[]/) {
    this.transitions.push(
      new transition(symbol, destinationState, currentState, symbolReg)
    );
  }
  getName() {
    return this.name;
  }
  isFinal() {
    return this.isFinal;
  }
  /**
   *
   * @param {String} symbol Carácter que será procurado nas transições
   * @returns retorna o proximo estado ou false caso nao tenha um proximo
   */
  getNextState(symbol) {
    for (let i = 0; i < this.transitions.length; i++) {
      if (
        this.transitions[i].getSymbol() == symbol ||
        this.transitions[i].getSymbolReg().test(symbol)
      ) {
        return this.transitions[i].getState();
      }
    }
    return false;
  }
}

module.exports = { state, transition };
