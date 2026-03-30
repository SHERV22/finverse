import { useState } from 'react'
import TransactionForm from './TransactionForm'
import TransactionList from './TransactionList'

function AddTransactionPage() {
  const [editingTransaction, setEditingTransaction] = useState(null)

  return (
    <main className="dashboard">
      <header className="page-header">
        <h1>Transaction Workspace</h1>
        <p>Capture entries quickly, then curate and revise your ledger in an action-focused management lane.</p>
      </header>

      <section className="workspace-grid">
        <article className="card workspace-note">
          <h2>Entry Protocol</h2>
          <p>
            Record with precision: amount, type, category, and date. Add notes only when they add audit value.
          </p>
          <p>
            Use edit mode to correct historical entries without rebuilding your whole ledger timeline.
          </p>
        </article>

        <div className="layout-grid">
        <TransactionForm
          editingTransaction={editingTransaction}
          onCancelEdit={() => setEditingTransaction(null)}
        />
        <TransactionList onEdit={setEditingTransaction} />
        </div>
      </section>
    </main>
  )
}

export default AddTransactionPage
