const db = require("../models/nedb"); // Define o MODEL que vamos usar
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// REGISTAR - cria um novo utilizador
exports.registar = async (req, res) => {
    console.log("Registar novo utilizador");
    if (!req.body) {
      return res.status(400).send({
        message: "O conteúdo não pode ser vazio!",
      });
    }
    try {
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      const email = req.body.email;
      const password = hashPassword;
      db.Crud_registar(email, password) // C: Create
        .then((dados) => {
          res.status(201).send({ message: "Utilizador criado com sucesso!" });
          console.log("Dados: ");
          console.log(JSON.stringify(dados)); // para debug
        });
    } catch {
      return res.status(400).send({ message: "Problemas ao criar utilizador" });
    }
  };
  
  // LOGIN - autentica um utilizador
  exports.login = async (req, res) => {
    console.log("Autenticação de um utilizador");
    if (!req.body) {
      return res.status(400).send({
        message: "O conteúdo não pode ser vazio!",
      });
    }
    try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      const email = req.body.email;
      const password = hashPassword;
      db.cRud_login(email) //
        .then(async (dados) => {
          if (dados == null) {
            console.log("Não encontrou o utilizador");
            return res.status(401).send({ erro: "Utilizador não encontrado!" });
          }
          if (await bcrypt.compare(req.body.password, dados.password)) {
            const user = { name: email };
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            res.json({ accessToken: accessToken }); // aqui temos de enviar a token de autorização
            console.log("Dados: ");
            console.log(JSON.stringify(dados)); // para debug
          } else {
            console.log("Password incorreta");
            return res.status(401).send({ erro: "A senha não está correta!" });
          }
        });
    } catch {
      return res.status(400).send({ message: dados });
    }
  };


  function authenticateToken(req, res) {
    console.log("A autenticar...");
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
      console.log("Token nula");
      return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.email = user;
    });
  }