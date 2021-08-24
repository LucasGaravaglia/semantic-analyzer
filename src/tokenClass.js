const { state } = require("./automato");

/**
 * Objeto que contém os estados da classe de token de marcação de inicio de função
 */
const startBlockFunctionClass = () => {
  let states = [new state("q0", false), new state("q1", true)];
  const name = "tokenStartBlockFunction";
  states[0].newTransition("{", "q1", "q0");
  return { states, name };
};

/**
 * Objeto que contém os estados da classe de token de marcação de final de função
 */
const FinalBlockFunctionClass = () => {
  let states = [new state("q0", false), new state("q1", true)];
  const name = "tokenFinalBlockFunction";
  states[0].newTransition("}", "q1", "q0");
  return { states, name };
};
/**
 * Objeto que contém os estados da classe de token de separação
 */
const separatorClass = () => {
  let states = [new state("q0", false), new state("q1", true)];
  const name = "tokenSeparator";
  states[0].newTransition(",", "q1", "q0");
  return { states, name };
}
/**
 * Objeto que contém os estados da classe de token inicio de marcação de função
 */
const startFunctionMarkerClass = () => {
  let states = [new state("q0", false), new state("q1", true)];
  const name = "tokenStartFunction";
  states[0].newTransition("(", "q1", "q0");
  return { states, name };
};
/**
 * Objeto que contém os estados da classe de token final de marcação de função
 */
const finalFunctionMarkerClass = () => {
  let states = [new state("q0", false), new state("q1", true)];
  const name = "tokenFinalFunction";
  states[0].newTransition(")", "q1", "q0");
  return { states, name };
};
/**
 * Objeto que contém os estados da classe de token variável
 */
