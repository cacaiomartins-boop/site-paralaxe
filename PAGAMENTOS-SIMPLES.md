# Convite automático por e-mail, o jeito mais simples

A pessoa paga pelo link do Mercado Pago que a Polyana já criou e **recebe o convite no e-mail do pagamento**, sem ninguém mandar nada. Sem formulário próprio, sem Upstash, sem domínio do Paralaxe.

## O que a Polyana faz (uns 10 minutos, uma vez só)

1. Entrar em **mercadopago.com.br/developers/panel** com a conta dela e clicar em **Criar aplicação**. Nome: `Paralaxe`. Tipo de pagamento: Checkout Pro (ou "pagamentos on-line"). Aceitar os termos.
2. Em **Credenciais de produção**, copiar o **Access Token** e passar para o Caio (por um canal privado). O Caio guarda só na Vercel e ela pode revogar quando quiser, na mesma tela.
3. No painel da conta (**Seu negócio > Configurações > Notificações**, ou **Notificações IPN**; o nome muda), colar o endereço `https://SITE/api/mp-webhook` e marcar **Pagamentos**. O Caio informa o endereço certo. Se a tela de Webhooks da aplicação pedir, ela também cadastra o mesmo endereço lá e copia a **assinatura secreta**.
4. Dar ao Caio o **e-mail dela** (recebe o aviso de cada pagamento) e os **links fixos do Google Meet** (terças e quartas).

Os links de pagamento que ela já criou **continuam valendo**. Nada muda para quem paga.

## O que o Caio faz

1. **Resend** (resend.com): criar conta, verificar um domínio dele (pode ser o de qualquer cliente que ele já controle) e gerar a chave de API. Remetente sugerido: `Paralaxe <contato@dominio-dele>`, com resposta indo para o e-mail da Polyana.
2. **Vercel, Settings, Environment Variables:** cadastrar `MP_ACCESS_TOKEN`, `RESEND_API_KEY`, `EMAIL_FROM`, `POLYANA_EMAIL` e, se houver, `MP_WEBHOOK_SECRET` (lista completa em `.env.example`). Não precisa de `UPSTASH_*` nem de `SITE_URL` neste modo.
3. Preencher `MEET_ESTUDOS` e `MEET_ESCUTA` em `api/_produtos.js`.
4. Em `src/data/clinic.ts`, trocar `modoInscricao` de `"manual"` para `"email"` e publicar. Os botões de pagar passam a ser o caminho principal, o formulário do Google e o grupo público saem do site, e os textos passam a falar do convite por e-mail.
5. **Teste real:** criar um link de R$ 1 com o título `Paralaxe Estudos Mensalidade`, pagar com um e-mail dele e conferir os dois e-mails (o do pagador e o aviso à Polyana). Logs na Vercel, filtro `api/mp-webhook`.

## Como o sistema descobre o serviço

Pelo **título do link** no Mercado Pago. Os títulos atuais já são reconhecidos:
- "Grupo de Estudos: Psicanálise em Paralaxe" (R$ 80)
- "Grupo de Supervisão: Escuta Clínica - mod. ouvinte" (R$ 50)
- "Grupo de supervisão Escuta Clínica - Mod. Analista" (R$ 90)

Pagamento que não bate com nenhum serviço: **nada vai para a pessoa** e a Polyana recebe um aviso para tratar na mão.

## Limites

- **Não foi testado com o Mercado Pago de verdade.** O ponto de maior incerteza é se pagamentos feitos por links `mpago.la` disparam o aviso da conta ou da aplicação. Por isso o teste de R$ 1 é obrigatório. Se não disparar, o plano B é o formulário próprio (modo `"completo"`), que cria o pagamento pela API e garante o aviso.
- **WhatsApp:** o sistema não adiciona ninguém ao grupo; manda o convite por e-mail. Sugestão: ligar nos grupos "Aprovar novos participantes".
- **E-mail do pagador:** o convite vai para o e-mail usado no pagamento do Mercado Pago, por isso o site destaca isso.
- **Duplicados:** sem Redis, o Resend barra reenvios iguais por 24 horas (chave de idempotência). Se o Mercado Pago avisar o mesmo pagamento de novo depois disso, a pessoa pode receber o e-mail outra vez.
- **Drive** e **mini cursos / grupo de leitura:** como no `PAGAMENTOS-LEIA-ME.md`.
