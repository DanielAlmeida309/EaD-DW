window.onload = () => {
    localStorage.removeItem("token");
    mainPage();
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
const modalQuest = document.getElementById("modalQuest");
const bsModalQuest = new bootstrap.Modal(
  modalQuest,
  (backdrop = "static")
); // Pode passar opções

const btnModalLogin = document.getElementById("btnModalLogin");
const btnModalRegistar = document.getElementById("btnModalRegistar");
const btnLogoff = document.getElementById("btnLogoff");

// const sectionHomepage = document.getElementById("homepage");


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
  // sectionHomepage.style.display = "block";
  btnLogoff.style.display = "none";
  window.location.replace("index.html");
  mainPage();
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
        console.log(result);
        const token = result.accessToken;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", result.user.id);
        document.getElementById("statusLogin").innerHTML = "Sucesso!";
        document.getElementById("btnLoginClose").click();
        btnModalLogin.style.display = "none";
        btnModalRegistar.style.display = "none";
        // sectionHomepage.style.display = "none";
        document.getElementById("btnLogoff").style.display = "block";
        alunoPage();
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
        console.log("opa fion");
        result = await response.json();
        console.log(result);
        const token = result.accessToken;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", result.user.id);
        document.getElementById("statusLogin").innerHTML = "Sucesso!";
        document.getElementById("btnLoginClose").click();
        btnModalLogin.style.display = "none";
        btnModalRegistar.style.display = "none";
        // sectionHomepage.style.display = "none";
        document.getElementById("btnLogoff").style.display = "block";
        professorPage();
      })
      .catch(async (error) => {
        statLogin.innerHTML = error
      });

  }
}

function mainPage() {
  const mainTag = document.querySelector("main");

  let mainText = `
  <section id="homepage">
            <div class="carousel" data-carousel>
                <button class="carousel-button prev" data-carousel-button="prev">
                  &#8656;
                </button>
                <button class="carousel-button next" data-carousel-button="next">
                  &#8658;
                </button>
                <ul data-slides>
                  <li class="slide" data-active>
                    <img
                      src="images/escola-1.png"
                      alt="School1"
                    />
                  </li>
                  <li class="slide">
                    <img
                      src="images/escola-2.jpg"
                      alt="School2"
                    />
                  </li>
                  <li class="slide">
                    <img
                      src="images/escola-3.png"
                      alt="School3"
                    />
                  </li>
                </ul>
            </div>

            <div class="bg-dark text-secondary px-4 py-5 text-center" style="padding-top: 2vh;">
                <div class="py-5">
                  <h1 class="display-5 fw-bold text-white">Dark mode hero</h1>
                  <div class="col-lg-6 mx-auto">
                    <p class="fs-5 mb-4">Quickly design and customize responsive mobile-first sites with Bootstrap, the world’s most popular front-end open source toolkit, featuring Sass variables and mixins, responsive grid system, extensive prebuilt components, and powerful JavaScript plugins.</p>
                    <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
                      <button type="button" class="btn btn-outline-info btn-lg px-4 me-sm-3 fw-bold">Custom button</button>
                      <button type="button" class="btn btn-outline-light btn-lg px-4">Secondary</button>
                    </div>
                  </div>
                </div>
              </div>
        </section>
  `;
  mainTag.innerHTML = mainText;
} 

function alunoPage() {
  fetch(`${urlBase}/aluno/disciplina`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST", // o login não vai criar nada, só ver se o user existe e a pass está correta
    body: `idAluno=${localStorage.userId}`,
  })
  .then(async (response) => {
    result = await response.json();
    console.log(result)
    if(result.dados.length === 0) {
      console.log("carrega pagina de registo na disciplina");
      alunoRegistoDisciplina()
    }
    else {
      console.log("carrega pagina da disciplina");
      alunoPageDisciplina();
    }
  })
  .catch(error => console.log);
}

