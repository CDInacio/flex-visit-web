# Flex Visit Web

O **Flex Visit Web** é uma aplicação desenvolvida para **gestão de agendamentos de visitas técnicas e institucionais**.  
Com ele, é possível organizar solicitações de visitas, aprovar ou rejeitar agendamentos, gerenciar usuários e manter todo o processo mais eficiente e automatizado.

---

## 🚀 Tecnologias utilizadas

- React + TypeScript  
- Vite  
- Tailwind CSS  
- Node.js (backend complementar, se configurado)  
- Git / GitHub (versionamento)  
- Deploy em Vercel

---

## 📋 Funcionalidades principais

- **Formulários dinâmicos** para solicitação de visitas  
- **Agendamento de visitas** com status (pendente, aprovado, concluído, cancelado)  
- **Gerenciamento de usuários** com diferentes níveis de acesso (Admin, Visitor, Attendant)  
- **Painel administrativo** para controle de agendamentos e formulários  
- **QR Code** para validação de reservas e controle de acesso  
- **Design responsivo**, acessível em dispositivos móveis e desktop

---

## 🖼️ Demonstração (Screenshots)

### Home / Dashboard
![Dashboard](https://i.ibb.co/p6Z7P821/adm-home-page.png)

### Lista de agendamentos
![Lista Agendamentos](https://i.ibb.co/KjWvHk6m/adm-change-status.png)

### Lista de usuários
![Lista Usuários](https://i.ibb.co/nqKDnhfg/adm-bookings.png)


### Formulários disponíveis
![Formulários](https://i.ibb.co/j9KWX9h0/adm-forms.png)


### Horários disponíveis
![Horários](https://i.ibb.co/TBFJnXz8/adm-schedule.png)


### Criação de horários
![Criação de horários](https://i.ibb.co/yFK8q0Hv/adm-new-schedule.png)


## Criação de formulários
![Criação de formulários](https://i.ibb.co/gM2t0CPB/adm-new-form.png)

---

## 📂 Estrutura do projeto

```
.
├── public
├── src
│   ├── components
│   ├── pages
│   ├── hooks
│   ├── services
│   ├── styles
│   └── utils
├── .eslintrc.cjs
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🛠️ Como executar localmente

1. Clone o repositório:

   ```bash
   git clone https://github.com/CDInacio/flex-visit-web.git
   cd flex-visit-web
   ```

2. Instale as dependências:

   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   ```

3. Execute em ambiente de desenvolvimento:

   ```bash
   npm run dev
   ```

4. Acesse no navegador:  
   [http://localhost:3000](http://localhost:3000)

---

## 📦 Scripts úteis

- `dev` — inicia o servidor de desenvolvimento  
- `build` — gera a versão otimizada para produção  
- `preview` — visualiza a build localmente  
- `lint` — verifica padrões de código  
- `test` — executa os testes (se configurados)

---

## 🤝 Contribuição

Contribuições são bem-vindas! Para colaborar:

1. Faça fork do projeto  
2. Crie uma branch para sua feature/correção: `git checkout -b minha-feature`  
3. Commit suas alterações: `git commit -m "Minha feature"`  
4. Envie a branch: `git push origin minha-feature`  
5. Abra um Pull Request

---

## 👤 Autor

**Cláudio Dantas**  
- [GitHub](https://github.com/CDInacio)  
- [Portfólio](https://claudiodantas.vercel.app/)  

---

## 📜 Licença

Este projeto está sob a licença [MIT](LICENSE).

---

## 🚧 Status do Projeto

O projeto está em constante evolução e pode receber novas funcionalidades conforme necessidades futuras.  
