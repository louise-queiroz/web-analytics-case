//ler os arquivo json
const fs = require('fs');

function readJson(filePaths) {
    try {
      const jsonObjects = filePaths.map((filePath, index) => {
        try {
          const data = fs.readFileSync(filePath, 'utf8');
          const jsonData = JSON.parse(data);
          // console.log(jsonData);
          return jsonData;
        } catch (parseError) {
          console.error(`Erro no arquivo ${index + 1}:`, parseError);
          return null;
        }
      });
      return jsonObjects.filter(jsonObj => jsonObj !== null);
    } catch (readError) {
      console.error('Erro ao ler os arquivos JSON:', readError);
      return [];
    }
  }

const file1Path = './files/broken_database_1.json';
const file2Path = './files/broken_database_2.json';

//readJson([file1Path, file2Path]);


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


  const jsonObjects = readJson([file1Path, file2Path]);
  const jsonCorrigidoNomes = jsonObjects.map(correctStrings);
  const jsonCorrigidoVendas = jsonCorrigidoNomes.map(correctSales);
  const outputFilePath = './files/corrected_database.json';
  exportJson(jsonCorrigidoVendas, outputFilePath);
  