function alunoPageDisciplina() {
  const mainTag = document.querySelector("main");  
  
  fetch(`${urlBase}/aluno/name`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST", // o login não vai criar nada, só ver se o user existe e a pass está correta
    body: `idAluno=${localStorage.userId}`,
  })
  .then(async (response) => {
    let result = await response.json();
    console.log(result)
    let mainText = `
    <div class="container px-4 py-5" style="margin-top: 5rem;">            
        <div class="row row-cols-1 row-cols-lg-3">
          <div class="col profile">
            <div class="card" style="width: 18rem;">                    
                <div class="card-body">
                    <h5 class="card-title">${result[0].nome}</h5>
    `;
    fetch(`${urlBase}/disciplinas/nameDisciplina_nameProfessor`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST", // o login não vai criar nada, só ver se o user existe e a pass está correta
      body: `idDisciplina=${localStorage.idDisciplina}`,
    })
    .then(async (response) => {
      result = await response.json();
      console.log(result)
      mainText += `     
                      <p class="card-text" value="${result[0].nomeDisciplina}">                            
                          Disciplina Atual: ${result[0].nomeDisciplina}
                          <br>
                          Professor da Disciplina: ${result[0].nomeProfessor}
                      </p>
      `;
      fetch(`${urlBase}/aluno/progressoDisciplina`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST", // o login não vai criar nada, só ver se o user existe e a pass está correta
        body: `idDisciplina=${localStorage.idDisciplina}&idAluno=${localStorage.userId}`,
      })
      .then(async (response) => {
        let result = await response.json();
        console.log(`result: ${result.progresso}`);
        if(result.progresso == 100){
          mainText += `                      
          <p>Progresso da Disciplina:</p>
          <div class="progress">
          <div class="progress-bar" role="progressbar" style="width: ${result.progresso}%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
          </div> 
          <button type="submit" class="btn btn-primary" style="margin-top:2rem; display: block;margin-left: auto;margin-right: auto;" onclick="criarQuestionário(localStorage.userId, localStorage.idDisciplina)">Começar Teste</button>                    
      </div>
    </div>
</div>
<div class="col articles" style="margin-top:3rem;">

</div>
</div>
</div>
`;

        }else{
          mainText += `                      
            <p>Progresso da Disciplina:</p>
            <div class="progress">
              <div class="progress-bar" role="progressbar" style="width: ${result.progresso}%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
            </div>                      
            </div>
            </div>
            </div>
            <div class="col articles" style="margin-top:3rem;">

            </div>
            </div>
            </div>
          `; 
        }
    
        mainTag.innerHTML = mainText;
        alunoListarArtigos(localStorage.idDisciplina);
      })
      
    })
  })
  
}

function alunoRegistoDisciplina() {
  fetch(`${urlBase}/disciplinas`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "GET", // o login não vai criar nada, só ver se o user existe e a pass está correta
    
  })
  .then(async (response) => {
    result = await response.json();
    console.log(result)
    const mainTag = document.querySelector("main");
    let mainText = `
      <div class="container" style="margin-top: 5rem;">           
        <fieldset>
            <legend>Incrição na Disciplina</legend>               
            <div class="mb-3">
                <label for="disciplinaSelect" class="form-label">Escolha a disciplina</label>
                <select id="disciplinaSelect" class="form-select">
    `;

    for(let obj of result) {
      mainText += `<option value="${obj.id}">${obj.nome}</option>`;
    }

    mainText += `
    </select>
            </div>                    
            <button id="btnSelectDisciplina" type="submit" class="btn btn-primary" onclick="inscricaoDisciplina(document.querySelector('#disciplinaSelect').value, localStorage.userId)">Submit</button>
        </fieldset>              
    </div>
    `;
    mainTag.innerHTML = mainText;
  })
  .catch(error => console.log)
}

