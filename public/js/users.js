window.onload = () => {
    localStorage.removeItem("token");
};
const urlBase = "https://localhost:8888/api";
const modalLogin = document.getElementById("modalLogin");
const bsModalLogin = new bootstrap.Modal(
  modalLogin,
  (backdrop = "static")
); // Pode passar opções
const modalRegistar = document.getElementById("modalRegistar");
const bsModalRegistar = new bootstrap.Modal(
  modalRegistar,
  (backdrop = "static")
); // Pode passar opções

const btnModalLogin = document.getElementById("btnModalLogin");
const btnModalRegistar = document.getElementById("btnModalRegistar");
const btnLogoff = document.getElementById("btnLogoff");

const sectionHomepage = document.getElementById("homepage");


modalLogin.addEventListener("shown.bs.modal", () => {
  document.getElementById("usernameLogin").focus();
});
btnModalLogin.addEventListener("click", () => {
  bsModalLogin.show();
});
btnModalRegistar.addEventListener("click", () => {
  bsModalRegistar.show();
});
function tradeModal(){
    bsModalLogin.hide();
    bsModalRegistar.show();
};

btnLogoff.addEventListener("click", () => {
  localStorage.removeItem("token");
  btnModalLogin.style.display = "block";
  btnModalRegistar.style.display = "block";
  sectionHomepage.style.display = "block";
  btnLogoff.style.display = "none";
  window.location.replace("index.html");
});

function validaRegisto() {
  let nome = document.getElementById("nomeRegistar").value;
  let email = document.getElementById("usernameRegistar").value; // email é validado pelo próprio browser
  let senha = document.getElementById("senhaRegistar").value; // tem de ter uma senha
  let tipoConta = document.getElementById("tipoContaRegistar").value;
  const statReg = document.getElementById("statusRegistar");
  if (senha.length < 4) {
    document.getElementById("passErroLogin").innerHTML =
      "A senha tem de ter ao menos 4 carateres";
    return;
  }
  if (nome.length == 0) {
    document.getElementById("nomeErroLoginRegistar").innerHTML =
      "Têm de inserir o seu nome.";
    return;    
  }
  console.log(tipoConta);
  if(tipoConta == "Aluno"){
    console.log("entra");
    fetch(`${urlBase}/registarAluno`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: `nome=${nome}&email=${email}&password=${senha}`,
    })
      .then(async (response) => {
        if (!response.ok) {
          erro = response.statusText;
          statReg.innerHTML = response.statusText;
          throw new Error(erro);
        }
        result = await response.json();
        console.log(result.message);
        statReg.innerHTML = result.message;
      })
      .catch((error) => {
        document.getElementById(
          "statusRegistar"
        ).innerHTML = `Pedido falhado: ${error}`;
      });

  }else if(tipoConta == "Professor"){

    fetch(`${urlBase}/registarProfessor`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: `nome=${nome}&email=${email}&password=${senha}`,
    })
      .then(async (response) => {
        if (!response.ok) {
          erro = response.statusText;
          statReg.innerHTML = response.statusText;
          throw new Error(erro);
        }
        result = await response.json();
        console.log(result.message);
        statReg.innerHTML = result.message;
      })
      .catch((error) => {
        document.getElementById(
          "statusRegistar"
        ).innerHTML = `Pedido falhado: ${error}`;
      });
  }
}

function validaLogin() {
  let email = document.getElementById("usernameLogin").value; // email é validado pelo próprio browser
  let senha = document.getElementById("senhaLogin").value; // tem de ter uma senha
  let tipoConta = document.getElementById("tipoContaLogin").value;
  if (senha.length < 4) {
    document.getElementById("passErroLogin").innerHTML =
      "A senha tem de ter ao menos 4 carateres";
    return;
  }
  const statLogin = document.getElementById("statusLogin");
  
  if(tipoConta == "Aluno"){
    
    fetch(`${urlBase}/loginAluno`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST", // o login não vai criar nada, só ver se o user existe e a pass está correta
      body: `email=${email}&password=${senha}`,
    })
      .then(async (response) => {
        if (!response.ok) {
          erro = await(response.json())
          throw new Error(erro.msg);
        }
        result = await response.json();
        console.log(result.accessToken);
        const token = result.accessToken;
        localStorage.setItem("token", token);
        document.getElementById("statusLogin").innerHTML = "Sucesso!";
        document.getElementById("btnLoginClose").click();
        btnModalLogin.style.display = "none";
        btnModalRegistar.style.display = "none";
        sectionHomepage.style.display = "none";
        document.getElementById("btnLogoff").style.display = "block";
      })
      .catch(async (error) => {
        statLogin.innerHTML = error
      });

  }else if(tipoConta == "Professor"){

    fetch(`${urlBase}/loginProfessor`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST", // o login não vai criar nada, só ver se o user existe e a pass está correta
      body: `email=${email}&password=${senha}`,
    })
      .then(async (response) => {
        if (!response.ok) {
          erro = await(response.json())
          throw new Error(erro.msg);
        }
        result = await response.json();
        console.log(result.accessToken);
        const token = result.accessToken;
        localStorage.setItem("token", token);
        document.getElementById("statusLogin").innerHTML = "Sucesso!";
        document.getElementById("btnLoginClose").click();
        btnModalLogin.style.display = "none";
        btnModalRegistar.style.display = "none";
        sectionHomepage.style.display = "none";
        document.getElementById("btnLogoff").style.display = "block";
      })
      .catch(async (error) => {
        statLogin.innerHTML = error
      });

  }
}



  