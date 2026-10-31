<div align="center">

# Portal de Estudos ADS

**Plataforma pessoal para organizar disciplinas, resumos, revisões, quizzes e projetos da graduação em Análise e Desenvolvimento de Sistemas.**

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Publicação-222222?style=for-the-badge&logo=githubpages&logoColor=white)

[Repositório](https://github.com/thiagorodrigues07/portal-estudos-ads)
[Visualizar plataforma](https://thiagorodrigues07.github.io/portal-estudos-ads/)

</div>

## Sobre o projeto

O **Portal de Estudos ADS** é uma aplicação web desenvolvida para centralizar a organização e a revisão dos conteúdos da graduação em Análise e Desenvolvimento de Sistemas.

A plataforma reúne disciplinas, módulos de aprendizagem, resumos, quizzes do Kahoot, projetos acadêmicos e anotações técnicas em um único ambiente. A estrutura orientada a dados facilita a atualização dos materiais sem exigir alterações constantes nos componentes da aplicação.

## Funcionalidades

- **Dashboard:** visão geral do ambiente de estudos.
- **Disciplinas e módulos:** organização dos conteúdos por matéria e etapa de aprendizagem.
- **Biblioteca de resumos:** consulta de materiais teóricos, conceitos-chave e exemplos.
- **Central de Kahoots:** organização de quizzes, questões, respostas e explicações.
- **Projetos:** documentação dos trabalhos e exercícios desenvolvidos.
- **Notas técnicas:** referências rápidas e snippets de programação.
- **Busca global:** localização de conteúdos pelo atalho `Ctrl + K`.
- **Tema claro e escuro:** alternância de aparência.
- **Favoritos e acompanhamento:** recursos de organização e revisão.
- **Impressão e exportação:** preparação de resumos para impressão ou geração de PDF pelo navegador.
- **Gerenciamento de conteúdo:** apoio visual para estruturar novos dados em JSON.

## Tecnologias utilizadas

| Tecnologia | Utilização |
|---|---|
| React 18 | Construção da interface por componentes |
| Vite 6 | Servidor de desenvolvimento e build |
| Tailwind CSS 3 | Estilização e responsividade |
| React Router 6 | Navegação com `HashRouter` |
| Lucide React | Ícones da interface |
| JavaScript | Lógica da aplicação |
| JSON | Organização dos conteúdos acadêmicos |
| GitHub Actions | Automação da publicação no GitHub Pages |

## Estrutura do projeto

```text
portal-estudos-ads/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
│   ├── components/
│   │   ├── common/
│   │   └── layout/
│   ├── context/
│   │   └── StudyContext.jsx
│   ├── data/
│   │   ├── faculdade.json
│   │   ├── disciplinas.json
│   │   ├── modulos.json
│   │   ├── resumos.json
│   │   ├── kahoots.json
│   │   ├── projetos.json
│   │   └── notas.json
│   ├── pages/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## Como executar localmente

### Pré-requisitos

- Node.js 18 ou superior
- npm
- Git

### 1. Clone o repositório

```bash
git clone https://github.com/thiagorodrigues07/portal-estudos-ads.git
cd portal-estudos-ads
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O Vite exibirá no terminal o endereço local. Por padrão, normalmente é `http://localhost:5173`.

## Build de produção

Para gerar os arquivos otimizados:

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`.

Para visualizar localmente a versão de produção:

```bash
npm run preview
```

## Publicação no GitHub Pages

O repositório inclui um workflow em `.github/workflows/deploy.yml` para automatizar a publicação.

1. Acesse **Settings → Pages** no repositório.
2. Em **Build and deployment**, selecione **GitHub Actions** como fonte.
3. Envie as alterações para a branch configurada no workflow.
4. Acompanhe a execução na aba **Actions**.

A versão publicada está disponível em:

[https://thiagorodrigues07.github.io/portal-estudos-ads/](https://thiagorodrigues07.github.io/portal-estudos-ads/)

## Atualização dos conteúdos

Os materiais acadêmicos ficam organizados em arquivos JSON dentro de `src/data/`.

Para incluir ou atualizar uma disciplina, resumo, quiz ou anotação:

1. Localize o arquivo JSON correspondente.
2. Adicione ou edite os dados seguindo a estrutura dos itens existentes.
3. Salve as alterações.
4. Execute o projeto localmente para validar o conteúdo.
5. Faça commit e envie as alterações ao GitHub.

Exemplo de fluxo Git:

```bash
git add src/data/
git commit -m "docs: atualiza materiais de estudo"
git push origin main
```

## Objetivos técnicos

- Desenvolver uma aplicação React com componentes reutilizáveis.
- Separar conteúdo acadêmico da lógica de apresentação.
- Trabalhar com roteamento no front-end.
- Criar uma interface responsiva e com temas.
- Organizar estado compartilhado com Context API.
- Automatizar build e publicação com GitHub Actions.

## Autor

**Thiago Rodrigues** · [GitHub](https://github.com/thiagorodrigues07)
