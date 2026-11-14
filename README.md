<div align="center">

# 🎓 Portal de Estudos ADS

**Plataforma pessoal de alta performance para organização, acompanhamento acadêmico, repetição espaçada (SM-2), simulados e projetos da graduação em Análise e Desenvolvimento de Sistemas.**

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Node Test Runner](https://img.shields.io/badge/Node_Test_Runner-Native-339933?style=for-the-badge&logo=node.js&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Automated_Deploy-222222?style=for-the-badge&logo=githubpages&logoColor=white)
![Offline First](https://img.shields.io/badge/Offline-100%25_Local-brightgreen?style=for-the-badge)

[🚀 Acessar Plataforma Online](https://thiagorodrigues07.github.io/portal-estudos-ads/) · [📦 Repositório GitHub](https://github.com/thiagorodrigues07/portal-estudos-ads)

</div>

---

## 📌 Sobre o Projeto

O **Portal de Estudos ADS** é uma aplicação web moderna, arquitetada para ser o centro de comando acadêmico ao longo de toda a graduação em Análise e Desenvolvimento de Sistemas.

Projetada com foco em produtividade, retenção do aprendizado de longo prazo e usabilidade, a plataforma reúne gestão curricular, repetição espaçada inteligente com o consagrado algoritmo **SuperMemo-2 (SM-2)**, ambiente de **simulados internos para Kahoots**, **central de flashcards**, **leitor tipográfico de resumos**, **calendário acadêmico de prazos e provas**, **documentação técnica de código** e **portfólio de projetos**.

A aplicação opera **100% no cliente (client-side)**, garantindo funcionamento offline contínuo, sem dependência de backends proprietários ou custos recorrentes de hospedagem.

---

## ⚡ Principais Módulos e Funcionalidades

### 1. 📊 Dashboard Acadêmico em Tempo Real
- **Métricas Reais de Desempenho:** Contabilização de horas líquidas estudadas via cronômetro de estudo com persistência, percentual de progresso na grade do curso e conteúdos dominados.
- **Gráfico Interativo de Produtividade Semanal:** Visualização da distribuição de dedicação nos últimos 7 dias.
- **Taxa de Precisão em Simulados:** Monitoramento contínuo de acertos em testes e Kahoots.
- **Recomendações Inteligentes:** Sugestões baseadas no histórico real de revisões atrasadas e módulos com menor taxa de acerto.
- **Próximas Avaliações e Prazos:** Alertas dinâmicos de entregas agendadas no calendário acadêmico.

### 2. 🧠 Sistema de Revisão Espaçada (Algoritmo SM-2)
- **Implementação do SuperMemo-2:** Algoritmo científico de retenção mnemônica que recalcula o Fator de Facilidade ($EF$), número de repetições ($n$) e intervalo ($I$) a cada revisão.
- **4 Graus de Avaliação Subjetiva:** `Novamente` (reseta intervalo para 1 dia), `Difícil` ($I=1$ dia, penaliza $EF$), `Bom` (avanço regular) e `Fácil` (avanço acelerado e bonificação de $EF$).
- **Status do Conteúdo:** Classificação em *Em Aprendizado*, *Em Revisão* e *Dominado* (quando o intervalo atinge $\ge 21$ dias).
- **Projeção de Revisões Futuras:** Calendário de carga de revisão para os próximos 7 a 30 dias.

### 3. 🃏 Central de Flashcards
- **Estudo Dinâmico com Efeito 3D:** Cartões interativos com rotação fluida via CSS 3D (`rotateY-180`), exibição de pergunta e revelação de resposta/justificativa.
- **Integração Nativa ao SM-2:** Possibilidade de classificar o desempenho diretamente na sessão de estudo de flashcards.
- **Criação Manual e Geração em 1 Clique:** Criação personalizada ou conversão automática de qualquer questão de Kahoot ou conceito de módulo em novos cartões.
- **Filtros e Favoritos:** Organização por disciplina, termos de busca e lista de cartões prioritários.

### 4. 🎯 Central de Kahoots e Modo Simulado Interno
- **Simulador Interativo:** Resolução de questões diretamente dentro do portal, com alternativas dinâmicas, validação instantânea, gabarito e justificativa pedagógica imediata.
- **Registro Histórico de Tentativas:** Cálculo de aproveitamento percentual, acertos, erros e data de realização.
- **Importador CSV & JSON com Validação:** Detecção preventiva de questões duplicadas (comparação textual insensível a maiúsculas e espaços) e preview antes da gravação.
- **Gestão de Questões (CRUD):** Edição individual de enunciados e remoção granular de perguntas.
- **Fichas Teóricas & Links Externos:** Preservação de resumos conceituais e atalhos diretos para os jogos no Kahoot.it.

### 5. 📖 Biblioteca de Resumos com Leitor Tipográfico
- **Dois Formatos Pedagógicos:**
  - *Visão Completa:* Aprofundamento conceitual estruturado, exemplos práticos e armadilhas comuns.
  - *Visão Simplificada:* Checklist de revisão rápida de 2 minutos para véspera de prova.
- **Controles de Leitura:** Personalização de tamanho de fonte (`Normal`, `Grande`, `Extra Grande`) e espaçamento entre linhas (`Normal`, `Confortável`).
- **Sumário Navegável:** Índice lateral interativo que rola a página suavemente até o tópico selecionado.
- **Modo Impressão Otimizado:** Estilos `@media print` dedicados para exportação limpa em PDF sem poluição de menus ou botões.

### 6. 📅 Planejamento e Calendário Acadêmico
- **Visão em Grade Mensal:** Visualização panorâmica de compromissos com indicadores coloridos por disciplina.
- **Fila Cronológica de Prazos:** Badges de contagem regressiva (`Hoje!`, `Amanhã`, `Em X dias` ou `Venceu`).
- **Classificação por Natureza e Status:** Provas, Trabalhos, Atividades Práticas e Entregas; status em `Pendente`, `Em Andamento` e `Concluído`.

### 7. 💻 Central de Conhecimento Técnico (Notas Rápidas)
- **15 Categorias de Especialização:** Python, Java, JavaScript, HTML, CSS, SQL, Banco de Dados, Git/GitHub, IA & Engenharia de Prompt, Cibersegurança, Redes, Estrutura de Dados e Engenharia de Software.
- **Blocos de Código com Destaque:** Cópia de snippets com 1 clique para a área de transferência.
- **Editor Modal:** Criação e edição de notas técnicas com marcação de tags e favoritos.

### 8. 💼 Portfólio de Projetos da Graduação
- **Documentação de Engenharia:** Cadastro completo com Problema Resolvido, Objetivos, Tecnologias Empregadas, Linguagens, Repositório GitHub, Deploy/Demo e Lições Aprendidas.
- **Filtros por Status:** Em Andamento, Concluído ou Planejado.

### 9. 🛡️ Camada de Persistência, Segurança e Backups
- **Versionamento de Chaves (`portal_ads_v3_`):** Isolamento total e migração transparente a partir de esquemas legados (`v2`).
- **Proteção Contra Corrupção de Dados:** Validação de esquema estrito (`dataSchemas.js`), fallback gracioso contra JSON malformado e interceptação de limites de quota.
- **Rotação Automática de Snapshots:** Gravação automática dos últimos 5 estados do sistema no armazenamento local para reversão instantânea em caso de erro.
- **Exportação e Importação de Backups:** Arquivo `.json` único contendo metadados, timestamp e todas as coleções, com conferência estrutural antes da restauração.

---

## 🏗️ Arquitetura de Software

```text
portal-estudos-ads/
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD: Instalação limpa, testes e deploy automático no Pages
├── src/
│   ├── assets/                   # Recursos estáticos e imagens
│   ├── components/
│   │   ├── common/               # Componentes reutilizáveis (SearchModal, Timer, Cards)
│   │   └── layout/               # Shell da aplicação (Sidebar responsiva, Navbar, Container)
│   ├── context/
│   │   └── StudyContext.jsx      # Hub de estado integrado e compatível
│   ├── data/                     # Dados semente acadêmicos em formato JSON estrito
│   │   ├── disciplinas.json
│   │   ├── faculdade.json
│   │   ├── kahoots.json
│   │   ├── modulos.json
│   │   ├── notas.json
│   │   ├── projetos.json
│   │   └── resumos.json
│   ├── hooks/                    # Hooks modulares desacoplados
│   │   ├── useAcademic.js        # Gestão curricular e progresso de módulos
│   │   ├── useCalendar.js        # Calendário de avaliações e prazos
│   │   ├── useFlashcards.js      # Central de flashcards e baralhos
│   │   ├── useSpacedRepetition.js# Motor do algoritmo SM-2
│   │   └── useStudyTimer.js      # Cronômetro de horas líquidas
│   ├── pages/                    # Telas carregadas sob demanda (Lazy Loading)
│   │   ├── Backup.jsx            # Gestor de snapshots, exportação e restauração
│   │   ├── CalendarioAcademico.jsx# Calendário mensal e cronograma de provas
│   │   ├── Dashboard.jsx         # Painel acadêmico de métricas e recomendações
│   │   ├── Disciplinas.jsx       # Listagem e grade de disciplinas
│   │   ├── Flashcards.jsx        # Estudo interativo em 3D e baralhos
│   │   ├── GerenciadorConteudo.jsx# Auxiliar de geração de conteúdos
│   │   ├── KahootDetalhe.jsx     # Ficha teórica e Modo Simulado Interno
│   │   ├── Kahoots.jsx           # Catálogo e importador de quizzes
│   │   ├── NotasTecnicas.jsx     # Cheatsheets e snippets por linguagem
│   │   ├── Projetos.jsx          # Vitrine de projetos práticos
│   │   ├── ResumoLeitor.jsx      # Leitor com controles tipográficos
│   │   ├── Resumos.jsx           # Catálogo de resumos teóricos
│   │   └── RevisoesHoje.jsx      # Fila diária de repetição espaçada
│   ├── schemas/
│   │   └── dataSchemas.js        # Validação de integridade de entidades
│   ├── services/
│   │   ├── backupService.js      # Validação e exportação de backups
│   │   ├── migrationService.js   # Migração transparente entre versões
│   │   ├── sm2Service.js         # Algoritmo matemático SuperMemo-2
│   │   └── storageService.js     # Persistência com snapshots automáticos
│   ├── App.jsx                   # Roteamento seguro com HashRouter e Suspense
│   ├── main.jsx                  # Ponto de entrada React 18
│   └── index.css                 # Configurações do Tailwind e temas
├── tests/                        # Bateria de testes automatizados (Node Test Runner)
│   ├── backup.test.js
│   ├── dataIntegrity.test.js
│   ├── flashcards.test.js
│   ├── kahoots.test.js
│   ├── sm2.test.js
│   └── storage.test.js
├── package.json
└── vite.config.js
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- **Node.js**: Versão 18 ou superior (recomendado Node 20+)
- **Git**

### Passo a Passo

1. **Clonar o Repositório:**
   ```bash
   git clone https://github.com/thiagorodrigues07/portal-estudos-ads.git
   cd portal-estudos-ads
   ```

2. **Instalar as Dependências:**
   ```bash
   npm ci
   ```

3. **Executar a Suíte de Testes Automatizados:**
   ```bash
   npm test
   ```

4. **Iniciar o Ambiente de Desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a URL informada no terminal (usualmente `http://localhost:5173/portal-estudos-ads/`).

5. **Gerar Build de Produção:**
   ```bash
   npm run build
   ```
   Os artefatos otimizados e minificados serão emitidos na pasta `dist/`.

---

## 🧪 Testes Automatizados e Integridade

O projeto utiliza o **Node Native Test Runner** (`node:test` e `node:assert/strict`), proporcionando testes ultrarrápidos, sem dependências pesadas e com 100% de reproducibilidade tanto em ambientes de desenvolvimento quanto no GitHub Actions.

| Arquivo de Teste | Escopo |
|---|---|
| `tests/sm2.test.js` | Comportamento matemático dos fatores $EF$, intervalos de repetição e graduação dos 4 botões de resposta |
| `tests/storage.test.js` | Persistência local, isolamento de prefixos, merge de dados e rotação de snapshots |
| `tests/backup.test.js` | Validação de esquemas JSON, detecção de arquivos corrompidos e exportação/importação |
| `tests/kahoots.test.js` | Algoritmo de detecção de perguntas duplicadas e cálculo de pontuação no modo simulado |
| `tests/flashcards.test.js` | Conversão automática de quizzes para cartões, filtros por disciplina e favoritos |
| `tests/dataIntegrity.test.js` | Verificação de integridade referencial entre todas as coleções de dados em `src/data/` |

Para rodar todos os testes:
```bash
npm test
```

Para verificar exclusivamente a integridade dos dados JSON:
```bash
npm run verify:data
```

---

## 🌐 Publicação no GitHub Pages (CI/CD)

O pipeline do **GitHub Actions** configurado em `.github/workflows/deploy.yml` executa as seguintes etapas a cada push na branch `main`:

1. Checkout do código-fonte.
2. Setup do Node.js v20.
3. Instalação limpa via `npm ci`.
4. **Execução obrigatória de todos os testes unitários e de integridade (`npm test`).**
5. Compilação da aplicação para produção (`npm run build`).
6. Cópia automática para `dist/404.html` (garantindo roteamento sem falhas no GitHub Pages).
7. Deploy seguro via GitHub Pages Artifacts.

---

## 👨‍💻 Autor

Desenvolvido por **Thiago Rodrigues**.

- **GitHub:** [@thiagorodrigues07](https://github.com/thiagorodrigues07)
- **Projeto:** [Portal de Estudos ADS](https://github.com/thiagorodrigues07/portal-estudos-ads)