function alunoListarArtigos(idDisciplina) {
  const insideArticlesTag = document.querySelector(".articles");  
  fetch(`${urlBase}/disciplina/artigos/:${idDisciplina}`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "GET", // o login não vai criar nada, só ver se o user existe e a pass está correta
    
  })
  .then(async (response) => {
    let result = await response.json();
    let insideArticlesText = `
      <h5 class="text-center">Lista de Artigos</h5>  
      <ul class="list-group" style="min-width:40rem; max-width:150rem;">
    `;

    for(let obj of result) {
      insideArticlesText += `
        <li class="list-group-item list-group-item-action" >
          <p data-bs-toggle="collapse" data-bs-target="#collapseArtigo${obj.id}" aria-expanded="false" aria-controls="collapseArtigo${obj.id}">
              ${obj.nome}                           
          </p>
          
          <div class="collapse" id="collapseArtigo${obj.id}">
              <div class="card card-body">
                  <p>${obj.assunto}</p>
      `;
      await fetch(`${urlBase}/aluno/confirmarLeituraArtigo`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST", // o login não vai criar nada, só ver se o user existe e a pass está correta
        body: `idArtigo=${obj.id}&idAluno=${localStorage.userId}`,
      })
      .then((response) => {
        if(response.status == 200) {
          insideArticlesText += `
                  <button type="button" class="btn btn-outline-success btn-sm" value="${obj.id}" onclick="registarLeituraArtigo(this.value, localStorage.userId)">Confirmar Leitura</button>
          `;
        }
        else {
          insideArticlesText += `
          <div class="form-check">
            <input class="form-check-input" type="radio" name="flexRadio${obj.id}" id="flexRadio${obj.id}" checked>
            <label class="form-check-label" for="flexRadioDefault2">
              Artigo lido
            </label>
          </div>
          `;
        }
        insideArticlesText += `
              </div>
          </div>
          
        </li>
        `;
      })
    }

    insideArticlesText += `</ul>`;

    insideArticlesTag.innerHTML = insideArticlesText; 
  })
}

function registarLeituraArtigo(idArtigo, idAluno) {
  fetch(`${urlBase}/aluno/registarLeituraArtigo`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST", // o login não vai criar nada, só ver se o user existe e a pass está correta
    body: `idArtigo=${idArtigo}&idAluno=${idAluno}`,
  })
  .then(() => {
    alunoPage();
  })
}

function inscricaoDisciplina(idDisciplina, idAluno) {
  fetch(`${urlBase}/disciplina/inscricao`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST", // o login não vai criar nada, só ver se o user existe e a pass está correta
    body: `idDisciplina=${idDisciplina}&idAluno=${idAluno}`,
  })
  .then(() => {
    localStorage.setItem("idDisciplina", idDisciplina);
    alunoPage()
  })
  .catch(error => console.log);

}

function professorPage() {
  const mainTag = document.querySelector("main"); 
  fetch(`${urlBase}/professor/name`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST", // o login não vai criar nada, só ver se o user existe e a pass está correta
    body: `idProfessor=${localStorage.userId}`,
  })
  .then(async (response) => {    
    let result = await response.json();
    console.log(result)
    let mainText = `
    <div class="container  px-4 py-5" style="margin-top: 5rem;">            
            <div class="row row-cols-1 row-cols-lg-3">
              <div class="col profile">
                <div class="card" style="width: 18rem;">                    
                    <div class="card-body">
                        <h5 class="card-title">Professor ${result[0].nome}</h5>                        
                        <div class="btn-group-vertical" role="group" aria-label="Basic example">
                            <button type="button" class="btn btn-outline-primary" onclick="professorListarDisciplinas()">Listar Disciplinas</button>
                            <button type="button" class="btn btn-outline-primary" onclick="professorCriarDisciplina()">Criar Nova Disciplinas</button>                            
                          </div>
                    </div>
                  </div>
              </div>
              <div class="col articles" style="margin-top:3rem;">
                  
              </div>
            </div>
        </div>
    `;

    mainTag.innerHTML = mainText;
    professorListarDisciplinas();
  })
}

function professorListarDisciplinas() {
  const articleTag = document.querySelector(".articles");
  fetch(`${urlBase}/professor/disciplinas`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST", // o login não vai criar nada, só ver se o user existe e a pass está correta
    body: `idProfessor=${localStorage.userId}`,
  })
  .then(async (response) => {
    let result = await response.json();
    console.log(result);
    let articleText = `
      <h2 class="text-center">Disciplinas</h2>
        <div class="list-group">
    `;
    
    for(let obj of result) {
      articleText += `<button type="button" class="list-group-item list-group-item-action" value="${obj.id}" onclick="disciplinaPage(this.value)">${obj.nome}</button>`
    }

    articleText += `
      </div>
        </div>
    `;

    articleTag.innerHTML = articleText;
  })
}

