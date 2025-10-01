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

### Tela de agendamento no app
![Agendamento Mobile](adm_booking1.png)

### Lista de agendamentos no app
![Lista Agendamentos](adm_bookings.png)

### Painel administrativo - usuários e permissões
![Usuários](adm_booking2.png)

### Painel administrativo - formulários disponíveis
![Formulários](adm_forms.png)

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
