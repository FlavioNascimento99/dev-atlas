import { scriptedModel } from '../../scripted'
import type { AcidParams, AcidStatement, AcidStep, AcidStepId, Balances } from './types'

export const INITIAL_BALANCES: Balances = { alice: 500, bob: 200 }
export const TRANSFER_AMOUNT = 100

type Database = {
  balances: Balances
  committed: Balances
  /** A transaction opened with BEGIN is in progress. */
  open: boolean
}

export function total(balances: Balances): number {
  return balances.alice + balances.bob
}

/** A write outside BEGIN commits by itself; inside it stays uncommitted. Recovery after a crash keeps only committed data. */
function execute(database: Database, statement: AcidStatement): Database {
  switch (statement) {
    case 'begin':
      return { ...database, open: true }
    case 'debit':
    case 'credit': {
      const balances =
        statement === 'debit'
          ? { ...database.balances, alice: database.balances.alice - TRANSFER_AMOUNT }
          : { ...database.balances, bob: database.balances.bob + TRANSFER_AMOUNT }
      return { ...database, balances, committed: database.open ? database.committed : balances }
    }
    case 'commit':
      return { balances: database.balances, committed: database.balances, open: false }
    case 'crash':
      return database
    case 'recover':
      return { balances: database.committed, committed: database.committed, open: false }
  }
}

const STEP_IDS: Record<AcidStatement, { transaction: AcidStepId; autocommit: AcidStepId }> = {
  begin: { transaction: 'begin', autocommit: 'begin' },
  debit: { transaction: 'debit', autocommit: 'debitAutocommit' },
  credit: { transaction: 'credit', autocommit: 'creditAutocommit' },
  commit: { transaction: 'commit', autocommit: 'commit' },
  crash: { transaction: 'crash', autocommit: 'crashAutocommit' },
  recover: { transaction: 'rollback', autocommit: 'restart' },
}

/** Transfer from Alice to Bob as a debit and a credit, optionally inside a transaction and with a crash between them. */
export function buildTransfer({ transaction, crash }: AcidParams): AcidStep[] {
  const statements: AcidStatement[] = [
    ...(transaction ? (['begin'] as const) : []),
    'debit',
    ...(crash ? (['crash', 'recover'] as const) : (['credit'] as const)),
    ...(transaction && !crash ? (['commit'] as const) : []),
  ]
  let database: Database = { balances: INITIAL_BALANCES, committed: INITIAL_BALANCES, open: false }
  return statements.map((statement) => {
    database = execute(database, statement)
    return {
      id: STEP_IDS[statement][transaction ? 'transaction' : 'autocommit'],
      statement,
      balances: database.balances,
      committed: database.committed,
    }
  })
}

export const acidModel = scriptedModel(buildTransfer)
