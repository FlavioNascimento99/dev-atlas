import type { Locale } from '@/lib/i18n/types'

const en = {
  title: 'Authorization code flow with PKCE',
  description:
    'A client gets an access token on behalf of a user, a bit like a valet key, and calls an API with it. The client is the part of the application that holds the tokens, such as a web backend. Follow which values pass through the browser and which never do.',
  svgTitle: 'Messages of the OAuth 2.0 authorization code flow with PKCE',
  svgDescription:
    'Four lifelines, left to right: the browser of the user, the client, the authorization server and the resource server (the API). Solid arrows are requests and dashed arrows are responses.',
  actors: {
    browser: 'Browser',
    client: 'Client',
    authorizationServer: 'Auth server',
    resourceServer: 'API',
  },
  labels: {
    pkce: 'creates verifier + challenge',
    redirect: 'redirect to auth server',
    authorizationRequest: 'challenge + state',
    storeChallenge: 'stores challenge',
    consent: 'login + consent',
    codeRedirect: 'redirect: code + state',
    callback: 'code + state',
    stateCheck: 'state matches',
    tokenRequest: 'code + verifier',
    verifyChallenge: 'SHA-256(verifier) = challenge',
    tokens: 'access token',
    apiCall: 'Bearer access token',
    validateToken: 'validates token + scopes',
    data: 'protected data',
  },
  start: 'Press Play or Step. The user wants the client to access an API on their behalf, without ever giving it their password.',
  steps: {
    prepare:
      'Prepare: the client generates a random code_verifier and derives the code_challenge from it with SHA-256. It also generates a random state. The verifier is the secret half: it stays with the client.',
    redirect:
      'Authorization request: the client sends the browser to the authorization server, carrying its client_id, redirect_uri, requested scope, state and the code_challenge.',
    authorizationRequest:
      'The browser follows the redirect. The authorization server receives the challenge, never the verifier, and keeps it for later.',
    consent:
      'Authentication and consent: the authorization server checks who the user is and asks whether they approve the requested access. The user types their credentials here, so the client never sees them.',
    redirectBack:
      'Redirect back: the authorization server sends the browser to the redirect_uri with a one-time authorization code and the same state.',
    callback:
      'Check: the code reaches the client. The client verifies that state matches what it sent, so it can reject responses it never asked for.',
    tokenRequest:
      'Token request: in a direct HTTPS call that skips the browser, the back channel, the client sends the code and the original code_verifier to the token endpoint. A confidential client also authenticates itself.',
    tokenResponse:
      'Verification: the authorization server hashes the verifier and compares it with the stored challenge. They match, so it returns an access token and, optionally, a refresh token. Someone holding only the code could not get this far.',
    apiCall: 'API call: the client calls the resource server, sending the access token in the Authorization header.',
    apiResponse:
      'The API validates the token and its scopes before answering. Looking back: only the short-lived code passed through the browser. The verifier and the tokens travelled on the back channel.',
  },
}

const pt: typeof en = {
  title: 'Fluxo de authorization code com PKCE',
  description:
    'Um client obtém um access token em nome de um usuário, algo como uma chave de manobrista, e chama uma API com ele. O client é a parte da aplicação que guarda os tokens, como um backend web. Acompanhe quais valores passam pelo navegador e quais nunca passam.',
  svgTitle: 'Mensagens do fluxo de authorization code do OAuth 2.0 com PKCE',
  svgDescription:
    'Quatro linhas de vida, da esquerda para a direita: o navegador do usuário, o client, o authorization server e o resource server (a API). Setas contínuas são requisições e setas tracejadas são respostas.',
  actors: {
    browser: 'Navegador',
    client: 'Client',
    authorizationServer: 'Auth server',
    resourceServer: 'API',
  },
  labels: {
    ...en.labels,
    pkce: 'cria verifier + challenge',
    redirect: 'redireciona ao auth server',
    storeChallenge: 'guarda o challenge',
    consent: 'login + consentimento',
    stateCheck: 'state confere',
    validateToken: 'valida token + scopes',
    data: 'dados protegidos',
  },
  start: 'Pressione Reproduzir ou Avançar. O usuário quer que o client acesse uma API em seu nome, sem nunca entregar a ele a sua senha.',
  steps: {
    prepare:
      'Preparação: o client gera um code_verifier aleatório e deriva dele o code_challenge com SHA-256. Também gera um state aleatório. O verifier é a metade secreta: ele fica com o client.',
    redirect:
      'Requisição de autorização: o client manda o navegador para o authorization server, levando o seu client_id, o redirect_uri, o scope solicitado, o state e o code_challenge.',
    authorizationRequest:
      'O navegador segue o redirecionamento. O authorization server recebe o challenge, nunca o verifier, e o guarda para depois.',
    consent:
      'Autenticação e consentimento: o authorization server confere quem é o usuário e pergunta se ele aprova o acesso solicitado. O usuário digita as credenciais aqui, então o client nunca as vê.',
    redirectBack:
      'Redirecionamento de volta: o authorization server manda o navegador para o redirect_uri com um code de autorização de uso único e o mesmo state.',
    callback:
      'Conferência: o code chega ao client. O client verifica se o state é o que ele enviou, para rejeitar respostas que ele nunca pediu.',
    tokenRequest:
      'Requisição de token: numa chamada HTTPS direta que não passa pelo navegador, o back channel, o client envia o code e o code_verifier original ao token endpoint. Um client confidencial também se autentica.',
    tokenResponse:
      'Verificação: o authorization server calcula o hash do verifier e compara com o challenge armazenado. Eles coincidem, então ele devolve um access token e, opcionalmente, um refresh token. Quem tivesse só o code não chegaria até aqui.',
    apiCall: 'Chamada à API: o client chama o resource server, enviando o access token no header Authorization.',
    apiResponse:
      'A API valida o token e os scopes antes de responder. Olhando para trás: só o code de curta duração passou pelo navegador. O verifier e os tokens trafegaram pelo back channel.',
  },
}

export const texts: Record<Locale, typeof en> = { en, pt }
