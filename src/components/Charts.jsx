import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { selectCategoryExpenseTotals, selectMonthlyExpenses } from '../app/selectors'

const chartColors = ['#ff9f1c', '#4dc9ff', '#67f0b2', '#ff7f8f', '#ffd18f', '#96a7ff', '#8ef6e2']

function Charts() {
  const categoryTotals = useSelector(selectCategoryExpenseTotals)
  const monthlyTotals = useSelector(selectMonthlyExpenses)

  const pieData = useMemo(
    () =>
      Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value,
      })),
    [categoryTotals],
  )

  const barData = useMemo(
    () =>
      Object.entries(monthlyTotals).map(([month, total]) => ({
        month,
        total,
      })),
    [monthlyTotals],
  )

  return (
    <section className="chart-grid">
      <article className="card chart-card">
        <h2>Category Exposure</h2>
        <div className="chart-wrap">
          {pieData.length === 0 ? (
            <p className="empty-state">Add expense transactions to see category breakdown.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} label>
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `$${Number(value).toFixed(2)}`}
                  contentStyle={{ backgroundColor: '#0e1626', border: '1px solid #3c527b', color: '#f1f4fb' }}
                />
                <Legend wrapperStyle={{ color: '#f1f4fb' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </article>

      <article className="card chart-card">
        <h2>Monthly Burn Curve</h2>
        <div className="chart-wrap">
          {barData.length === 0 ? (
            <p className="empty-state">Add expense transactions to see monthly trends.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334767" />
                <XAxis dataKey="month" stroke="#9aa8c0" />
                <YAxis stroke="#9aa8c0" />
                <Tooltip
                  formatter={(value) => `$${Number(value).toFixed(2)}`}
                  contentStyle={{ backgroundColor: '#0e1626', border: '1px solid #3c527b', color: '#f1f4fb' }}
                />
                <Bar dataKey="total" fill="#4dc9ff" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </article>
    </section>
  )
}

export default Charts
