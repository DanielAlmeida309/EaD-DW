CREATE TABLE Alunos(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome char(20) NOT NULL,
    email varchar(50) NOT NULL UNIQUE,
    pass varchar(150)  NOT NULL,
    active BOOLEAN NOT NULL DEFAULT FALSE,
    confirmationToken varchar(256) NOT NULL
);

CREATE TABLE Professores(
    id int PRIMARY KEY AUTO_INCREMENT,
    nome char(20) NOT NULL,
    email varchar(50) NOT NULL UNIQUE,
    pass varchar(150)  NOT NULL,
    active BOOLEAN NOT NULL DEFAULT FALSE,
    confirmationToken varchar(256) NOT NULL
);

CREATE TABLE Disciplinas(
    id int PRIMARY KEY AUTO_INCREMENT,
    idProfessor int NOT NULL,
    nome varchar(50) NOT NULL,
    CONSTRAINT fk_DisciplinaProfessor FOREIGN KEY (idProfessor) REFERENCES Professores (id)
);

CREATE TABLE Artigos(
    id int PRIMARY KEY AUTO_INCREMENT,
    idDisciplina int NOT NULL,
    nome varchar(50) NOT NULL,
    assunto MEDIUMTEXT NOT NULL,
    CONSTRAINT fk_ArtigoDisciplina FOREIGN KEY (idDisciplina) REFERENCES Disciplinas (id)
);


CREATE TABLE AlunoArtigo(
    idAluno int,
    idArtigo int,
    visto boolean,
    PRIMARY KEY (idAluno, idArtigo),
    CONSTRAINT fk_ArtAluno FOREIGN KEY (idAluno) REFERENCES Alunos (id),
    CONSTRAINT fk_ArtArtigo2 FOREIGN KEY (idArtigo) REFERENCES Artigos (id)
);

CREATE TABLE Perguntas(
    id int PRIMARY KEY AUTO_INCREMENT,
    pergunta varchar(150),
    resposta1 varchar(150) NOT NULL,
    resposta2 varchar(150) NOT NULL,
    resposta3 varchar(150),
    resposta4 varchar(150),
    resposta5 varchar(150),
    certa int,
    idDisciplina int NOT NULL,
    CONSTRAINT fk_PerguntaDisciplina FOREIGN KEY (idDisciplina) REFERENCES Disciplinas (id)
);

CREATE TABLE Inscricoes(
    idAluno int,
    idDisciplina int,
    PRIMARY KEY(idAluno, idDisciplina),
    CONSTRAINT fk_InscricaoAluno FOREIGN KEY (idAluno) REFERENCES Alunos (id),
    CONSTRAINT fk_InscricaoDisciplina FOREIGN KEY (idDisciplina) REFERENCES Disciplinas (id)
);

CREATE TABLE Conquistas(
    idAluno int,
    idDisciplina int,
    notaFinal float,
    PRIMARY KEY(idAluno, idDisciplina),
    CONSTRAINT fk_ConquistasAluno FOREIGN KEY (idAluno) REFERENCES Alunos (id),
    CONSTRAINT fk_ConquistasDisciplina FOREIGN KEY (idDisciplina) REFERENCES Disciplinas (id)    
);