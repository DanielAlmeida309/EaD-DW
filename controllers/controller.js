require("dotenv").config();
const db = require("../models/nedb"); // Define o MODEL que vamos usar

const dbmySQL = require("../models/mysql"); // Define o MODEL mySQL
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function authenticateToken(req, res) {
  console.log("A autorizar...");
  const cookies = req.cookies;
  console.log("Cookies:");
  console.log(cookies);
  // const authHeader = req.headers["authorization"];
  const token = cookies.jwt; //authHeader && authHeader.split(" ")[1];
  if (token == null) {
    console.log("Token nula");
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.email = user;
  });
}

const nodemailer = require("nodemailer");
const { response } = require("express");

// async..await não é permitido no contexto global
async function enviaEmail(recipients, confirmationToken) {
  // Gera uma conta do serviço SMTP de email do domínio ethereal.email
  // Somente necessário na fase de testes e se não tiver uma conta real para utilizar
  let testAccount = await nodemailer.createTestAccount();

  // Cria um objeto transporter reutilizável que é um transporter SMTP
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true para 465, false para outras portas
    auth: {
      user: testAccount.user, // utilizador ethereal gerado
      pass: testAccount.pass, // senha do utilizador ethereal
    },
  });

  // envia o email usando o objeto de transporte definido
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // endereço do originador
    to: recipients, // lista de destinatários
    subject: "Hello ✔", // assunto
    text: "Clique aqui para ativar sua conta: " + confirmationToken, // corpo do email
    html: "<b>Clique aqui para ativar sua conta: " + confirmationToken + "</b>", // corpo do email em html
  });

  console.log("Mensagem enviada: %s", info.messageId);
  // Mensagem enviada: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // A pré-visualização só estará disponível se usar uma conta Ethereal para envio
  console.log(
    "URL para visualização prévia: %s",
    nodemailer.getTestMessageUrl(info)
  );
  // URL para visualização prévia: https://ethereal.email/message/WaQKMgKddxQDoou...
}

exports.verificaAluno = async (req, res) => {
  const confirmationCode = req.params.confirmationCode;
  dbmySQL
    .crUd_ativarAluno(confirmationCode)
    .then(() => {
      const resposta = { message: "O Aluno está ativo!" };
      console.log(resposta);
      return res.send(resposta);
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).send({
        message: JSON.stringify(response),
      });
    });
};

exports.verificaProfessor = async (req, res) => {
  const confirmationCode = req.params.confirmationCode;
  dbmySQL
    .crUd_ativarProfessor(confirmationCode)
    .then(() => {
      const resposta = { message: "O Professor está ativo!" };
      console.log(resposta);
      return res.send(resposta);
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).send({
        message: JSON.stringify(response),
      });
    });
};

// REGISTAR Aluno- cria um novo utilizador
exports.registarAluno = async (req, res) => {
  console.log("Registar novo utilizador");
  if (!req.body) {
    return res.status(400).send({
      message: "O conteúdo não pode ser vazio!",
    });
  }
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  const email = req.body.email;
  const nome = req.body.nome;
  const password = hashPassword;
  const confirmationToken = jwt.sign(
    req.body.email,
    process.env.ACCESS_TOKEN_SECRET
  );
  const confirmURL = `https://localhost:${process.env.PORT}/api/auth/confirmAluno/${confirmationToken}`;
  dbmySQL
    .Crud_registarAluno(email, password, nome, confirmationToken) // C: Create
    .then((dados) => {
      enviaEmail(email, confirmURL).catch(console.error);
      res.status(201).send({
        message:
          "Aluno criado com sucesso, confira sua caixa de correio para ativar!",
      });
      console.log("Controller - Aluno registado: ");
      console.log(JSON.stringify(dados)); // para debug
    })
    .catch((response) => {
      console.log("Controller - problema ao registar:");
      console.log(response);
      return res.status(400).send({
        message: JSON.stringify(response),
      });
    });
};

