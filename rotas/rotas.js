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
    // router.get("/disciplinas/", controlador.findAll);

    // Busca todas as disciplinas de um professor
    router.get("/disciplinas/professor/:id", controlador.findDisciplinasProf);

    // Busca todas as disciplinas de um professor
    router.get("/disciplinas/:id", controlador.findDisciplina);

    // Busca todas as disciplinas de um professor
    router.get("/alunos/disciplina/:id", controlador.findALunosDisciplina);

    // Busca todas os artigos de uma disciplina
    router.get("/artigos/disciplinas/:id", controlador.findArtigosDisciplina);

    // Busca todas o artigo com o id
    router.get("/artigo/:id", controlador.findArtigo);

    // Busca todas as perguntas de uma disciplina
    router.get("/perguntas/disciplina/:id", controlador.findPerguntasDisciplina);

    // Verifica se as repostas dadas no questionario estão certas
    //router.post("questionario/disciplina/:id", controlador.checkQuestionario);

    // Cria uma nova disciplina
    router.post("/registarDisciplina", controlador.registarDisciplina);

    // Cria um novo artigo
    router.post("/registarArtigo", controlador.registarArtigo);

    //Cria perguntas para a disciplina
    router.post("/disciplina/perguntas", controlador.registarPerguntas);

    //Fazer inscrição de um aluno a uma disciplina
    router.post("/disciplina/inscricao", controlador.inscricaoDisciplina);

    //Fazer registo de conquista
    router.post("/disciplina/conquista", controlador.conquistaDisciplina);

    router.post("/aluno/disciplina", controlador.alunosDisciplina);

    router.get("/disciplinas", controlador.allDisciplinas);

    router.post("/disciplinas/nameDisciplina_nameProfessor", controlador.nameDisciplina_nameProfessor)

    router.post("/aluno/name", controlador.alunoName);
    
    router.post("/professor/name", controlador.professorName);

    router.post("/professor/disciplinas", controlador.professorDisciplinas);

    router.post("/professor/criarDisciplina", controlador.professorCriarDisciplina)

    app.use('/api', router);
};