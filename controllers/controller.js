require("dotenv").config();

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
        const user = dados;
        console.log(user);
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: 20 * 60,
        });
        // res.setHeader('Set-Cookie','novoUser=true')
        res.cookie("jwt", accessToken, {
          maxAge: 1000 * 60 * 2,
          httpOnly: true,
        });
        res.status(200).send({ user, accessToken }); // aqui temos de enviar a token de autorização
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
        const user = dados;
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: 20 * 60,
        });
        // res.setHeader('Set-Cookie','novoUser=true')
        res.cookie("jwt", accessToken, {
          maxAge: 1000 * 60 * 2,
          httpOnly: true,
        });
        res.status(200).send({ user, accessToken }); // aqui temos de enviar a token de autorização
        console.log("Resposta da consulta à base de dados: ");
        console.log("to aqui");
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
    console.log("Parâmetro: " + req.body.idDisciplina);
    //Deve implementar esta funcionalidade...
    const id = req.body.idDisciplina; // faz substring a partir do segundo carater
    dbmySQL
      .cRud_perguntasDisciplina(id) // R: Read
      .then((dados) => {
        res.send(dados);
        // console.log("Dados: " + JSON.stringify(dados)); // para debug
      })
      .catch((err) => {
        return res
          .status(400)
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
  const certa = req.body.respostaCerta;
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

exports.alunosDisciplina = async (req, res) => {
  console.log("Verifica a disciplina que o aluno esta registado");
  if (!req.body) {
    return res.status(400).send({
      message: "O conteúdo não pode ser vazio!",
    });
  }

  const idAluno = req.body.idAluno;

  dbmySQL
  .Crud_alunoDisciplina(idAluno)
  .then((dados) => {
    console.log(dados)
    res.send({dados});
  })
};

exports.allDisciplinas = async (req, res) => {

  dbmySQL
  .Crud_disciplinas()
  .then((dados) => {
    res.send(dados);
  })
}

exports.nameDisciplina_nameProfessor = async (req, res) => {
  const idDisciplina = req.body.idDisciplina;
  dbmySQL
  .Crud_nameDisciplina_nameProfessor(idDisciplina)
  .then((dados) => {
    res.send(dados);
  })
}

exports.alunoName = async (req, res) => {
  const idAluno = req.body.idAluno;
  console.log(`idAluno: ${idAluno}`)
  dbmySQL
  .Crud_alunoName(idAluno)
  .then((dados) => {
    res.send(dados);
  })
}

exports.professorName = async (req, res) => {
  const idProfessor = req.body.idProfessor;
  console.log(`idProfessor: ${idProfessor}`)
  dbmySQL
  .Crud_professorName(idProfessor)
  .then((dados) => {
    res.send(dados);
  })
}

exports.professorDisciplinas = async (req, res) => {
  const idProfessor = req.body.idProfessor;
  console.log(`idProfessor: ${idProfessor}`)
  dbmySQL
  .Crud_professorDisciplinas(idProfessor)
  .then((dados) => {
    res.send(dados);
  })
}

exports.professorCriarDisciplina = async (req, res) => {
  const idProfessor = req.body.idProfessor;
  const nomeDisciplina = req.body.nomeDisciplina;
  dbmySQL
  .Crud_professorCriarDisciplina(idProfessor, nomeDisciplina)
  .then(() => res.send())
}

exports.disciplina = async (req, res) => {
  const idDisciplina = req.body.idDisciplina;
  dbmySQL
  .Crud_disciplina(idDisciplina)
  .then((dados) => {
    res.send(dados);
  })
}

exports.disciplinasAlunos = async (req, res) => {
  const idDisciplina = req.body.idDisciplina;
  dbmySQL
  .Crud_disciplinasAlunos(idDisciplina)
  .then((dados) => res.send(dados))
}

exports.disciplinaArtigos = async (req, res) => {
  const idDisciplina = req.params.id.substr(1);
  dbmySQL
  .Crud_disciplinaArtigos(idDisciplina)
  .then((dados) => res.send(dados))
}

exports.registarLeituraArtigo = async (req, res) => {
  const idAluno = req.body.idAluno;
  const idArtigo = req.body.idArtigo;
  dbmySQL
  .Crud_registarLeituraArtigo(idAluno, idArtigo)
  .then(() => res.send())
}

exports.confirmarLeituraArtigo = async (req, res) => {
  const idAluno = req.body.idAluno;
  const idArtigo = req.body.idArtigo;
  dbmySQL
  .Crud_confirmarLeituraArtigo(idAluno, idArtigo)
  .then((dados) => {
    console.log(dados.length);
    if(dados.length == 0) {
      res.status(200).send();
    }
    else {
      res.status(204).send();
    }
  })
}

exports.progressoDisciplina = async (req, res) => {
  const idDisciplina = req.body.idDisciplina;
  const idAluno = req.body.idAluno;
  dbmySQL
  .Crud_progressoDisciplina(idDisciplina, idAluno)
  .then((dados) => {
    console.log(`controler dados: ${dados}`);
    res.send({progresso: dados});
  })
}

exports.questionarioDisciplina = async (req, res) => {
  const idDisciplina = req.body.idDisciplina;
  const idAluno = req.body.idAluno;
  dbmySQL
  .Crud_questionarioDisciplina(idDisciplina, idAluno)
  .then((dados) => {
    console.log(`controler dados: ${dados}`);
    res.send({questionario: dados});
  });
}

exports.checkQuestionario = async (req, res) => {
  const idAluno = req.body.idAluno;
  const idDisciplina = req.body.idDisciplina;
  const idPergunta1 = req.body.pergunta1;
  const idPergunta2 = req.body.pergunta2;
  const idPergunta3 = req.body.pergunta3;
  const idPergunta4 = req.body.pergunta4;
  const idPergunta5 = req.body.pergunta5;
  const resposta1 = req.body.resposta1;
  const resposta2 = req.body.resposta2;
  const resposta3 = req.body.resposta3;
  const resposta4 = req.body.resposta4;
  const resposta5 = req.body.resposta5;
  dbmySQL.
  Crud_checkQuestionario(idAluno, idDisciplina, idPergunta1, idPergunta2, idPergunta3, idPergunta4, idPergunta5, resposta1, resposta2, resposta3, resposta4, resposta5)
  .then((dados) => {
    res.send(dados);
  })
}