// REGISTAR Professor- cria um novo utilizador
exports.registarProfessor = async (req, res) => {
  console.log("Registar novo utilizador");
  if (!req.body) {
    return res.status(400).send({
      message: "O conteúdo não pode ser vazio!",
    });
  }
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  const email = req.body.email;
  const nome = req.body.nome;
  const password = hashPassword;
  const confirmationToken = jwt.sign(
    req.body.email,
    process.env.ACCESS_TOKEN_SECRET
  );
  const confirmURL = `https://localhost:${process.env.PORT}/api/auth/confirmProfessor/${confirmationToken}`;
  dbmySQL
    .Crud_registarProfessor(email, password, nome, confirmationToken) // C: Create
    .then((dados) => {
      enviaEmail(email, confirmURL).catch(console.error);
      res.status(201).send({
        message:
          "Professor criado com sucesso, confira sua caixa de correio para ativar!",
      });
      console.log("Controller - Professor registado: ");
      console.log(JSON.stringify(dados)); // para debug
    })
    .catch((response) => {
      console.log("Controller - problema ao registar:");
      console.log(response);
      return res.status(400).send({
        message: JSON.stringify(response),
      });
    });
};

// LOGIN - autentica um utilizador
exports.loginAluno = async (req, res) => {
  console.log("Autenticação de um utilizador");
  if (!req.body) {
    return res.status(400).send({
      message: "O conteúdo não pode ser vazio!",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  const email = req.body.email;
  const password = hashPassword;
  dbmySQL
    .cRud_loginAluno(email) //
    .then(async (dados) => {
      if (await bcrypt.compare(req.body.password, dados.pass)) {
        const user = { name: email };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: 20 * 60,
        });
        // res.setHeader('Set-Cookie','novoUser=true')
        res.cookie("jwt", accessToken, {
          maxAge: 1000 * 60 * 2,
          httpOnly: true,
        });
        res.status(200).send({ user: email }); // aqui temos de enviar a token de autorização
        console.log("Resposta da consulta à base de dados: ");
        console.log(JSON.stringify(dados)); // para debug
      } else {
        console.log("Password incorreta");
        return res.status(401).send({ erro: "A senha não está correta!" });
      }
    })
    .catch((response) => {
      console.log("Controller:");
      console.log(response);
      return res.status(401).send({
        message: JSON.stringify(response),
      });
    });
};

// LOGIN - autentica um utilizador
exports.loginProfessor = async (req, res) => {
  console.log("Autenticação de um utilizador");
  if (!req.body) {
    return res.status(400).send({
      message: "O conteúdo não pode ser vazio!",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  const email = req.body.email;
  const password = hashPassword;
  dbmySQL
    .cRud_loginProfessor(email) //
    .then(async (dados) => {
      if (await bcrypt.compare(req.body.password, dados.pass)) {
        const user = { name: email };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: 20 * 60,
        });
        // res.setHeader('Set-Cookie','novoUser=true')
        res.cookie("jwt", accessToken, {
          maxAge: 1000 * 60 * 2,
          httpOnly: true,
        });
        res.status(200).send({ user: email }); // aqui temos de enviar a token de autorização
        console.log("Resposta da consulta à base de dados: ");
        console.log(JSON.stringify(dados)); // para debug
      } else {
        console.log("Password incorreta");
        return res.status(401).send({ erro: "A senha não está correta!" });
      }
    })
    .catch((response) => {
      console.log("Controller:");
      console.log(response);
      return res.status(401).send({
        message: JSON.stringify(response),
      });
    });
};

// Envia todas as disciplinas
exports.findAll = (req, res) => {
  authenticateToken(req, res);
    // utilizador autenticado
    console.log(`FindAll - user: ${req.email.name}`);
    console.log("Mensagem de debug - listar disciplinas");
    dbmySQL
      .cRud_all() // R: Read
      .then((dados) => {
        res.send(dados);
      })
      .catch((err) => {
        return res
          .status(400)
          .send({ message: "Não há disciplinas para mostrar!" });
      });
};

// READ Disciplinas de um Professor
exports.findDisciplinasProf = async (req, res) => {
  authenticateToken(req, res);
    // utilizador autenticado
    console.log("Find All Disciplines by Teacher Id");
    console.log("Parâmetro: " + req.params.id);
    //Deve implementar esta funcionalidade...
    const id = req.params.id.substr(1); // faz substring a partir do segundo carater
    dbmySQL
      .cRud_disciplinasProf(id) // R: Read
      .then((dados) => {
        res.send(dados);
        // console.log("Dados: " + JSON.stringify(dados)); // para debug
      })
      .catch((err) => {
        return res
          .status(400)
          .send({ message: "Não há disciplinas para mostrar!" });
      });
};

// READ Disciplina de um id
exports.findDisciplina = async (req, res) => {
  authenticateToken(req, res);
    // utilizador autenticado
    console.log("Find All Disciplines by Teacher Id");
    console.log("Parâmetro: " + req.params.id);
    //Deve implementar esta funcionalidade...
    const id = req.params.id.substr(1); // faz substring a partir do segundo carater
    dbmySQL
      .cRud_disciplina(id) // R: Read
      .then((dados) => {
        res.send(dados);
        // console.log("Dados: " + JSON.stringify(dados)); // para debug
      })
      .catch((err) => {
        return res
          .status(400)
          .send({ message: "Não há disciplina para mostrar!" });
      });
};

exports.findArtigosDisciplina = async (req, res) => {
  authenticateToken(req, res);
    // utilizador autenticado
    console.log("Find All Articles by Discipline Id");
    console.log("Parâmetro: " + req.params.id);
    //Deve implementar esta funcionalidade...
    const id = req.params.id.substr(1); // faz substring a partir do segundo carater
    dbmySQL
      .cRud_artigosDisciplina(id) // R: Read
      .then((dados) => {
        res.send(dados);
        // console.log("Dados: " + JSON.stringify(dados)); // para debug
      })
      .catch((err) => {
        return res
          .status(400)
          .send({ message: "Não há artigos para mostrar!" });
      });
};

exports.findPerguntasDisciplina = async (req, res) => {
  authenticateToken(req, res);
    // utilizador autenticado
    console.log("Find All Questions by disciplina Id");
    console.log("Parâmetro: " + req.params.id);
    //Deve implementar esta funcionalidade...
    const id = req.params.id.substr(1); // faz substring a partir do segundo carater
    dbmySQL
      .cRud_perguntasDisciplina(id) // R: Read
      .then((dados) => {
        res.send(dados);
        // console.log("Dados: " + JSON.stringify(dados)); // para debug
      })
      .catch((err) => {
        return res
          .status(400)
          .send({ message: "Não há disciplinas para mostrar!" });
      });
};

exports.findArtigo = async (req, res) => {
  authenticateToken(req, res);
  if (req.email != null) {
    // utilizador autenticado
    console.log("Find All Articles by Discipline Id");
    console.log("Parâmetro: " + req.params.id);
    //Deve implementar esta funcionalidade...
    const id = req.params.id.substr(1); // faz substring a partir do segundo carater
    dbmySQL
      .cRud_artigo(id) // R: Read
      .then((dados) => {
        res.send(dados);
        // console.log("Dados: " + JSON.stringify(dados)); // para debug
      })
      .catch((err) => {
        return res
          .status(400)
          .send({ message: "Não há artigos para mostrar!" });
      });
  }
};

exports.findALunosDisciplina = async (req, res) => {
  authenticateToken(req, res);
    // utilizador autenticado
    console.log("Find All Questions by disciplina Id");
    console.log("Parâmetro: " + req.params.id);
    //Deve implementar esta funcionalidade...
    const id = req.params.id.substr(1); // faz substring a partir do segundo carater
    dbmySQL
      .cRud_alunosDisciplina(id) // R: Read
      .then((dados) => {
        res.send(dados);
        // console.log("Dados: " + JSON.stringify(dados)); // para debug
      })
      .catch((err) => {
        return res
          .status(400)
          .send({ message: "Não há disciplinas para mostrar!" });
      });

};

exports.addConquista = async (req, res) => {
  dbmySQL
    .crUd_addConquista(req)
    .then(() => {
      const resposta = { message: "O Aluno concluiu a Disciplina com sucesso!" };
      console.log(resposta);
      return res.send(resposta);
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).send({
        message: JSON.stringify(response),
      });
    });
};

// REGISTAR Disciplina
exports.registarDisciplina = async (req, res) => {
  console.log("Registar nova disciplina");
  if (!req.body) {
    return res.status(400).send({
      message: "O conteúdo não pode ser vazio!",
    });
  }

  const idProfessor = req.body.email;
  const nome = req.body.nome;

  dbmySQL
    .Crud_registarProfessor(idProfessor, nome) // C: Create
    .then((dados) => {
      res.status(201).send({
        message:
          "Disciplina criada com sucesso!",
      });
      console.log("Controller - Disciplina registado: ");
      console.log(JSON.stringify(dados)); // para debug
    })
    .catch((response) => {
      console.log("Controller - problema ao registar:");
      console.log(response);
      return res.status(400).send({
        message: JSON.stringify(response),
      });
    });
};

// REGISTAR Artigo
exports.registarArtigo = async (req, res) => {
  console.log("Registar novo artigo");
  if (!req.body) {
    return res.status(400).send({
      message: "O conteúdo não pode ser vazio!",
    });
  }

  const idDisciplina = req.body.idDisciplina;
  const nome = req.body.nome;
  const assunto = req.body.assunto;

  dbmySQL
    .Crud_registarArtigo(idDisciplina, nome, assunto) // C: Create
    .then((dados) => {
      res.status(201).send({
        message:
          "Disciplina criada com sucesso!",
      });
      console.log("Controller - Disciplina registado: ");
      console.log(JSON.stringify(dados)); // para debug
    })
    .catch((response) => {
      console.log("Controller - problema ao registar:");
      console.log(response);
      return res.status(400).send({
        message: JSON.stringify(response),
      });
    });
};

// REGISTAR Artigo
exports.registarPerguntas = async (req, res) => {
  console.log("Registar novo artigo");
  if (!req.body) {
    return res.status(400).send({
      message: "O conteúdo não pode ser vazio!",
    });
  }

  const idDisciplina = req.body.idDisciplina;
  const pergunta = req.body.pergunta;
  const resposta1 = req.body.resposta1;
  const resposta2 = req.body.resposta2;
  const resposta3 = req.body.resposta3;
  const resposta4 = req.body.resposta4;
  const resposta5 = req.body.resposta5;
  const certa = req.body.certa;


  dbmySQL
    .Crud_registarPergunta(idDisciplina, pergunta, resposta1, resposta2, resposta3, resposta4, resposta5, certa) // C: Create
    .then((dados) => {
      res.status(201).send({
        message:
          "Pergunta criada com sucesso!",
      });
      console.log("Controller - Pergunta registada: ");
      console.log(JSON.stringify(dados)); // para debug
    })
    .catch((response) => {
      console.log("Controller - problema ao registar:");
      console.log(response);
      return res.status(400).send({
        message: JSON.stringify(response),
      });
    });
};

// REGISTAR Artigo
exports.inscricaoDisciplina = async (req, res) => {
  console.log("Registar novo artigo");
  if (!req.body) {
    return res.status(400).send({
      message: "O conteúdo não pode ser vazio!",
    });
  }

  const idDisciplina = req.body.idDisciplina;
  const idAluno = req.body.idAluno;

  dbmySQL
    .Crud_incricaoDisciplina(idDisciplina, idAluno) // C: Create
    .then((dados) => {
      res.status(201).send({
        message:
          "Inscrição feita com sucesso!",
      });
      console.log("Controller - Inscrição registada: ");
      console.log(JSON.stringify(dados)); // para debug
    })
    .catch((response) => {
      console.log("Controller - problema ao registar:");
      console.log(response);
      return res.status(400).send({
        message: JSON.stringify(response),
      });
    });
};

// REGISTAR Conquista
exports.conquistaDisciplina = async (req, res) => {
  console.log("Registar nova conquista");
  if (!req.body) {
    return res.status(400).send({
      message: "O conteúdo não pode ser vazio!",
    });
  }

  const idDisciplina = req.body.idDisciplina;
  const idAluno = req.body.idAluno;
  const notaFinal = req.body.notaFinal

  dbmySQL
    .Crud_conquistaDisciplina(idDisciplina, idAluno, notaFinal) // C: Create
    .then((dados) => {
      res.status(201).send({
        message:
          "Conquista registada com sucesso!",
      });
      console.log("Controller - Conquista registada: ");
      console.log(JSON.stringify(dados)); // para debug
    })
    .catch((response) => {
      console.log("Controller - problema ao registar:");
      console.log(response);
      return res.status(400).send({
        message: JSON.stringify(response),
      });
    });
};