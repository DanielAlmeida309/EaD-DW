const { reject } = require("bcrypt/promises");
const mysql = require("mysql2/promise");
const config = require("../config");

function connect() {
  return new Promise((resolve, reject) => {
    if (!global.connection || global.connection.state == "disconnected") {
      mysql
        .createConnection(config.db)
        .then((connection) => {
          global.connection = connection;
          console.log("Nova conexão ao mySQL");
          resolve(connection);
        })
        .catch((error) => {
          console.log("Erro na ligação ao mySQL:");
          console.log(error);
          reject(error.code);
        });
    } else {
      connection = global.connection;
      resolve(connection);
    }
  });
}

function query(sql, params) {
  return new Promise((resolve, reject) => {
    connect() // Acionado quando fazemos uma query
      .then((conn) => {
        conn
          .execute(sql, params)
          .then(([result]) => {
            console.log("Model: Query");
            console.log(result);
            resolve(result);
          })
          .catch((error) => {
            reject(error.sqlMessage);
          });
      })
      .catch((error) => {
        console.log("Query:");
        console.log(error);
        reject(error);
      });
  });
}

exports.Crud_registarAluno = (email, password, nome, confirmationToken) => {
  // insere um novo utilizador
  return new Promise((resolve, reject) => {
    data = {
      nome: nome,
      email: email,
      pass: password,
      active: 0,
      confirmationToken: confirmationToken,
    };
    query(
      "INSERT INTO Alunos (nome,email,pass,active,confirmationToken) values (?,?,?,?,?)",
      [data.nome, data.email, data.pass, data.active, data.confirmationToken]
    )
      .then((result) => {
        console.log("Model: Registo de utilizador: ");
        console.log(data);
        console.log(result);
        if (result.affectedRows != 1)
          reject("Model: Problema na inserção de novo registo");
        else resolve(result);
      })
      .catch((error) => {
        console.log("Model: Problema no registo:");
        console.log(error);
        reject(error);
      });
  });
};

exports.Crud_registarProfessor = (email, password, nome, confirmationToken) => {
    // insere um novo utilizador
    return new Promise((resolve, reject) => {
        
    data = {
        nome: nome,
        email: email,
        pass: password,
        active: 0,
        confirmationToken: confirmationToken,
    };
    query(
        "INSERT INTO Professores (nome,email,pass,active,confirmationToken) values (?,?,?,?,?)",
        [data.nome, data.email, data.pass, data.active, data.confirmationToken]
    )
    .then((result) => {
      console.log("Model: Registo de utilizador: ");
      console.log(data);
      console.log(result);
      if (result.affectedRows != 1)
        reject("Model: Problema na inserção de novo registo");
      else resolve(result);
    })
    .catch((error) => {
      console.log("Model: Problema no registo:");
      console.log(error);
      reject(error);
    });
});
  };

// Ativa um utilizador (faz um Update)
exports.crUd_ativarAluno = (confirmationToken) => {
  return new Promise((resolve, reject) => {
    query("UPDATE Alunos SET active=? WHERE confirmationToken=?", [
      1,
      confirmationToken,
    ])
      .then((result) => {
        console.log("Model: Ativação de Aluno: ");
        console.log(result);
        if (result.changedRows != 1)
          reject("Model: Problema na ativação de Aluno");
        else resolve(result);
      })
      .catch((error) => {
        console.log("Model: Problema na ativação:");
        console.log(error);
        reject(error);
      });
  });
};

// Ativa um utilizador (faz um Update)
exports.crUd_ativarProfessor = (confirmationToken) => {
    return new Promise((resolve, reject) => {
      query("UPDATE Professores SET active=? WHERE confirmationToken=?", [
        1,
        confirmationToken,
      ])
        .then((result) => {
          console.log("Model: Ativação de Professor: ");
          console.log(result);
          if (result.changedRows != 1)
            reject("Model: Problema na ativação de Professor");
          else resolve(result);
        })
        .catch((error) => {
          console.log("Model: Problema na ativação:");
          console.log(error);
          reject(error);
        });
    });
  };

// Retorna o utilizador e sua password encriptada
exports.cRud_loginAluno = (email) => {
  return new Promise((resolve, reject) => {
    // busca os registos que contêm a chave
    query("SELECT id, email, active, pass from Alunos WHERE email=?", [email])
      .then((result) => {
        user = {};
        Object.keys(result).forEach(function (key) {
          user = result[key];
          console.log(user);
        });
        console.log("Model: Login: ");
        console.log(user);
        if (user.email != email) reject("Utilizador inexistente");
        else resolve(user);
      })
      .catch((error) => {
        console.log("Model: Problema no login:");
        console.log(error);
        reject(error);
      });
  });
};

// Retorna o utilizador e sua password encriptada
exports.cRud_loginProfessor = (email) => {
  return new Promise((resolve, reject) => {
    // busca os registos que contêm a chave
    query("SELECT id, email, active, pass from Professores WHERE email=?", [email])
    .then((result) => {
        user = {};
        Object.keys(result).forEach(function (key) {
          user = result[key];
          console.log(user.email);
        });
        console.log("Model: Login: ");
        console.log(user);
        if (user.email != email) reject("Professor inexistente");
        else resolve(user);
      })
      .catch((error) => {
        console.log("Model: Problema no login:");
        console.log(error);
        reject(error);
      });
  });
};

