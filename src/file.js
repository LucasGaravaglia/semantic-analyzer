const fs = require("fs");

/**
 *
 * @param {String} path Caminho do arquivo que será lido
 * @returns Vetor de string com as linhas
 */
function readFile(path) {
  return fs
    .readFileSync(path)
    .toString()
    .split(/[\n|\n\r]/g);
}

/**
 *
 * @param {String} path Caminho do arquivo que será lido
 * @returns Vetor de string com as linhas
 */
function writeFile(path,output) {
  return fs.writeFileSync(path, output);
}

/**
 *
 * @param {String[]} data Vetor de string que será separado em tokens
 * @returns Vetor de tokens
 */
function process(data) {
  var tokens = [];
  var buffer = "";
  for (let j = 0; j < data.length; j++) {
    if (data[j] == " ") {
      if (buffer.length > 0) {
        tokens.push(buffer);
        buffer = "";
      }
    } else if (data[j] == "{") {
      if (buffer.length > 0) {
        tokens.push(buffer);
        tokens.push(data[j]);
        buffer = "";
      } else {
        tokens.push(data[j]);
      }
    } else if (data[j] == "}") {
      if (buffer.length > 0) {
        tokens.push(buffer);
        tokens.push(data[j]);
        buffer = "";
      } else {
        tokens.push(data[j]);
      }
    } else if (data[j] == "(") {
      if (buffer.length > 0) {
        tokens.push(buffer);
        tokens.push(data[j]);
        buffer = "";
      } else {
        tokens.push(data[j]);
      }
    } else if (data[j] == ")") {
      if (buffer.length > 0) {
        tokens.push(buffer);
        tokens.push(data[j]);
        buffer = "";
      } else {
        tokens.push(data[j]);
      }
    } else if (data[j] == ";") {
      if (buffer.length > 0) {
        tokens.push(buffer);
        tokens.push(data[j]);
        buffer = ""
      } else {
        buffer = data[j];
      }
    } else if (data[j] == "+") {
      if (buffer.length > 0) {
        tokens.push(buffer);
        tokens.push(data[j]);
        buffer = ""
      } else {
        buffer = data[j];
      }
    } else if (data[j] == "-") {
      if (buffer.length > 0) {
        tokens.push(buffer);
        tokens.push(data[j]);
        buffer = ""
      } else {
        buffer = data[j];
      }
    } else if (data[j] == "*") {
      if (buffer.length > 0) {
        tokens.push(buffer);
        tokens.push(data[j]);
        buffer = ""
      } else {
        buffer = data[j];
      }
    } else if (data[j] == "/") {
      if (buffer.length > 0) {
        tokens.push(buffer);
        tokens.push(data[j]);
        buffer = ""
      } else {
        buffer = data[j];
      }
    } else if (data[j] == "%") {
      if (buffer.length > 0) {
        tokens.push(buffer);
        tokens.push(data[j]);
        buffer = ""
      } else {
        buffer = data[j];
      }
    } else if (data[j] == "<") {
      if (buffer.length > 0) {
        tokens.push(buffer);
        buffer = data[j];
      } else {
        buffer = data[j];
      }
    } else if (data[j] == ">") {
      if (buffer.length > 0) {
        tokens.push(buffer);
        buffer = data[j];
      } else {
        buffer = data[j];
      }
    } else if (data[j] == "!") {
      if (buffer.length > 0) {
        tokens.push(buffer);
        buffer = data[j];
      } else {
        buffer = data[j];
      }
    } else if (data[j] == ",") {
      if (buffer.length > 0) {
        tokens.push(buffer);
        tokens.push(data[j]);
        buffer = ""
      } else {
        tokens.push(data[j]);
      }
    } else if (data[j] == "=") {
      if (buffer.length > 0) {
        if (/[>|<|!|=]/.test(buffer[0])) {
          buffer = buffer + data[j];
        } else {
          tokens.push(buffer);
          buffer = data[j];
        }
      } else {
        buffer = data[j];
      }
    } else {
      buffer = buffer + data[j];
    }
  }
  if (buffer.length > 0) tokens.push(buffer);
  return tokens;
}

module.exports = { readFile, process,writeFile };
