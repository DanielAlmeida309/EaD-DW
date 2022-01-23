const Datastore = require("nedb");
let db = {};
db.users = new Datastore("users.db");
db.users.loadDatabase();



// Retorna o utilizador e sua password encriptada
exports.cRud_login = (email) => {
  return new Promise((resolve, reject) => {
    // busca os registos que contêm a chave
    db.users.findOne(
      {
        email: email,
      },
      (err, dados) => {
        if (err) {
          reject("Utilizador não encontrado!");
        } else {
          resolve(dados);
        }
      }
    );
  });
};

exports.Crud_registar = (email, password) => {
  // insere um novo utilizador
  return new Promise((resolve, reject) => {
    data = { email: email, password: password };
    db.users.insert(data, (err, dados) => {
      if (err) {
        reject(null);
      } else {
        resolve(dados);
      }
    });
  });
};