function professorCriarDisciplina() {
  const articleTag = document.querySelector(".articles");
  let articleText = `
    <h2 class="text-center">Criar Nova Disciplina</h2>
    <div class="mb-3">
      <label for="inputNomeDisciplina" class="form-label">Nome da Disciplina</label>
      <input type="text" class="form-control" id="inputNomeDisciplina" aria-describedby="emailHelp">                      
    </div>                    
    <button type="submit" class="btn btn-primary" onclick="criarDisciplina(localStorage.userId, document.querySelector('#inputNomeDisciplina').value)">Submit</button>
  `;
  articleTag.innerHTML = articleText;
}

function criarQuestionário(userId, idDisciplina){
  fetch(`${urlBase}/disciplina/questionario`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST", // o login não vai criar nada, só ver se o user existe e a pass está correta
    body: `idAluno=${userId}&idDisciplina=${idDisciplina}`,    
  })
  .then(async (response) => {
    var perguntas = await response.json();
    bsModalQuest.show();
    
    const questModal = document.querySelector(".modalQuestDialog");
    
    var questText = `
    <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id="exampleModalLabel">
        Questionário Final
      </h5>
    </div>
    <div class="modal-body">`;
    for(let i = 0; i<perguntas.questionario.length; i++){

      questText +=`
      <label class="form-label pergunta${i}" value="${perguntas.questionario[i].id}">Pergunta ${i+1}</label><br>
      <label class="form-label">${perguntas.questionario[i].pergunta}</label><br>
      <select multiple class="form-control" id="resposta${i}">
      <option>1-${perguntas.questionario[i].resposta1}</option>
      <option>2-${perguntas.questionario[i].resposta2}</option>
      <option>3-${perguntas.questionario[i].resposta3}</option>
      <option>4-${perguntas.questionario[i].resposta4}</option>
      <option>5-${perguntas.questionario[i].resposta5}</option>
    </select>
    <br>
`;      
    }
    questText += `
    </div>
    <div class="modal-footer d-block">
    <button
      class="btn btn-outline-success float-end"
      id="btnFinishQuest" onclick="verificarQuestionário(getElementById("pergunta1").value,getElementById("pergunta2").value,getElementById("pergunta3").value,getElementById("pergunta4").value,getElementById("pergunta5").value,localStorage.idDisciplina, localstorage.userId, getElementById("resposta1").vaue, getElementById("resposta2").value, getElementById("resposta3").value, getElementById("resposta4").value, getElementById("resposta5").value)"
    >
    Finalizar
    </button>
    `;
    questModal.innerHTML = questText;

  })
  .catch(error => console.log);
}

function verificarQuestionário(pergunta1,pergunta2,pergunta3,pergunta4,pergunta5,idDisciplina, userId, resposta1, resposta2, resposta3, resposta4, resposta5){
  fetch(`${urlBase}/questionario/disciplina`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST", // o login não vai criar nada, só ver se o user existe e a pass está correta
    body: `pergunta1=${pergunta1}&pergunta2=${pergunta2}&pergunta3=${pergunta3}&pergunta4=${pergunta4}&pergunta5=${pergunta5}&idAluno=${userId}&idDisciplina=${idDisciplina}&resposta1=${resposta1}&resposta2=${resposta2}&resposta3=${resposta3}&resposta4=${resposta4}&resposta5=${resposta5}`,
  })
  .then((result) => {
    if(result == 1){
      
    }
  })
  .catch(error => console.log);
}






function criarDisciplina(idProfessor, nomeDisciplina) {
  fetch(`${urlBase}/professor/criarDisciplina`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST", // o login não vai criar nada, só ver se o user existe e a pass está correta
    body: `idProfessor=${idProfessor}&nomeDisciplina=${nomeDisciplina}`,
  })
  .then(() => {
    professorListarDisciplinas();
  })
  .catch(error => console.log);

}

