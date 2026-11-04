# Pagamentos automáticos do Paralaxe

Tudo já está montado no código. Falta só a Polyana ter a conta do Mercado Pago com os links, e as contas de e-mail e banco (gratuitas) abaixo. Enquanto os links estiverem vazios, o site funciona como antes (formulário do Google).

## Como funciona

1. A pessoa clica em **Assinar / Ouvinte / Analista / Inscrever-se** e paga pelo link do Mercado Pago.
2. O Mercado Pago avisa o site em `/api/mp-webhook` (arquivo `api/mp-webhook.js`).
3. O site descobre o serviço pelo **título do link** e manda:
   - para a **pessoa**: e-mail com comprovante, convite do grupo de WhatsApp, link do Meet e pasta do Drive (conforme o serviço);
   - para a **Polyana**: e-mail com nome, e-mail, serviço e valor.
4. Assinatura cancelada ou pausada: a Polyana recebe um aviso para remover a pessoa do grupo (o sistema não remove ninguém sozinho).
5. Pagamento que o sistema não reconhece: **nada é enviado à pessoa**, e a Polyana recebe um aviso para mandar os links na mão.

## O que a Polyana precisa fazer no Mercado Pago

Criar um link (ou plano de assinatura, para as mensalidades) por serviço. O **título** precisa ser exatamente um destes (o sistema compara o título, sem ligar para maiúsculas ou acentos):

| Serviço | Título do link no Mercado Pago | Tipo |
| --- | --- | --- |
| Psicanálise em Paralaxe, mensalidade R$ 80 | `Paralaxe Estudos Mensalidade` | assinatura |
| Bolsista do estudos (valor combinado) | `Paralaxe Estudos Bolsista` | assinatura, link só dela |
| Escuta Clínica, ouvinte R$ 50 | `Paralaxe Escuta Ouvinte` | avulso ou assinatura |
| Escuta Clínica, analista R$ 90 | `Paralaxe Escuta Analista` | avulso ou assinatura |
| Mini curso | `Paralaxe Mini Curso` (pode seguir com o nome do curso depois) | avulso |
| Grupo de leitura | `Paralaxe Leitura` | avulso |

Se o link permitir uma página de retorno depois do pagamento, usar `https://SEU-DOMINIO/obrigado.html`.

## Passo a passo quando a conta estiver pronta

1. **Colar os links** em `src/data/clinic.ts`, em `pagamentos` (o botão só aparece quando o link existe).
2. **Preencher os Meet** em `api/_produtos.js` (`MEET_ESTUDOS` e `MEET_ESCUTA`) com os links fixos que a Polyana usa.
3. **Mercado Pago, Suas integrações:** criar uma aplicação e anotar o **Access Token de produção**. Em Webhooks, cadastrar a URL `https://SEU-DOMINIO/api/mp-webhook` e marcar os eventos de **Pagamentos** e de **Planos e assinaturas**. Anotar a **assinatura secreta** do webhook. (Os nomes dos menus podem mudar, então confira no painel.)
4. **Resend (e-mail):** criar conta, verificar o domínio do site e criar uma chave de API. Sem domínio próprio, os e-mails para os alunos não saem.
5. **Upstash Redis:** criar um banco gratuito (dá para criar pela Vercel, em Storage ou Marketplace). Ele só guarda "esse pagamento já foi tratado", para não mandar e-mail em duplicidade.
6. **Vercel, Settings, Environment Variables:** cadastrar as variáveis de `.env.example` (os valores ficam só lá, nunca no GitHub). Depois, fazer um novo deploy.
7. **Termos e privacidade:** a Polyana revisa e preenche `public/privacidade.html` (trechos entre colchetes: e-mail dela e regras de cancelamento e reembolso). O link só aparece no rodapé depois que o primeiro link de pagamento é colado.
8. **Decidir** se os links públicos dos grupos de WhatsApp saem do site (`links.grupoEstudos` e `links.grupoEscuta` em `clinic.ts`). Se continuarem lá, qualquer pessoa entra sem pagar.

## Como testar

- No painel do Mercado Pago, usar **Simular notificação**: o site deve responder 200 (um ID falso é ignorado de propósito).
- Fazer um link de teste de R$ 1 com o título `Paralaxe Estudos Mensalidade`, pagar com um e-mail seu e conferir os dois e-mails que chegam.
- Em caso de erro, ver os logs da função na Vercel (Logs, filtro `api/mp-webhook`).
- Teste local da lógica, sem internet: `node scripts/test-webhook.mjs`.

## Limites e o que não foi testado

- **Não foi testado com o Mercado Pago de verdade** (ainda não há conta). A lógica foi testada com respostas simuladas. O ponto mais incerto é onde o título do link aparece no pagamento real. Se um pagamento não for reconhecido, a Polyana recebe o aviso "sem serviço identificado" e nada vai para a pessoa; nesse caso é só ajustar `match` em `api/_produtos.js`.
- **WhatsApp:** o sistema manda o convite por e-mail, mas não adiciona nem remove ninguém do grupo.
- **Drive:** o link da pasta vai no e-mail. O compartilhamento por e-mail do aluno e a retirada em caso de cancelamento não foram feitos.
- **Reembolso e direito de arrependimento:** hoje o site diz "sem reembolso". Em compra on-line, a Polyana deve conferir com contador ou advogado.
