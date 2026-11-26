# Pagamento confirmado pelo site (a Polyana só clica em "Autorizar")

A pessoa clica em **Pagar**, paga no Mercado Pago e volta sozinha ao site. Uma página **confere no Mercado Pago que o pagamento foi aprovado** e só então mostra o convite do grupo, o Meet e a pasta. Sem formulário, sem e-mail, sem domínio, sem Resend, sem conta nova para a Polyana.

## O que a Polyana faz (1 minuto, uma vez só)

Abrir **um link que o Caio manda**, entrar na conta do Mercado Pago dela e clicar em **Autorizar**. Aparece "Conta conectada!". Ela não copia nem vê token nenhum. Ela pode cancelar a autorização quando quiser, na conta do Mercado Pago dela (Seu perfil, Segurança, Aplicações conectadas).

## O que o Caio faz

1. **Aplicação no Mercado Pago, na conta do próprio Caio** (não na da Polyana): `mercadopago.com.br/developers/panel`, Criar aplicação, nome "Paralaxe". Nos detalhes da aplicação, cadastrar a **Redirect URL** `https://ENDEREÇO-DO-SITE/api/conectar-retorno` (exatamente igual) e copiar o **Client ID** e o **Client Secret**.
2. **Upstash Redis** (gratuito, pela Vercel, em Storage/Marketplace): guarda o token autorizado e renova sozinho (vale 180 dias).
3. **Vercel, Settings, Environment Variables:** `MP_CLIENT_ID`, `MP_CLIENT_SECRET`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `SITE_URL` (endereço final do site, sem barra no fim) e `CONECTAR_CHAVE` (uma senha longa inventada por você). Depois, novo deploy.
4. **Preencher os Meet** em `api/_produtos.js` (`MEET_ESTUDOS`, `MEET_ESCUTA`), se a Polyana quiser que apareçam.
5. Mandar à Polyana o link `https://ENDEREÇO-DO-SITE/api/conectar?chave=SUA_CHAVE`. Quando ela clicar em Autorizar, está conectado.
6. **Teste de R$ 1:** abrir `https://ENDEREÇO-DO-SITE/api/pagar?servico=estudos&teste=1&chave=SUA_CHAVE`, pagar R$ 1 (pode ser seu cartão ou Pix), voltar ao site e conferir a página com o convite. Depois, a Polyana pode devolver o R$ 1 no app.
7. Em `src/data/clinic.ts`, trocar `modoInscricao` de `"manual"` para `"verificado"` e publicar.

(Alternativa sem autorização: a Polyana cria uma aplicação própria e copia o Access Token para `MP_ACCESS_TOKEN` na Vercel. Funciona igual, mas dá mais trabalho a ela.)

## Como funciona por dentro

- `api/pagar.js` cria o pagamento com **o preço do servidor** e uma referência única, e manda a pessoa ao Mercado Pago.
- O Mercado Pago devolve a pessoa a `/obrigado.html` (volta automática depois de aprovado).
- `api/verificar.js` consulta o pagamento com o token da Polyana e **só libera se** estiver aprovado, com a referência criada pelo nosso servidor e valor igual ou maior que o preço. Pagamento pendente (Pix, boleto) faz a página esperar e conferir sozinha.
- `api/conectar.js` e `api/conectar-retorno.js` fazem a autorização de um clique. Só funcionam com a chave secreta, para ninguém ligar outra conta no lugar da dela.

## Limites (para ser honesto)

- **Não foi testado com o Mercado Pago de verdade.** Os testes simulados passam (35), mas o teste de R$ 1 é obrigatório antes de divulgar. O Mercado Pago pode exigir alguma etapa extra para aplicações (por exemplo, certificação) que eu não consigo ver daqui.
- **Pix e a volta ao site:** depois de pagar por Pix, o Mercado Pago mostra um botão de voltar e pode demorar para redirecionar. Quem fechar a página perde o atalho: a Polyana confere o comprovante e libera na mão.
- **A página não prova quem é a pessoa:** quem tiver o endereço da página de obrigado de um pagamento aprovado vê o convite. É difícil de adivinhar, e o grupo pode exigir aprovação.
- **WhatsApp:** o sistema não adiciona ninguém ao grupo; a pessoa entra tocando no convite. Ligar "Aprovar novos participantes" nos grupos dá controle extra.
- **Grupo público:** no modo `"verificado"` os botões do grupo saem do site, para o convite só aparecer depois do pagamento.
- **Assinatura recorrente:** a mensalidade é avulsa por enquanto (fevereiro).