function disciplinaPage(idDisciplina) {  
  const articleTag = document.querySelector(".articles");

  fetch(`${urlBase}/disciplina`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST", // o login não vai criar nada, só ver se o user existe e a pass está correta
    body: `idDisciplina=${idDisciplina}`,
  })
  .then(async (response) => {
    let result = await response.json();
    let articleText = `
      <h2 class="text-center">${result[0].nome}</h2>
      <div class="btn-group" role="group" aria-label="Basic outlined example" style="margin-bottom:2rem;">
        <button type="button" class="btn btn-outline-primary" value="${result[0].id}" onclick="listarAlunos(this.value)">Listar Alunos</button>
        <button type="button" class="btn btn-outline-primary" value="${result[0].id}" onclick="adicionarArtigo(this.value)">Adicionar artigo</button>                    
        <button type="button" class="btn btn-outline-primary" value="${result[0].id}" onclick="listarArtigos(this.value)">Listar artigos</button>
        <button type="button" class="btn btn-outline-primary" value="${result[0].id}" onclick="adicionarPergunta(this.value)">Adicionar pergunta</button>                    
        <button type="button" class="btn btn-outline-primary" value="${result[0].id}" onclick="listarPerguntas(this.value)">Listar perguntas</button>                       
      </div>
      <div class="inside-articles"></div>
    `;
    articleTag.innerHTML = articleText;
  })

  
}

function listarAlunos(idDisciplina) {
  const insideArticlesTag = document.querySelector(".inside-articles");
  fetch(`${urlBase}/disciplina/alunos`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST", // o login não vai criar nada, só ver se o user existe e a pass está correta
    body: `idDisciplina=${idDisciplina}`,
  })
  .then(async (response) => {
    let result = await response.json();
    console.log(result);
    let insideArticlesText = `
      <h5 class="text-center">Lista de Alunos</h5>  
      <ul class="list-group">
    `;

    for(let obj of result) {
      insideArticlesText += `<li class="list-group-item">Nome: ${obj.nome}, Email: ${obj.email} </li>`;
    }

    insideArticlesText += `</ul>`;

    insideArticlesTag.innerHTML = insideArticlesText; 
  })
}

function adicionarArtigo(idDisciplina) {
  const insideArticlesTag = document.querySelector(".inside-articles");
  let insideArticlesText = `
    <h5 class="text-center">Adicionar Artigo</h5>
    <div class="mb-3">
      <label for="inputNomeDisciplina" class="form-label">Nome do Artigo</label>
      <input type="text" class="form-control" id="inputNomeArtigo" aria-describedby="emailHelp">      
      <label for="inputNomeDisciplina" class="form-label">Texto do Artigo</label>
      <textarea type="textarea" class="form-control" id="inputTextoArtigo" aria-describedby="emailHelp"></textarea>                
    </div>                    
    <button type="submit" class="btn btn-primary" value="${idDisciplina}" onclick="criarArtigo(this.value, document.querySelector('#inputNomeArtigo').value, document.querySelector('#inputTextoArtigo').value)">Submit</button>
  `;
  insideArticlesTag.innerHTML = insideArticlesText; 
}

function adicionarPergunta(idDisciplina) {
  const insideArticlesTag = document.querySelector(".inside-articles");
  let insideArticlesText = `
    <h5 class="text-center">Adicionar Artigo</h5>
    <div class="mb-3">
      <label for="inputPergunta" class="form-label">Pergunta</label>
      <input type="text" class="form-control" id="inputPergunta" aria-describedby="emailHelp">

      <label for="inputPergunta" class="form-label">Resposta 1</label>
      <input type="text" class="form-control" id="inputResposta1" aria-describedby="emailHelp"> 

      <label for="inputPergunta" class="form-label">Resposta 2 (obrigatório apenas duas hipóteses)</label>
      <input type="text" class="form-control" id="inputResposta2" aria-describedby="emailHelp"> 

      <label for="inputPergunta" class="form-label">Resposta 3</label>
      <input type="text" class="form-control" id="inputResposta3" aria-describedby="emailHelp">

      <label for="inputPergunta" class="form-label">Resposta 4</label>
      <input type="text" class="form-control" id="inputResposta4" aria-describedby="emailHelp">

      <label for="inputPergunta" class="form-label">Resposta 5</label>
      <input type="text" class="form-control" id="inputResposta5" aria-describedby="emailHelp"> 

      <label for="inputPergunta" class="form-label">Resposta Certa (apenas colocar o número da resposta)</label>
      <input type="text" class="form-control" id="inputRespostaCerta" aria-describedby="emailHelp">

    </div>                    
    <button type="submit" class="btn btn-primary" value="${idDisciplina}" onclick="criarPergunta(this.value, document.querySelector('#inputPergunta').value, document.querySelector('#inputResposta1').value,
    document.querySelector('#inputResposta2').value,
    document.querySelector('#inputResposta3').value,
    document.querySelector('#inputResposta4').value,
    document.querySelector('#inputResposta5').value,
    document.querySelector('#inputRespostaCerta').value)">Submit</button>
  `;
  insideArticlesTag.innerHTML = insideArticlesText; 
}

