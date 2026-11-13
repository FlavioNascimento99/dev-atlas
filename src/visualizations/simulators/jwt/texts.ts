import type { Locale } from '@/lib/i18n/types'

const en = {
  title: 'A signed JWT, decoded and verified',
  description:
    'The token an API receives, split into its three parts. Change a claim or let the token expire, then step through the checks the API runs before trusting it. The signature is an illustrative ES256 value: the lab does not run the cryptography, it compares the presented bytes with the ones the issuer signed.',
  payloadParam: 'Token presented',
  issued: 'As issued',
  tampered: 'role changed to admin',
  clockParam: 'API clock',
  clockValid: '{time} UTC · before exp',
  clockExpired: '{time} UTC · after exp',
  tokenLabel: 'Token, as sent in the Authorization header',
  parts: { header: 'Header', payload: 'Payload', signature: 'Signature' },
  decoded: 'decoded, readable by anyone',
  notJson: 'not JSON',
  signatureNote:
    'ES256 over the first two parts, made with the private key of the issuer. The key is not in the token, so the holder cannot produce a new signature.',
  edited: 'edited after signing',
  checksTitle: 'Checks run by the API',
  clock: 'clock: {time} UTC',
  checks: { signature: 'Signature', claims: 'Claims', authorize: 'Authorize' },
  status: { pending: 'pending', passed: 'passed', failed: 'failed', skipped: 'not reached' },
  details: {
    signature: 'ES256, pinned by the API, over header.payload',
    signatureValid: 'covers exactly the presented header.payload',
    signatureInvalid: 'signed with role "{signed}", presented with role "{presented}"',
    claims: 'iss, aud and exp ({exp} UTC)',
    claimsChecked: 'iss {iss} · aud {aud} · exp {expMark} ({exp} against clock {now})',
    authorize: 'the role is read only after both layers pass',
    authorized: 'role "{role}" can be trusted now',
  },
  verdict: {
    none: 'Not verified yet: decoded claims are not trusted.',
    authorized: '200 OK · request allowed as {role}',
    signatureInvalid: '401 Unauthorized · invalid signature',
    claimsRejected: '401 Unauthorized · token expired',
  },
  start:
    'Anyone can decode the header and the payload: they are only base64url-encoded. Press Play or Step to run the checks that make the claims trustworthy.',
  steps: {
    signatureValid:
      'Cryptographic layer. The API uses the algorithm it pinned, ES256, never the one the header asks for, with the public key of the issuer selected by kid. The signature covers exactly the header.payload that was presented, so the token is authentic and unmodified.',
    signatureInvalid:
      'Cryptographic layer. The payload was re-encoded with role "admin", but the signature was computed over the original bytes, and only the private key of the issuer can produce a new one. A single altered byte makes the verification fail: the token is rejected and no claim is used.',
    claimsValid:
      'Claims layer. The issuer is the expected one, this API is in the audience, and the clock ({now} UTC) is before exp ({exp} UTC).',
    claimsRejected:
      'Claims layer. The signature is authentic, but exp was {exp} UTC and the clock of the API reads {now} UTC, beyond the {tolerance} seconds of tolerance. A correctly signed token is still rejected once it expires.',
    authorized:
      'Only now does the API read the remaining claims: the caller is user-8472 with role "viewer". The issuer was not contacted at any point, which is also why this token cannot be taken back before it expires.',
  },
}

const pt: typeof en = {
  title: 'Um JWT assinado, decodificado e verificado',
  description:
    'O token que uma API recebe, dividido nas suas três partes. Altere uma claim ou deixe o token expirar e percorra as verificações que a API faz antes de confiar nele. A assinatura é um valor ES256 ilustrativo: o laboratório não executa a criptografia, ele compara os bytes apresentados com os que o emissor assinou.',
  payloadParam: 'Token apresentado',
  issued: 'Como foi emitido',
  tampered: 'role alterada para admin',
  clockParam: 'Relógio da API',
  clockValid: '{time} UTC · antes de exp',
  clockExpired: '{time} UTC · depois de exp',
  tokenLabel: 'Token, como é enviado no header Authorization',
  parts: { header: 'Header', payload: 'Payload', signature: 'Assinatura' },
  decoded: 'decodificado, legível por qualquer um',
  notJson: 'não é JSON',
  signatureNote:
    'ES256 sobre as duas primeiras partes, feita com a chave privada do emissor. A chave não está no token, então quem o possui não consegue produzir uma nova assinatura.',
  edited: 'alterada após a assinatura',
  checksTitle: 'Verificações feitas pela API',
  clock: 'relógio: {time} UTC',
  checks: { signature: 'Assinatura', claims: 'Claims', authorize: 'Autorizar' },
  status: { pending: 'pendente', passed: 'passou', failed: 'falhou', skipped: 'não alcançada' },
  details: {
    signature: 'ES256, fixado pela API, sobre header.payload',
    signatureValid: 'cobre exatamente o header.payload apresentado',
    signatureInvalid: 'assinado com role "{signed}", apresentado com role "{presented}"',
    claims: 'iss, aud e exp ({exp} UTC)',
    claimsChecked: 'iss {iss} · aud {aud} · exp {expMark} ({exp} contra o relógio {now})',
    authorize: 'a role só é lida depois que as duas camadas passam',
    authorized: 'a role "{role}" agora é confiável',
  },
  verdict: {
    none: 'Ainda não verificado: claims decodificadas não são confiáveis.',
    authorized: '200 OK · requisição permitida como {role}',
    signatureInvalid: '401 Unauthorized · assinatura inválida',
    claimsRejected: '401 Unauthorized · token expirado',
  },
  start:
    'Qualquer pessoa consegue decodificar o header e o payload: eles estão apenas codificados em base64url. Pressione Reproduzir ou Avançar para executar as verificações que tornam as claims confiáveis.',
  steps: {
    signatureValid:
      'Camada criptográfica. A API usa o algoritmo que ela fixou, ES256, nunca o que o header pede, com a chave pública do emissor selecionada pelo kid. A assinatura cobre exatamente o header.payload apresentado, então o token é autêntico e não foi modificado.',
    signatureInvalid:
      'Camada criptográfica. O payload foi recodificado com role "admin", mas a assinatura foi calculada sobre os bytes originais, e só a chave privada do emissor consegue produzir uma nova. Um único byte alterado faz a verificação falhar: o token é rejeitado e nenhuma claim é usada.',
    claimsValid:
      'Camada de claims. O emissor é o esperado, esta API está na audiência e o relógio ({now} UTC) está antes de exp ({exp} UTC).',
    claimsRejected:
      'Camada de claims. A assinatura é autêntica, mas exp era {exp} UTC e o relógio da API marca {now} UTC, além dos {tolerance} segundos de tolerância. Um token corretamente assinado ainda é rejeitado depois de expirar.',
    authorized:
      'Só agora a API lê as demais claims: o chamador é user-8472 com role "viewer". O emissor não foi contatado em nenhum momento, e é por isso também que este token não pode ser cancelado antes de expirar.',
  },
}

export const texts: Record<Locale, typeof en> = { en, pt }
