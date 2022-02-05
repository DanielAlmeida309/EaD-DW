const { reject } = require("bcrypt/promises");
const res = require("express/lib/response");
const mysql = require("mysql2/promise");
const config = require("../config");
const { questionarioDisciplina } = require("../controllers/controller");

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
    query("SELECT id, pergunta, resposta1, resposta2, resposta3, resposta4, resposta5, certa FROM perguntas WHERE idDisciplina=?", [id])
      .then((result) => {
        console.log(result);
        resolve(result);
      })
      .catch((error) => {
        console.log(error);
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
      idDisciplina: idDisciplina,
      pergunta: pergunta,
      resposta1: resposta1,
      resposta2: resposta2,
      resposta3: resposta3,
      resposta4: resposta4,
      resposta5: resposta5,
      certa: certa
    };
    query(
      "INSERT INTO perguntas (idDisciplina, pergunta, resposta1, resposta2, resposta3, resposta4, resposta5, certa) values (?,?,?,?,?,?,?,?)",
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

exports.Crud_disciplinaArtigos = (idDisciplina) => {
  return new Promise((resolve, reject) => {
    query(
      "SELECT * FROM artigos WHERE idDisciplina = ?",
      [idDisciplina]
    )
    .then((result) => resolve(result));
  })
}

exports.Crud_registarLeituraArtigo = (idAluno, idArtigo) => {
  return new Promise((resolve, reject) => {
    query(
      "INSERT INTO alunoartigo (idAluno, idArtigo, visto) VALUES (?,?,?)",
      [idAluno, idArtigo, 1]
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

exports.Crud_confirmarLeituraArtigo = (idAluno, idArtigo) => {
  return new Promise((resolve, reject) => {
    query(
      "SELECT * FROM alunoartigo WHERE idAluno = ? AND idArtigo = ?",
      [idAluno, idArtigo]
    )
    .then((result) => {
      resolve(result)
    })
    .catch((error) => {
      reject(error);
    });
  })
}

exports.Crud_progressoDisciplina = (idDisciplina, idAluno) => {
  return new Promise((resolve, reject) => {
    query(
        "SELECT count(*) FROM alunoartigo WHERE idAluno = ?",
        [idAluno]
    )
    .then((artigosLidos => {      
      query(
        "SELECT count(*) FROM Artigos WHERE idDisciplina = ?",
        [idDisciplina]
      )
      .then((artigosTotais) => {
        console.log(`artigosLidos: ${artigosLidos[0]["count(*)"]}`);
        console.log(`artigosTotais: ${artigosTotais[0]["count(*)"]}`);
        resolve(artigosLidos[0]["count(*)"]/artigosTotais[0]["count(*)"]*100);
      })
    }))
    .catch((error) => {
      reject(error);
    });
  })
}

exports.Crud_questionarioDisciplina = async (idDisciplina, idAluno) => {
  return new Promise((resolve, reject) => {
    query(
        "SELECT id, pergunta, resposta1, resposta2, resposta3, resposta4, resposta5 FROM Perguntas WHERE  idDisciplina = ?",
        [idDisciplina]
      )
      .then( (todasPerguntas => {
        var quests = [];
        var tamanho = todasPerguntas.length-1;
        var listNumbers = [];
        for (let i = 0; listNumbers.length != 5; i++) {
          let num = getRandom(tamanho);
          if(listNumbers.indexOf(num) <= -1) {
            listNumbers.push(num);
          }
        }
        for (let i = 0; i < 5; i++) {
          quests.push(todasPerguntas[listNumbers[i]]);
        }
        console.log("questoes: ", quests);
        console.log("lista de numeros: ", listNumbers);
        resolve(quests);
      }))
    .catch((error) => {
      reject(error);
    });

})};

function getRandom(max) {
  return Math.floor(Math.random() * max + 1)
}

exports.Crud_checkQuestionario = async (idAluno, idDisciplina, idPergunta1, idPergunta2, idPergunta3, idPergunta4, idPergunta5, resposta1, resposta2, resposta3, resposta4, resposta5) => {
  return new Promise((resolve, reject) => {
    var certas = []
    query(
      "SELECT certa FROM perguntas WHERE id = ?",
      [idPergunta1]
    )
    .then(certa1 => {
      certas.pull(certa1);
      query(
        "SELECT certa FROM perguntas WHERE id = ?",
        [idPergunta2]
      )
    })
    .then(certa2 => {
      certas.pull(certa2);
      query(
        "SELECT certa FROM perguntas WHERE id = ?",
        [idPergunta3]
      )
      .then(certa3 => {
        certas.pull(certa3);
        query(
          "SELECT certa FROM perguntas WHERE id = ?",
          [idPergunta4]
        )
        .then(certa4 => {
          certas.pull(certa4);
          query(
            "SELECT certa FROM perguntas WHERE id = ?",
            [idPergunta5]
          )
          .then(certa5 => {
            certas.pull(certa5);
            var point = 0;
            if(certas[0] == resposta1){
              points +=1;
            }
            if(certas[1] == resposta2){
              points +=1;
            }
            if(certas[2] == resposta3){
              points +=1;
            }
            if(certas[3] == resposta4){
              points +=1;
            }
            if(certas[4] == resposta5){
              points +=1;
            }
            if(points >= 3){
              resolve(1);
            }else{
              resolve(0);
            }
          })
        })
      })
    })
})}