function criarPergunta(idDisciplina, pergunta, resposta1, resposta2, resposta3, resposta4, resposta5, respostaCerta) {
  fetch(`${urlBase}/disciplina/perguntas`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST", // o login não vai criar nada, só ver se o user existe e a pass está correta
    body: `idDisciplina=${idDisciplina}&pergunta=${pergunta}&resposta1=${resposta1}&resposta2=${resposta2}&resposta3=${resposta3}&resposta4=${resposta4}&resposta5=${resposta5}&respostaCerta=${respostaCerta}`,
  })
  .then((response) => {
    console.log(response.message);
    listarPerguntas(idDisciplina);
  })
}

function criarArtigo(idDisciplina, nome, texto) {
  fetch(`${urlBase}/registarArtigo`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST", // o login não vai criar nada, só ver se o user existe e a pass está correta
    body: `idDisciplina=${idDisciplina}&nome=${nome}&assunto=${texto}`,
  })
  .then((response) => {
    console.log(response.message);
    listarArtigos(idDisciplina)
  })
}

function listarPerguntas(idDisciplina) {
  const insideArticlesTag = document.querySelector(".inside-articles");
  fetch(`${urlBase}/perguntas/disciplina`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST", // o login não vai criar nada, só ver se o user existe e a pass está correta
    body: `idDisciplina=${idDisciplina}`,
  })
  .then(async (response) => {
    let result = await response.json();
    console.log("resultado: ", result);
    let insideArticlesText = `
      <h5 class="text-center">Lista de Perguntas</h5>  
      <ul class="list-group">
    `;

    for(let obj of result) {
      console.log("este é o objeto:",obj);
      insideArticlesText += `
        <li class="list-group-item list-group-item-action" >
          <p data-bs-toggle="collapse" data-bs-target="#collapseArtigo${obj.id}" aria-expanded="false" aria-controls="collapseArtigo${obj.id}">
              ${obj.pergunta}                           
          </p>
          
          <div class="collapse" id="collapseArtigo${obj.id}">
              <div class="card card-body">
                  <p>Resposta1: ${obj.resposta1}</p>
                  <p>Resposta2: ${obj.resposta2}</p>
                  <p>Resposta3: ${obj.resposta3}</p>
                  <p>Resposta4: ${obj.resposta4}</p>
                  <p>Resposta5: ${obj.resposta5}</p>
                  <p>Resposta certa: ${obj.certa}</p>

                  </div>
          </div>
        </li>
      `;
    }

    insideArticlesText += `</ul>`;

    insideArticlesTag.innerHTML = insideArticlesText; 
  })
}

function listarArtigos(idDisciplina) {
  const insideArticlesTag = document.querySelector(".inside-articles");
  fetch(`${urlBase}/disciplina/artigos/:${idDisciplina}`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "GET", // o login não vai criar nada, só ver se o user existe e a pass está correta
    
  })
  .then(async (response) => {
    let result = await response.json();
    let insideArticlesText = `
      <h5 class="text-center">Lista de Artigos</h5>  
      <ul class="list-group">
    `;

    for(let obj of result) {
      insideArticlesText += `
        <li class="list-group-item list-group-item-action" >
          <p data-bs-toggle="collapse" data-bs-target="#collapseArtigo${obj.id}" aria-expanded="false" aria-controls="collapseArtigo${obj.id}">
              ${obj.nome}                           
          </p>
          
          <div class="collapse" id="collapseArtigo${obj.id}">
              <div class="card card-body">
                  <p>${obj.assunto}</p>
              </div>
          </div>
        </li>
      `;
    }

    insideArticlesText += `</ul>`;

    insideArticlesTag.innerHTML = insideArticlesText; 
  })
}