const identifierClass = () => {
  let states = [
    new state("q0", false),
    new state("q1", true),
    new state("Identificador mal formado", false),
  ];
  const name = "tokenIdentifier";
  states[0].newTransition("_", "q1", "q0");
  states[0].newTransition("", "q1", "q0", /[a-z]/);
  states[1].newTransition("_", "q1", "q1");
  states[1].newTransition("", "q1", "q1", /[a-z]/i);
  states[1].newTransition("", "q1", "q1", /[0-9]/i);
  states[1].newTransition(
    "",
    "Identificador mal formado",
    "q1",
    /[!|@|#|$|%|¨|&|*|(|)|:|?|,]?/i
  );

  return { states, name };
};
/**
 * Objeto que contém os estados da classe de token números
 */
const numberClass = () => {
  let states = [
    new state("q0", false),
    new state("q1", true),
    new state("q2", false),
    new state("q3", true),
    new state("Numero mal formado", false),
  ];
  const name = "tokenNumber";
  states[0].newTransition("", "q1", "q0", /[0-9]/i);
  states[1].newTransition("", "q1", "q1", /[0-9]/i);
  states[1].newTransition(".", "q2", "q1");
  states[1].newTransition(
    "",
    "Numero mal formado",
    "q1",
    /[a-z|!|@|#|$|%|¨|&|*|(|)|:|?|,|_|/|;|:]/i
  );
  states[2].newTransition("", "q3", "q2", /[0-9]/i);
  states[2].newTransition(
    "",
    "Numero mal formado",
    "q2",
    /[a-z|!|@|#|$|%|¨|&|*|(|)|:|?|,|_|/|;|:]/i
  );
  states[3].newTransition("", "q3", "q3", /[0-9]/i);
  states[3].newTransition(
    "",
    "Numero mal formado",
    "q3",
    /[a-z|!|@|#|$|%|¨|&|*|(|)|:|?|,|_|/|;|:]/i
  );

  return { states, name };
};
/**
 * Objeto que contém os estados da classe de token de laço de repetição
 */
const loopClass = () => {
  let states = [
    new state("q0", false),
    new state("q1", false),
    new state("q2", false),
    new state("q3", false),
    new state("q4", false),
    new state("q5", true),
  ];
  const name = "tokenWhile";
  states[0].newTransition("w", "q1", "q0");
  states[1].newTransition("h", "q2", "q1");
  states[2].newTransition("i", "q3", "q2");
  states[3].newTransition("l", "q4", "q3");
  states[4].newTransition("e", "q5", "q4");

  return { states, name };
};
/**
 * Objeto que contém os estados da classe de token de retorno de função
 */
const functionReturnClass = () => {
  let states = [
    new state("q0", false),
    new state("q1", false),
    new state("q2", false),
    new state("q3", false),
    new state("q4", false),
    new state("q5", false),
    new state("q6", true),
  ];
  const name = "tokenReturn";
  states[0].newTransition("r", "q1", "q0");
  states[1].newTransition("e", "q2", "q1");
  states[2].newTransition("t", "q3", "q2");
  states[3].newTransition("u", "q4", "q3");
  states[4].newTransition("r", "q5", "q4");
  states[5].newTransition("n", "q6", "q5");

  return { states, name };
};
/**
 * Objeto que contém os estados da classe de token de condição
 */
const functionConditionalClass = () => {
  let states = [
    new state("q0", false),
    new state("q1", false),
    new state("q2", true),
  ];
  const name = "tokenConditional";
  states[0].newTransition("i", "q1", "q0");
  states[1].newTransition("f", "q2", "q1");

  return { states, name };
};
/**
 * Objeto que contém os estados da classe de token do tipo integer
 */
const integerTypeClass = () => {
  let states = [
    new state("q0", false),
    new state("q1", false),
    new state("q2", false),
    new state("q3", true),
  ];
  const name = "tokenDataType";
  states[0].newTransition("i", "q1", "q0");
  states[1].newTransition("n", "q2", "q1");
  states[2].newTransition("t", "q3", "q2");

  return { states, name };
};
/**
 * Objeto que contém os estados da classe de token de atribuição
 */
const assignmentClass = () => {
  let states = [new state("q0", false), new state("q1", true)];
  const name = "tokenAssignments";
  states[0].newTransition("=", "q1", "q0");

  return { states, name };
};
/**
 * Objeto que contém os estados da classe de token de expressões lógicas
 */
const expressionsClass = () => {
  let states = [
    new state("q0", false),
    new state("q1", false),
    new state("q2", true),
    new state("q3", true),
  ];
  const name = "tokenExpression";
  states[0].newTransition("=", "q1", "q0");
  states[0].newTransition("!", "q1", "q0");
  states[0].newTransition(">", "q3", "q0");
  states[0].newTransition("<", "q3", "q0");
  states[1].newTransition("=", "q2", "q1");
  states[3].newTransition("=", "q2", "q3");

  return { states, name };
};
/**
 * Objeto que contém os estados da classe de token de operadores matemáticos
 */
const operatorClass = () => {
  let states = [new state("q0", false), new state("q1", true)];
  const name = "tokenOperator";
  states[0].newTransition("+", "q1", "q0");
  states[0].newTransition("-", "q1", "q0");
  states[0].newTransition("*", "q1", "q0");
  states[0].newTransition("/", "q1", "q0");
  states[0].newTransition("%", "q1", "q0");

  return { states, name };
};
/**
 * Objeto que contém os estados da classe de token de final de linha
 */
const endLineClass = () => {
  let states = [new state("q0", false), new state("q1", true)];
  const name = "tokenEndLine";
  states[0].newTransition(";", "q1", "q0");
  return { states, name };
};

/**
 * Objeto que contém os estados da classe de token de laço de repetição
 */
const typeDefClass = () => {
  let states = [
    new state("q0", false),
    new state("q1", false),
    new state("q2", false),
    new state("q3", false),
    new state("q4", false),
    new state("q5", false),
    new state("q6", false),
    new state("q7", true),
  ];
  const name = "tokenTypeDef";
  states[0].newTransition("t", "q1", "q0");
  states[1].newTransition("y", "q2", "q1");
  states[2].newTransition("p", "q3", "q2");
  states[3].newTransition("e", "q4", "q3");
  states[4].newTransition("d", "q5", "q4");
  states[5].newTransition("e", "q6", "q5");
  states[6].newTransition("f", "q7", "q6");
  return { states, name };
};

module.exports = {
  typeDefClass,
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
  separatorClass
};
