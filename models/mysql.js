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
    query("SELECT email, active, pass from Alunos WHERE email=?", [email])
      .then((result) => {
        user = {};
        Object.keys(result).forEach(function (key) {
          user = result[key];
          console.log(user.email);
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
    query("SELECT email, active, pass from Professores WHERE email=?", [email])
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





