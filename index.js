const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

function countRequests(req, res, next) {
  console.count("Número de requisições");

  return next();
}

server.use(countRequests);

//Middleware para saber se o projeto existe

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({message: 'Project does not exists'});
  }

  return next();
}

//Cadastro de um projeto
// request body: id e title

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

//Listagem de todos os projetos

server.get('/projects', (req, res) => {
  return res.json(projects);
});

//Edição de um projeto
//Route params: id
//Request body: title

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;
  
  return res.json(project);
});

//Remoção de um projeto
//Route params: id, deleta o projeto conforme o id na rota

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.body;

  const index = projects.findIndex(p => p.id == id);

  projects.splice(index, 1);

  return res.send();
});

//Adição de uma tarefa pelo id na rota
//Route params: id
//Request Body: title

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);