# Monet

O **Monet** é um bot desenvolvido para monitorar o status de dispositivos de rede (SWITCH e ATA) em diversas filiais. Ele utiliza o Discord para enviar notificações em tempo real quando uma filial fica offline, permitindo que os técnicos responsáveis tomem as medidas necessárias para resolver o problema.

## Funcionalidades

- **Monitoramento em Tempo Real**: Faz ping nos IPs dos dispositivos de rede (SWITCH e ATA) a cada 1 minuto.
- **Notificações no Discord**:
  - Envia alertas para um canal específico quando uma filial fica offline.
  - Notifica os técnicos responsáveis por DM (mensagem direta) com informações detalhadas.
- **Integração com WhatsApp**:
  - Inclui um botão para contatar o gerente da filial via WhatsApp diretamente do Discord.
- **Registro de Downtimes**:
  - Armazena o histórico de quedas e recuperações no banco de dados PostgreSQL.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **TypeScript**: Linguagem de programação para desenvolvimento seguro e escalável.
- **Discord.js**: Biblioteca para interagir com a API do Discord.
- **PostgreSQL**: Banco de dados para armazenar informações das filiais, técnicos e downtimes.
- **Drizzle ORM**: ORM para gerenciar o banco de dados de forma eficiente.
- **Ping**: Biblioteca para verificar a conectividade dos dispositivos de rede.

## Configuração

### Pré-requisitos

- Node.js (v18 ou superior)
- PostgreSQL (ou um banco de dados gerenciado, como Neon.tech)
- Conta no Discord com permissão para criar um bot.

### Passos para Configuração

1. **Clone o Repositório**:
   ```bash
   git clone https://github.com/Paulo-Borszcz/monet.git
   cd monitor-de-filiais
   ```
2. **Instale as Dependências**:
   ```bash
   pnpm install
   ```
3. **Configure o Ambiente**:
   Preencha o arquivo `.env` com as variáveis necessários, conforme o ``.env.example`
4. **Execute as Migrações**:
   ```bash
   npx drizzle-kit generate:pg --config drizzle.config.ts
   npx drizzle-kit up:pg --config drizzle.config.ts
   ```
5. **Inicie o Bot**:
   ```bash
   pnpm start
   ```

## Como usar?

### Comandos do Bot

1. **/registrar-tecnico:** Registra um técnico responsável.
2. **/adicionar-range:** Adiciona um range de responsabilidade para um técnico.
3. **/listar-ranges:** Lista os ranges de responsabilidade de um técnico.

### Notificações

Quando uma filial fica offline, o bot envia:
- Um **embed simplificado** no canal de notificações.
- Um **embed detalhado** na DM do técnico responsável, com um botão para contatar o gerente via WhatsApp.

Quando a filial volta ao normal, o bot envia uma notificação de recuperação.

## Estrutura do Projeto
```
.
├── src
│   ├── bot
│   │   ├── commands/          # Comandos do bot
│   │   └── utils/             # Utilitários (embeds, notificações)
│   ├── db
│   │   ├── schema.ts         # Schema do banco de dados
│   │   ├── connection.ts     # Conexão com o Banco de Dados
│   │   └── migrations/        # Migrações geradas
│   ├── services
│   │   ├── monitor.ts        # Serviço de monitoramento
│   │   └── alerts.ts         # Lógica de notificações
│   └── index.ts              # Entry point do bot
├── .env                      # Variáveis de ambiente
├── drizzle.config.ts         # Configuração do Drizzle ORM
├── package.json              # Dependências do projeto
├── tsconfig.json             # TypeScript
└── README.md                 # Documentação do projeto
```
