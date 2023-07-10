const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const port = 8081;

app.use(express.static('public'));
app.use(express.json());

//Función para guardado del archivo JSON
app.post('/saveJSON', (req, res) => {
  const formData = req.body;

  const fileName = formData.formType + '.json';
  const filePath = path.join(__dirname,'Archivos', fileName);

  fs.writeFile(filePath, JSON.stringify(formData, null, 2), 'utf8', err => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      console.log('Archivo guardado exitosamente en:', filePath);
      res.sendStatus(200);
    }
  });
});

app.get('/getFiles', (req, res) => {
  const folderPath = path.join(__dirname, 'archivos');

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      const fileData = [];

      jsonFiles.forEach(jsonFile => {
        const filePath = path.join(folderPath, jsonFile);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(fileContent);

        fileData.push(jsonData);
      });

      res.json(fileData);
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/visualizar.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'visualizar.html'));
});
app.get('/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'script.js'));
});
app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'style.css'));
});
/*app.get('*', (req, res) => {
  res.send("<h1>Error 404 - Pagina no encontrada</h1>")
});*/



app.listen(port, () => {
  console.log(`Servidor Express en ejecución en http://localhost:${port}`);
});
