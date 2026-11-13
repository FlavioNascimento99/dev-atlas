export type AccountId = 'alice' | 'bob'

export type Balances = Record<AccountId, number>

export type AcidParams = {
  /** The two updates are wrapped in BEGIN … COMMIT; otherwise each statement commits by itself. */
  transaction: boolean
  /** The server crashes after the debit, before the credit. */
  crash: boolean
}

export type AcidStatement = 'begin' | 'debit' | 'credit' | 'commit' | 'crash' | 'recover'

export type AcidStepId =
  | 'begin'
  | 'debit'
  | 'debitAutocommit'
  | 'credit'
  | 'creditAutocommit'
  | 'commit'
  | 'crash'
  | 'crashAutocommit'
  | 'rollback'
  | 'restart'

export type AcidStep = {
  id: AcidStepId
  statement: AcidStatement
  /** Balances as the session running the transfer sees them after this step. */
  balances: Balances
  /** Balances that are committed: what other sessions see and what survives a crash. */
  committed: Balances
}
