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
        result = await response.json();
        console.log(result.accessToken);
        const token = result.accessToken;
        localStorage.setItem("token", token);
        document.getElementById("statusLogin").innerHTML = "Sucesso!";
        document.getElementById("btnLoginClose").click();
        btnModalLogin.style.display = "none";
        btnModalRegistar.style.display = "none";
        // sectionHomepage.style.display = "none";
        document.getElementById("btnLogoff").style.display = "block";
      })
      .catch(async (error) => {
        statLogin.innerHTML = error
      });

  }
}


function alunoPage() {
  const mainTag = document.querySelector("main");

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
    }
  })

  let mainText = `
      <div class="container">            
          <div class="row">
            <div class="col-4 profile">
              <div class="card" style="width: 18rem;">                    
                  <div class="card-body">
                      <h5 class="card-title">Fulano da Silva</h5>
                      <p class="card-text">                            
                          Disciplina Atual: Desenvolvimento Web
                          <br>
                          Professor da Disciplina: Laercio
                      </p>                        
                      <p>Progresso da Disciplina:</p>
                      <div class="progress">
                      <div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>                      
                  </div>
                </div>
            </div>
            <div class="col-8 articles">
                <h2 class="text-center">Articles</h2>
              <ul class="list-group">
                  <li class="list-group-item" >
                      <p data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                          Name of the Article                            
                      </p>
                      
                      <div class="collapse" id="collapseExample">
                          <div class="card card-body">
                              <p>
                                  
                                  Bacon ipsum dolor amet meatloaf ribeye kielbasa, capicola chislic boudin pork belly pig jerky doner venison flank. Pork porchetta brisket cupim landjaeger ham hock tri-tip pork chop picanha bacon meatball salami. Landjaeger bacon frankfurter jowl tri-tip. Fatback frankfurter tongue, capicola short ribs meatloaf pork chop meatball tail hamburger strip steak swine picanha filet mignon pig. Jerky hamburger andouille pancetta short ribs chuck meatloaf chicken buffalo ham hock ribeye meatball.

                                  Ball tip short loin shank landjaeger turducken pork chop bacon doner drumstick picanha pork belly rump beef ham hock tri-tip. Frankfurter sirloin meatloaf buffalo leberkas pork chop. Tail ground round cupim, chuck beef ribs picanha kevin doner ribeye boudin pig tenderloin jowl corned beef shoulder. Prosciutto beef ribs pastrami, chicken buffalo sausage tongue. Spare ribs prosciutto fatback short ribs chuck pancetta frankfurter salami cupim turkey landjaeger. Tail ground round chuck, salami pork chop landjaeger pork shoulder pancetta buffalo.

                                  Kielbasa turkey ham shank porchetta shoulder frankfurter burgdoggen bacon spare ribs fatback drumstick. Tri-tip cow landjaeger, jerky pastrami chuck meatloaf buffalo turducken andouille tenderloin venison boudin. Alcatra kevin pork belly, capicola filet mignon pork loin pork jowl brisket salami corned beef pastrami beef ribs cupim. Drumstick pastrami chislic beef ribs swine bacon t-bone ham hock pancetta meatball buffalo shoulder. Short ribs meatball andouille, pork belly capicola sirloin venison leberkas t-bone meatloaf salami tri-tip fatback jowl. Strip steak ribeye pork loin flank corned beef filet mignon burgdoggen turkey porchetta. Pig venison jowl kielbasa, filet mignon shankle ball tip meatball chicken meatloaf short loin short ribs.

                                  Does your lorem ipsum text long for something a little meatier? Give our generator a try… it’s tasty!
                              </p>
                              <br>
                              <div class="form-check">
                                  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                                  <label class="form-check-label" for="flexCheckDefault">
                                    Artigo lido
                                  </label>
                              </div>
                          </div>
                      </div>
                  </li>
                  <li class="list-group-item" >A second item</li>
                  <li class="list-group-item" >A third item</li>
                  <li class="list-group-item" >A fourth item</li>
                  <li class="list-group-item" >And a fifth one</li>
                  <li class="list-group-item" >An item</li>
                  <li class="list-group-item" >A second item</li>
                  <li class="list-group-item" >A third item</li>
                  <li class="list-group-item" >A fourth item</li>
                  <li class="list-group-item" >And a fifth one</li>
                  <li class="list-group-item" >An item</li>
                  <li class="list-group-item" >A second item</li>
                  <li class="list-group-item" >A third item</li>
                  <li class="list-group-item" >A fourth item</li>
                  <li class="list-group-item" >And a fifth one</li>
                </ul>
            </div>
          </div>
      </div>
  `;

  mainTag.innerHTML = mainText;


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
      <div class="container">           
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
    alunoPage()
  })

}