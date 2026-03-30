import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteTransaction } from '../features/transactions/transactionSlice'
import { selectTransactions } from '../app/selectors'

const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'amount-desc', label: 'Amount High-Low' },
  { value: 'amount-asc', label: 'Amount Low-High' },
]

function TransactionList({ onEdit, readOnly = false, limit = null }) {
  const dispatch = useDispatch()
  const transactions = useSelector(selectTransactions)
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('latest')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6

  useEffect(() => {
    setCurrentPage(1)
  }, [typeFilter, sortBy])

  const filteredTransactions = useMemo(() => {
    if (typeFilter === 'all') {
      return transactions
    }

    return transactions.filter((transaction) => transaction.type === typeFilter)
  }, [transactions, typeFilter])

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      }

      if (sortBy === 'amount-desc') {
        return Number(b.amount) - Number(a.amount)
      }

      if (sortBy === 'amount-asc') {
        return Number(a.amount) - Number(b.amount)
      }

      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }, [filteredTransactions, sortBy])

  const totalPages = useMemo(() => {
    if (limit) {
      return 1
    }

    return Math.max(1, Math.ceil(sortedTransactions.length / pageSize))
  }, [sortedTransactions, limit])

  const visibleTransactions = useMemo(() => {
    if (limit) {
      return sortedTransactions.slice(0, limit)
    }

    const start = (currentPage - 1) * pageSize
    return sortedTransactions.slice(start, start + pageSize)
  }, [sortedTransactions, currentPage, limit])

  return (
    <section className="card list-card">
      <div className="section-header">
        <h2>Transactions</h2>
        <div className="inline-actions compact-controls">
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {!limit && (
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {visibleTransactions.length === 0 ? (
        <p className="empty-state">No transactions yet. Add one from the form.</p>
      ) : (
        <ul className="transaction-list">
          {visibleTransactions.map((transaction) => (
            <li key={transaction.id} className="transaction-item">
              <div>
                <strong>{transaction.category}</strong>
                <p>{transaction.note || 'No note'}</p>
                <small>{new Date(transaction.date).toLocaleDateString()}</small>
              </div>
              <div className="item-meta">
                <span className={transaction.type === 'income' ? 'pill income' : 'pill expense'}>
                  {transaction.type}
                </span>
                <strong>${Number(transaction.amount).toFixed(2)}</strong>
                {!readOnly && (
                  <div className="inline-actions">
                    <button type="button" className="ghost" onClick={() => onEdit?.(transaction)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => dispatch(deleteTransaction(transaction.id))}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {!limit && totalPages > 1 && (
        <div className="list-pagination">
          <button
            type="button"
            className="ghost"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </button>
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <button
            type="button"
            className="ghost"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Next
          </button>
        </div>
      )}
    </section>
  )
}

export default TransactionList
