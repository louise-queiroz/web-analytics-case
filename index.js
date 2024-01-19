//ler os arquivo json
const fs = require('fs');

function readJson(filePath) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(data);
      return jsonData;
    } catch (readError) {
      console.error(`Erro ao ler o arquivo JSON ${filePath}:`, readError);
      return null;
    }
  }


//corrigir nomes de marca e veículos
//map percorrer vetor, cada item do map é um objeto e cada string usar replaceAll()
function correctStrings(jsonObj) {
    function processString(str) {
      return typeof str === 'string' ? str.replaceAll('æ', 'a').replaceAll('ø', 'o') : str;
    }
  
    function correctJsonStr(obj) {
      if (typeof obj === 'string') {
        return processString(obj);
      } else if (typeof obj === 'object') {
        for (const key in obj) {
          obj[key] = correctJsonStr(obj[key]);
        }
      }
      return obj;
    }
  
    return correctJsonStr(jsonObj);
  }
  
  

//corrigir vendas
//usar typeof para ver string e utilizar Number() ou parseFloat/int
function correctSales(jsonObj) {
    function correctJsonSales(obj) {
      if (typeof obj === 'object') {
        for (const key in obj) {
          if (key === 'vendas') {
            obj[key] = typeof obj[key] === 'string' ? parseInt(obj[key], 10) : obj[key];
          } else if (typeof obj[key] === 'object') {
            obj[key] = correctJsonSales(obj[key]);
          }
        }
      }
      return obj;
    }
  
    return correctJsonSales(jsonObj);
  }


//exportar arquivo json com o banco corigido

function exportJson(jsonObj, outputPath) {
    try {
      const jsonStr = JSON.stringify(jsonObj, null, 2);
      fs.writeFileSync(outputPath, jsonStr, 'utf8');
      console.log('Banco de dados corrigido exportado com sucesso.');
    } catch (error) {
      console.error('Erro ao exportar:', error);
    }
  }
  
  const file1Path = './files/broken_database_1.json';
  const file2Path = './files/broken_database_2.json';
  
  const json1 = readJson(file1Path);
  const json2 = readJson(file2Path);
  
  if (json1 && json2) {
    const jsonCorrectedNames1 = correctStrings(json1);
    const jsonCorrectedSales1 = correctSales(jsonCorrectedNames1);
  
    const jsonCorrectedNames2 = correctStrings(json2);
    const jsonCorrectedSales2 = correctSales(jsonCorrectedNames2);
  
    const outputFilePath1 = './files/corrected_database_1.json';
    const outputFilePath2 = './files/corrected_database_2.json';
  
    exportJson(jsonCorrectedSales1, outputFilePath1);
    exportJson(jsonCorrectedSales2, outputFilePath2);
  }