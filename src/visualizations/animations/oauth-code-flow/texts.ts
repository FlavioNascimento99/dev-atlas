import type { Locale } from '@/lib/i18n/types'

const en = {
  title: 'Authorization code flow with PKCE',
  description:
    'A client obtains an access token on behalf of a user and calls an API with it. The client is the part of the application that holds the tokens, such as a web backend. Follow which values pass through the browser and which never do.',
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
  start: 'Press Play or Step. The user wants the client to access an API on their behalf, without giving it their password.',
  steps: {
    prepare:
      'Prepare: the client generates a random code_verifier, derives the code_challenge from it with SHA-256 and generates a random state. The verifier stays with the client.',
    redirect:
      'Authorization request: the client redirects the browser to the authorization server with its client_id, redirect_uri, requested scope, state and the code_challenge.',
    authorizationRequest:
      'The browser follows the redirect. The authorization server receives the challenge, never the verifier, and keeps it for later.',
    consent:
      'Authentication and consent: the authorization server authenticates the user and asks whether they approve the requested access. The client never sees the credentials of the user.',
    redirectBack:
      'Redirect back: the authorization server redirects the browser to the redirect_uri with a one-time authorization code and the same state.',
    callback:
      'Check: the code reaches the client, which verifies that state matches what it sent, to reject responses it did not initiate.',
    tokenRequest:
      'Token request: over a direct HTTPS call that does not involve the browser, the client sends the code and the original code_verifier to the token endpoint. A confidential client also authenticates itself.',
    tokenResponse:
      'Verification: the authorization server hashes the verifier, compares it with the stored challenge and, since they match, returns an access token and, optionally, a refresh token.',
    apiCall: 'API call: the client calls the resource server with the access token in the Authorization header.',
    apiResponse:
      'The API validates the token and its scopes before answering. Only the short-lived code passed through the browser; the verifier and the tokens travelled on the back channel.',
  },
}

const pt: typeof en = {
  title: 'Fluxo de authorization code com PKCE',
  description:
    'Um client obtém um access token em nome de um usuário e chama uma API com ele. O client é a parte da aplicação que guarda os tokens, como um backend web. Acompanhe quais valores passam pelo navegador e quais nunca passam.',
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
  start: 'Pressione Reproduzir ou Avançar. O usuário quer que o client acesse uma API em seu nome, sem entregar a ele a sua senha.',
  steps: {
    prepare:
      'Preparação: o client gera um code_verifier aleatório, deriva dele o code_challenge com SHA-256 e gera um state aleatório. O verifier fica com o client.',
    redirect:
      'Requisição de autorização: o client redireciona o navegador para o authorization server com o seu client_id, o redirect_uri, o scope solicitado, o state e o code_challenge.',
    authorizationRequest:
      'O navegador segue o redirecionamento. O authorization server recebe o challenge, nunca o verifier, e o guarda para depois.',
    consent:
      'Autenticação e consentimento: o authorization server autentica o usuário e pergunta se ele aprova o acesso solicitado. O client nunca vê as credenciais do usuário.',
    redirectBack:
      'Redirecionamento de volta: o authorization server redireciona o navegador para o redirect_uri com um code de autorização de uso único e o mesmo state.',
    callback:
      'Conferência: o code chega ao client, que verifica se o state é o que ele enviou, para rejeitar respostas que não iniciou.',
    tokenRequest:
      'Requisição de token: em uma chamada HTTPS direta, que não passa pelo navegador, o client envia o code e o code_verifier original ao token endpoint. Um client confidencial também se autentica.',
    tokenResponse:
      'Verificação: o authorization server calcula o hash do verifier, compara com o challenge armazenado e, como coincidem, devolve um access token e, opcionalmente, um refresh token.',
    apiCall: 'Chamada à API: o client chama o resource server com o access token no header Authorization.',
    apiResponse:
      'A API valida o token e os scopes antes de responder. Só o code de curta duração passou pelo navegador; o verifier e os tokens trafegaram pelo back channel.',
  },
}

export const texts: Record<Locale, typeof en> = { en, pt }
