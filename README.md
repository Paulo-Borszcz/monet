# Monet

Um bot de monitoramento de redes para Discord que verifica a conectividade de filiais, notifica sobre problemas e facilita a resposta a incidentes.

![Status](https://img.shields.io/badge/status-active-success.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.8-blue.svg)
![Discord.js](https://img.shields.io/badge/Discord.js-v14-7289da.svg)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-v0.29-orange.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v3.4-blue.svg)

## 📋 Recursos

- **Monitoramento em tempo real**: Verifica a conectividade de IPs de Switch e ATA em múltiplas filiais
- **Alertas automatizados**: Notificações imediatas no Discord quando uma filial fica offline
- **Integração com WhatsApp**: Cria links diretos para contatar gerentes de filiais
- **Designação de técnicos**: Atribui responsabilidades com base em intervalos numéricos de filiais
- **Registro de incidentes**: Acompanha tempo de inatividade e histórico de problemas
- **Operação 24/7**: Monitoramento constante para minimizar o tempo de inatividade

## 🔧 Tecnologias

- **TypeScript**: Linguagem principal com tipagem estática
- **Discord.js**: Interação com a API do Discord
- **Drizzle ORM**: ORM para PostgreSQL com migrações e schemas tipados
- **PostgreSQL**: Banco de dados relacional
- **Ping**: Verificação de conectividade com sistemas remotos
- **Node.js**: Ambiente de execução

## ⚙️ Instalação

### Pré-requisitos

- Node.js (v16+)
- PostgreSQL
- Conta Discord Developer

### Configuração

1. Clone o repositório:

```bash
git clone https://github.com/Paulo-Borszcz/monet.git
```

2. Instale as dependências:

```bash
pnpm install
```

3. Configure as variáveis de ambiente criando um arquivo `.env` na raiz do projeto:

```env
DISCORD_TOKEN=seu_token_discord
DATABASE_URL=postgresql://usuario:senha@localhost:5432/monitor_bot
ALERT_CHANNEL_ID=id_do_canal_de_alertas
CLIENT_ID=id_do_cliente_discord
GUILD_ID=id_do_servidor_discord
```

4. Execute as migrações do banco de dados:

```bash
pnpm run generate:migrations
pnpm run migrate
```

## 🚀 Uso

### Iniciando o Bot

```bash
# Modo de desenvolvimento
pnpm run dev

# Modo de produção
pnpm run build
pnpm run start
```

### Comandos do Discord

| Comando | Descrição |
|---------|-----------|
| `/registrar-tecnico` | Registra um novo técnico no sistema |
| `/adicionar-range` | Adiciona um intervalo de filiais para um técnico |
| `/listar-ranges` | Lista os intervalos atribuídos ao técnico atual |

## 🧰 Arquitetura

O projeto segue uma arquitetura modular:

```
src/
├── bot/           # Comandos e utilidades do Discord
├── db/            # Conexão com banco e modelos de dados
├── services/      # Lógica de negócios (monitoramento, alertas)
└── index.ts       # Ponto de entrada da aplicação
```

## 📊 Banco de Dados

O sistema utiliza as seguintes tabelas:

- **branch**: Informações das filiais (nome, número, IPs)
- **technician**: Dados dos técnicos responsáveis
- **technician_range**: Intervalos de responsabilidade
- **downtime**: Registro de períodos de inatividade
- **manager**: Informações de contato dos gerentes de filial

## 🔒 Segurança

- Credenciais armazenadas em variáveis de ambiente
- Conexão SSL com PostgreSQL
- Permissões Discord limitadas ao necessário

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Contribuição

Contribuições são bem-vindas! Por favor, siga os passos:

1. Faça um fork do projeto
2. Crie sua branch de feature (`git checkout -b feature/amazing-feature`)
3. Commit suas alterações (`git commit -m 'Add some amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## 📬 Contato

Paulo Felipe Borszcz - [@paulofborszcz](https://github.com/paulofborszcz)

Link do projeto: [https://github.com/seu-usuario/monitor-bot](https://github.com/seu-usuario/monitor-bot)
