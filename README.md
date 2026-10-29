# Plataforma Pessoal de Estudos — ADS (Análise e Desenvolvimento de Sistemas)

Ambiente acadêmico pessoal desenvolvido para centralizar, organizar e revisar os conteúdos da graduação em **Análise e Desenvolvimento de Sistemas** na **Universidade Cruzeiro do Sul** (Período Noturno • Previsão de Conclusão: 2027).

---

## 🎯 Principais Objetivos do Projeto

- **Organização Modular**: Acompanhar as disciplinas por semestre e módulos de aprendizagem.
- **Central de Kahoots**: Metodologia pedagógica pré-quiz com leitura de resumos, conceitos-chave, pegadinhas e gabarito consultável antes de abrir o quiz no Kahoot.
- **Biblioteca de Resumos**: Leitor de resumos focado em legibilidade prolongada com opção de exportação para PDF e impressão limpa via navegador.
- **Portfólio de Projetos**: Documentação técnica de softwares e exercícios desenvolvidos ao longo do curso.
- **Caderno de Notas Técnicas**: Snippets e referências rápidas para Git, JavaScript, Python, SQL, IA, etc.
- **Busca Global Instantânea**: Pesquisa em toda a plataforma através do atalho `Ctrl + K`.
- **Tema Claro / Escuro**: Modo noturno ergonômico com persistência de preferências no navegador (`localStorage`).
- **Deploy Estático no GitHub Pages**: Hospedagem 100% gratuita sem necessidade de servidor backend.

---

## 🛠️ Tecnologias Utilizadas

- **React 18**: Componentização modular e reatividade no cliente.
- **Vite 6**: Ferramenta de build de alta performance e servidor local ultrarrápido.
- **Tailwind CSS 3**: Sistema de design moderno, responsivo e suporte nativo a Dark Mode via classe `dark`.
- **React Router 6 (HashRouter)**: Roteamento no cliente compatível com o GitHub Pages sem erros 404 em recarregamento.
- **Lucide React**: Biblioteca de ícones moderna e leve.
- **GitHub Actions**: Pipeline de integração contínua (CI/CD) para publicação automatizada no GitHub Pages.

---

## 📁 Estrutura do Projeto

```text
├── .github/workflows/deploy.yml   # Workflow de publicação no GitHub Pages
├── src/
│   ├── components/
│   │   ├── common/                # Badges, CodeBlocks, Busca Global (Ctrl+K), EmptyStates
│   │   └── layout/                # Sidebar retrátil, Header, Layout base
│   ├── context/
│   │   └── StudyContext.jsx       # Gerenciamento de tema, favoritos, progresso e revisões
│   ├── data/                      # Base de dados acadêmicos em formato JSON desacoplado
│   │   ├── faculdade.json         # Dados da Cruzeiro do Sul, semestre e grade
│   │   ├── disciplinas.json       # Disciplinas cadastradas (as 3 atuais e futuras)
│   │   ├── modulos.json           # Módulos com resumos teóricos, código e pegadinhas
│   │   ├── resumos.json           # Resumos teóricos detalhados e tags
│   │   ├── kahoots.json           # Quizzes com questões, gabaritos e preparação
│   │   ├── projetos.json          # Portfólio prático com links e documentação
│   │   └── notas.json             # Anotações rápidas categorizadas
│   ├── pages/                     # Telas completas da aplicação
│   │   ├── Dashboard.jsx
│   │   ├── Faculdade.jsx
│   │   ├── Disciplinas.jsx
│   │   ├── DisciplinaDetalhe.jsx
│   │   ├── Resumos.jsx
│   │   ├── ResumoLeitor.jsx
│   │   ├── Kahoots.jsx
│   │   ├── KahootDetalhe.jsx
│   │   ├── Projetos.jsx
│   │   ├── ProjetoDetalhe.jsx
│   │   ├── NotasTecnicas.jsx
│   │   └── GerenciadorConteudo.jsx # Gerador visual de JSON
│   ├── App.jsx                    # Configuração de rotas HashRouter
│   ├── main.jsx                   # Ponto de entrada React
│   └── index.css                  # Tailwind CSS e regras de impressão (@media print)
├── vite.config.js                 # Base relativa ('./') para GitHub Pages
└── package.json
```

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- **Node.js** (versão 18 ou superior instalada)
- **Git**

### Passo a passo:
```bash
# 1. Clone ou acesse a pasta do repositório
cd portal-estudos-ads

# 2. Instale as dependências (caso ainda não tenha instalado)
npm install

# 3. Inicie o servidor de desenvolvimento local
npm run dev
```

Acesse `http://localhost:3000` no seu navegador. O site recarregará automaticamente a cada alteração salva nos arquivos.

---

## 📦 Como Gerar a Versão de Produção e Testar

```bash
# Gera os arquivos estáticos otimizados na pasta dist/
npm run build

# Executa uma simulação local da versão de produção
npm run preview
```

---

## 🌐 Passo a Passo para Publicar no GitHub Pages

O projeto já inclui o arquivo `.github/workflows/deploy.yml` pronto para realizar o deploy automático.

1. **Crie um repositório no seu GitHub** (por exemplo: `portal-estudos-ads`).
2. **Suba seus arquivos para o GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: plataforma pessoal de estudos ADS"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   git push -u origin main
   ```
3. **Ative o GitHub Pages**:
   - No GitHub, acesse a aba **Settings** do seu repositório.
   - No menu lateral esquerdo, clique em **Pages**.
   - Em **Build and deployment > Source**, selecione a opção **GitHub Actions**.
4. O GitHub executará a automação e em menos de 2 minutos seu site estará acessível publicamente em:
   `https://SEU_USUARIO.github.io/SEU_REPOSITORIO/`

---

## ✍️ Como Adicionar Novas Disciplinas e Conteúdos

Você pode adicionar novos conteúdos durante toda a graduação (até 2027) sem precisar mexer em nenhum código JavaScript ou CSS:

### Opção 1: Pela própria interface (Recomendado)
1. Inicie o site localmente (`npm run dev`) ou acesse seu site publicado.
2. Acesse a aba **Novo Conteúdo (JSON)** no menu lateral.
3. Preencha o formulário visual com os dados da matéria ou do Kahoot.
4. Clique em **Copiar JSON**.
5. Abra o arquivo correspondente na pasta `src/data/` (ex: `disciplinas.json` ou `kahoots.json`), cole o novo bloco e salve.

### Opção 2: Importação de Questões de Kahoot por CSV
Na página **Central de Kahoots**, clique em **Importar Questões (JSON / CSV)** e cole uma tabela no formato:
```text
Pergunta;RespostaCorreta;Explicacao
O que é variável?;Espaço de memória;Aloca dados dinâmicos em tempo de execução.
```

Depois de editar os arquivos em `src/data/`, basta salvar no Git:
```bash
git add src/data/
git commit -m "docs: adiciona resumos do novo módulo"
git push origin main
```
O GitHub Actions atualizará o site publicado automaticamente!