exports.cRud_all = () => {
  return new Promise((resolve, reject) => {
    // lê todos os registos
    query("SELECT Disciplinas.nome AS 'NomeDisciplina', Professores.nome AS 'NomeProfessor' from Disciplinas, Professores WHERE Disciplinas.idProfessor = Professores.id")
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.cRud_disciplinasProf = (id) => {
  return new Promise((resolve, reject) => {
    // busca os registos que contêm a chave
    query("SELECT * FROM Disciplinas WHERE idProfessor=?", [id])
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.cRud_disciplina = (id) => {
  return new Promise((resolve, reject) => {
    // busca os registos que contêm a chave
    query("SELECT * FROM Disciplinas WHERE id=?", [id])
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.cRud_artigosDisciplina = (id) => {
  return new Promise((resolve, reject) => {
    // busca os registos que contêm a chave
    query("SELECT id, nome FROM Artigos WHERE idDisciplina=?", [id])
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.cRud_perguntasDisciplina = (id) => {
  return new Promise((resolve, reject) => {
    // busca os registos que contêm a chave
    query("SELECT Perguntas.id, Perguntas.pergunta, Pergunta.resposta1, Pergunta.resposta2, Pergunta.resposta3, Pergunta.resposta4, Pergunta.resposta5 FROM Perguntas WHERE idDisciplina=?", [id])
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.cRud_artigosDisciplina = (id) => {
  return new Promise((resolve, reject) => {
    // busca os registos que contêm a chave
    query("SELECT id, nome, assunto FROM Artigos WHERE id=?", [id])
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.cRud_alunosDisciplina = (id) => {
  return new Promise((resolve, reject) => {
    // busca os registos que contêm a chave
    query("SELECT id, nome FROM Artigos WHERE idDisciplina=?", [id])
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.Crud_registarDisciplina = (idProfessor, nome) => {
  // insere uma nova disciplina
  return new Promise((resolve, reject) => {
    data = {
      nome: nome,
      idProfessor: idProfessor
    };
    query(
      "INSERT INTO Disciplinas (idProfessor, nome) values (?,?)",
      [data.idProfessor, data.nome]
    )
      .then((result) => {
        console.log("Model: Registo de disciplina: ");
        console.log(data);
        console.log(result);
        if (result.affectedRows != 1)
          reject("Model: Problema na inserção de novo registo");
        else resolve(result);
      })
      .catch((error) => {
        console.log("Model: Problema no registo:");
        console.log(error);
        reject(error);
      });
  });
};

exports.Crud_registarArtigo = (idDisciplina, nome, assunto) => {
  // insere um novo artigo
  return new Promise((resolve, reject) => {
    data = {
      idDisciplina: idDisciplina,
      nome: nome,
      assunto: assunto
    };
    console.log(`idDisciplina: ${data.idDisciplina}`);
    console.log(`nome: ${data.nome}`);
    console.log(`assunto: ${data.assunto}`);
    query(
      "INSERT INTO Artigos (idDisciplina, nome, assunto) values (?,?,?)",
      [data.idDisciplina, data.nome, data.assunto]
    )
      .then((result) => {
        console.log("Model: Registo de artigos: ");
        console.log(data);
        console.log(result);
        if (result.affectedRows != 1)
          reject("Model: Problema na inserção de novo registo");
        else resolve(result);
      })
      .catch((error) => {
        console.log("Model: Problema no registo:");
        console.log(error);
        reject(error);
      });
  });
};

exports.Crud_registarPergunta = (idDisciplina, pergunta, resposta1, resposta2, resposta3, resposta4, resposta5, certa) => {
  // insere uma nova pergunta
  return new Promise((resolve, reject) => {
    data = {
      idCisciplina: idDisciplina,
      pergunta: pergunta,
      resposta1: resposta1,
      resposta2: resposta2,
      resposta3: resposta3,
      resposta4: resposta4,
      resposta5: resposta5,
      certa: certa
    };
    query(
      "INSERT INTO Perguntas (idDisciplina, pergunta, resposta1, resposta2, resposta3, resposta4, resposta5, certa) values (?,?,?,?,?,?,?,?)",
      [data.idDisciplina, data.pergunta, data.resposta1, data.resposta2, data.resposta3, data.resposta4, data.resposta5, data.certa]
    )
      .then((result) => {
        console.log("Model: Registo de Perguntas: ");
        console.log(data);
        console.log(result);
        if (result.affectedRows != 1)
          reject("Model: Problema na inserção de novo registo");
        else resolve(result);
      })
      .catch((error) => {
        console.log("Model: Problema no registo:");
        console.log(error);
        reject(error);
      });
  });
};

exports.Crud_incricaoDisciplina = (idDisciplina, idAluno) => {
  // insere uma nova inscrição
  return new Promise((resolve, reject) => {
    data = {
      idDisciplina: idDisciplina,
      idAluno: idAluno
    };
    query(
      "INSERT INTO inscricoes (idDisciplina, idAluno) values (?,?)",
      [data.idDisciplina, data.idAluno]
    )
      .then((result) => {
        console.log("Model: Registo de inscrição: ");
        console.log(data);
        console.log(result);
        if (result.affectedRows != 1)
          reject("Model: Problema na inserção de novo registo");
        else resolve(result);
      })
      .catch((error) => {
        console.log("Model: Problema no registo:");
        console.log(error);
        reject(error);
      });
  });
};


exports.Crud_conquistaDisciplina = (idDisciplina, idAluno, notaFinal) => {
  // insere uma nova inscrição
  return new Promise((resolve, reject) => {
    data = {
      idCisciplina: idDisciplina,
      idAluno: idAluno,
      notaFinal: notaFinal
    };
    query(
      "INSERT INTO Conquistas (idDisciplina, idAluno, notaFinal) values (?,?,?)",
      [data.idDisciplina, data.idAluno, data.notaFinal]
    )
      .then((result) => {
        console.log("Model: Registo de conquista: ");
        console.log(data);
        console.log(result);
        if (result.affectedRows != 1)
          reject("Model: Problema na inserção de novo registo");
        else resolve(result);
      })
      .catch((error) => {
        console.log("Model: Problema no registo:");
        console.log(error);
        reject(error);
      });
  });
};

exports.Crud_alunoDisciplina = (idAluno) => {
  console.log(`Dentro do CRUD, idALuno: ${idAluno}`);
  return new Promise((resolve, reject) => {
    query(
      "SELECT idAluno, idDisciplina FROM inscricoes WHERE idAluno = ?",
      [idAluno]
    )
    .then((result) => {
      console.log(`idAluno: ${result.idAluno} idDisciplina: ${result.idDisciplina}`);
      resolve(result);
    })
    .catch((error => reject(error)));
  })
}

exports.Crud_disciplinas = () => {
  return new Promise((resolve, reject) => {
    query(
      "SELECT id, nome FROM disciplinas",
    )
    .then((result) => {
      console.log(result);
      resolve(result);
    })
    .catch((error => reject(error)));
  })
}

exports.Crud_nameDisciplina_nameProfessor = (idDisciplina) => {
  return new Promise((resolve, reject) => {
    query(
      "SELECT disciplinas.nome AS nomeDisciplina, professores.nome AS nomeProfessor FROM disciplinas JOIN professores ON professores.id = disciplinas.idProfessor WHERE disciplinas.id = ?",
      [idDisciplina]
    )
    .then((result) => {
      console.log(result);
      resolve(result);
    })
    .catch((error => reject(error)));
  })
}

exports.Crud_alunoName = (idAluno) => {
  return new Promise((resolve, reject) => {
    query(
      "SELECT nome FROM alunos Where id = ?",
      [idAluno]
    )
    .then((result) => {
      console.log(result);
      resolve(result);
    })
    .catch((error => reject(error)));
  })
}

exports.Crud_professorName = (idProfessor) => {
  return new Promise((resolve, reject) => {
    query(
      "SELECT nome FROM professores Where id = ?",
      [idProfessor]
    )
    .then((result) => {
      console.log(result);
      resolve(result);
    })
    .catch((error => reject(error)));
  })
}

exports.Crud_professorDisciplinas = (idProfessor) => {
  return new Promise((resolve, reject) => {
    query(
      "SELECT * FROM disciplinas Where idProfessor = ?",
      [idProfessor]
    )
    .then((result) => {
      console.log(result);
      resolve(result);
    })
    .catch((error => reject(error)));
  })
}

exports.Crud_professorCriarDisciplina = (idProfessor, nomeDisciplina) => {
  return new Promise((resolve, reject) => {
    query(
      "INSERT INTO Disciplinas (idProfessor, nome) VALUES (?, ?)",
      [idProfessor, nomeDisciplina]
    )
    .then((result) => {
      console.log("Model: Registo de inscrição: ");
      if (result.affectedRows != 1) {        
        reject("Model: Problema na inserção de novo registo");
      }
      else {        
        resolve(result);
      }
    })
    .catch((error) => {
      console.log("Model: Problema no registo:");
      console.log(error);
      reject(error);
    });
  })
}

exports.Crud_disciplina = (idDisciplina) => {
  return new Promise((resolve, reject) => {
    query(
      "SELECT * FROM disciplinas WHERE id = ?",
      [idDisciplina]
    )
    .then((result) => {
      resolve(result);
    })
  })
}

exports.Crud_disciplinasAlunos = (idDisciplina) => {
  console.log(`idDisciplina: ${idDisciplina}`);
  return new Promise((resolve, reject) => {
    query(
      "SELECT alunos.nome, alunos.email FROM alunos JOIN inscricoes ON alunos.id = inscricoes.idAluno WHERE inscricoes.idDisciplina = ?",
      [idDisciplina]
    )
    .then((result) => resolve(result));
  })
}