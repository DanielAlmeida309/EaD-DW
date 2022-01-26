module.exports = app => {
    const controlador = require("../controllers/controller.js");

    var router = require("express").Router();

    // Cria um novo utilizador
    router.post("/registarAluno", controlador.registarAluno);

    // Cria um novo utilizador
    router.post("/registarProfessor", controlador.registarProfessor);
  
    // Rota para login - tem de ser POST para não vir user e pass na URL
    router.post("/loginAluno", controlador.loginAluno);

    // Rota para login - tem de ser POST para não vir user e pass na URL
    router.post("/loginProfessor", controlador.loginProfessor);

    // Rota para verificar e ativar o utilizador
    router.get("/auth/confirmAluno/:confirmationCode", controlador.verificaAluno);

    // Rota para verificar e ativar o utilizador
    router.get("/auth/confirmProfessor/:confirmationCode", controlador.verificaProfessor);

    // Envia lista de disciplinas e docentes associados
    router.get("/disciplinas/", controlador.findAll);

    // Busca todas as disciplinas de um professor
    router.get("/disciplinas/professor/:id", controlador.findDisciplinasProf);

    // Busca todas as disciplinas de um professor
    router.get("/disciplinas/:id", controlador.findDisciplina);

    // Busca todas os artigos de uma disciplina
    router.get("/artigos/disciplinas/:id", controlador.findArtigosDisciplina);

    // Busca todas as perguntas de uma disciplina
    router.get("/perguntas/disciplina/:id", controlador.findPerguntasDisciplina);

    // Verifica se as repostas dadas no questionario estão certas
    //router.post("questionario/disciplina/:id", controlador.checkQuestionario);

    app.use('/api', router);
};