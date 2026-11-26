# Inscrição e pagamento automáticos do Paralaxe

O código está pronto, mas **desligado** (`automacaoAtiva = false` em `src/data/clinic.ts`). Enquanto estiver desligado, o site usa o formulário do Google e os links `mpago.la` (a Polyana manda o convite na mão).

## Como funciona quando ligado

1. A pessoa clica em **Inscrever-se** (cartões, seção Inscrição ou Agenda) e abre a janela de inscrição do site: serviço, nome, e-mail (digitado duas vezes), WhatsApp, formação, como conheceu e aceite das diretrizes.
2. O site (`api/inscricao.js`) valida, guarda os dados e cria o pagamento no Mercado Pago com o **preço do servidor** e o código da inscrição. A pessoa é levada direto ao Mercado Pago (Pix, cartão ou boleto).
3. Pagou: o Mercado Pago avisa `api/mp-webhook.js`, que reconhece a inscrição pelo código e manda:
   - para a **pessoa**: e-mail (o que ela digitou no formulário) com comprovante, convite do grupo de WhatsApp, link do Meet e pasta do Drive, conforme o serviço;
   - para a **Polyana**: e-mail com nome, e-mail, **WhatsApp** (com botão de conversa), serviço, valor, formação e como conheceu.
4. Assinatura cancelada ou pausada: aviso à Polyana. Pagamento que o sistema não reconhece: aviso à Polyana, e nada vai para a pessoa.
5. Quem paga por um link `mpago.la` antigo: o sistema acha a inscrição pelo e-mail e reconhece o serviço pelo título do link.

Quando `automacaoAtiva = true`, **os botões do grupo público de WhatsApp saem do site**: o convite só vai por e-mail depois do pagamento.

## O que o sistema NÃO faz

- **Adicionar a pessoa ao grupo de WhatsApp:** o WhatsApp não permite. O e-mail leva o convite e a pessoa entra tocando no link. Dica: nos grupos, ligar **"Aprovar novos participantes"**; a Polyana reconhece o nome no aviso e aprova com um toque.
- **Drive:** só o link da pasta vai no e-mail (não compartilha por e-mail do aluno nem retira em cancelamento).
- **Mini cursos e grupo de leitura:** ainda sem valor, então seguem como "Saber mais" (WhatsApp da Polyana). Para incluir, cadastrar `preco` e `titulo` no produto em `api/_produtos.js` e o serviço em `servicosInscricao` no `clinic.ts`.

## Passo a passo para ligar

1. **Domínio** do site apontando para a Vercel (os e-mails para alunos só saem com domínio próprio verificado no Resend).
2. **Resend:** criar conta, verificar o domínio e criar a chave de API.
3. **Upstash Redis:** criar um banco gratuito (pode ser pela Vercel, em Storage/Marketplace). Guarda as inscrições (até 120 dias) e evita e-mail em duplicidade.
4. **Mercado Pago, Suas integrações:** criar uma aplicação, anotar o **Access Token de produção**. Em Webhooks, cadastrar `https://SEU-DOMINIO/api/mp-webhook` com o evento **Pagamentos** (e **Planos e assinaturas**, quando houver recorrência) e anotar a **assinatura secreta**.
5. **Vercel, Settings, Environment Variables:** cadastrar tudo de `.env.example` (`SITE_URL` com o endereço final do site, por exemplo `https://paralaxe.com.br`). Os valores ficam só lá. Depois, novo deploy.
6. **Meet:** preencher `MEET_ESTUDOS` e `MEET_ESCUTA` em `api/_produtos.js`.
7. **Termos e privacidade:** a Polyana revisa `public/privacidade.html` (trechos entre colchetes) e então `termosProntos = true` no `clinic.ts`.
8. Trocar `automacaoAtiva` para `true` e publicar.

## Como testar

- Local, sem internet e sem cobrar nada: `npm run dev`. O formulário funciona de verdade contra as funções de `/api` em modo de teste (nenhum e-mail sai). Para ver a janela, troque `automacaoAtiva` para `true` temporariamente.
- Lógica do servidor: `node scripts/test-webhook.mjs` (29 testes, respostas simuladas).
- Em produção: fazer a inscrição com um serviço de R$ 1 (criando um produto de teste), pagar e conferir os dois e-mails. Logs: Vercel, filtro `api/inscricao` e `api/mp-webhook`.

## Limites e o que não foi testado

- **Nunca foi testado com o Mercado Pago de verdade.** Os formatos seguem a documentação (criação de preferência, `external_reference`, assinatura do webhook), mas só o teste real confirma. Se algo não bater, os avisos "sem serviço identificado" chegam à Polyana e nada vai para a pessoa por engano.
- **Assinaturas recorrentes:** a mensalidade do estudos é pagamento avulso até fevereiro. Quando houver plano recorrente, mudar `tipo` do produto para `"assinatura"` em `api/_produtos.js`.
- **Reembolso e direito de arrependimento:** hoje as diretrizes dizem "sem reembolso". Em compra on-line, a Polyana deve conferir com contador ou advogado. A autorização de uso de imagem (diretriz 2) veio do formulário antigo dela, e vale confirmar com ela.
