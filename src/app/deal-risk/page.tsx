'use client'

import { useState } from 'react'

type Deal = {
  company: string
  dealSize: number
  stage: string
  daysInStage: number
  lastActivityDays: number
}

type DealAnalysis = {
  company: string
  riskLevel: 'low' | 'medium' | 'high'
  reason: string
}

type AnalysisResult = {
  summary: string
  totalPipelineValue: number
  atRiskValue: number
  deals: DealAnalysis[]
}

const SAMPLE_DEALS: Deal[] = [
  { company: 'Northwind Logistics', dealSize: 42000, stage: 'Negotiation', daysInStage: 6, lastActivityDays: 2 },
  { company: 'Beacon Analytics', dealSize: 18000, stage: 'Proposal Sent', daysInStage: 21, lastActivityDays: 19 },
  { company: 'Redline Manufacturing', dealSize: 65000, stage: 'Discovery', daysInStage: 3, lastActivityDays: 1 },
  { company: 'Foundry Health', dealSize: 30000, stage: 'Proposal Sent', daysInStage: 34, lastActivityDays: 28 },
  { company: 'Circuit Retail Group', dealSize: 12000, stage: 'Negotiation', daysInStage: 9, lastActivityDays: 4 },
]

const EMPTY_DEAL: Deal = { company: '', dealSize: 0, stage: 'Discovery', daysInStage: 0, lastActivityDays: 0 }

const STAGES = ['Discovery', 'Proposal Sent', 'Negotiation', 'Verbal Commit']

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

const riskStyles: Record<DealAnalysis['riskLevel'], string> = {
  low: 'bg-green-50 text-green-700 border-green-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-red-50 text-red-700 border-red-200',
}

export default function DealRiskPage() {
  const [deals, setDeals] = useState<Deal[]>(SAMPLE_DEALS)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function updateDeal(index: number, field: keyof Deal, value: string) {
    setDeals((prev) =>
      prev.map((d, i) => {
        if (i !== index) return d
        if (field === 'dealSize' || field === 'daysInStage' || field === 'lastActivityDays') {
          return { ...d, [field]: Number(value) || 0 }
        }
        return { ...d, [field]: value }
      })
    )
  }

  function addDeal() {
    setDeals((prev) => [...prev, { ...EMPTY_DEAL }])
  }

  function removeDeal(index: number) {
    setDeals((prev) => prev.filter((_, i) => i !== index))
  }

  function loadSampleData() {
    setDeals(SAMPLE_DEALS)
    setResult(null)
    setError(null)
  }

  async function analyzeDeals() {
    setIsAnalyzing(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/analyze-deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deals }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Failed to analyze deals')
      }

      const data: AnalysisResult = await res.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Deal Risk Analyzer</h1>
        <p className="text-gray-600 mb-8">
          Enter your open pipeline and get an AI-generated read on which deals are at risk of stalling.
        </p>

        <div className="bg-white rounded-xl shadow overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Deal Size ($)</th>
                  <th className="px-4 py-3 font-medium">Stage</th>
                  <th className="px-4 py-3 font-medium">Days in Stage</th>
                  <th className="px-4 py-3 font-medium">Last Activity (days ago)</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deals.map((deal, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2">
                      <input
                        value={deal.company}
                        onChange={(e) => updateDeal(i, 'company', e.target.value)}
                        placeholder="Company name"
                        className="w-full border border-gray-200 rounded-md px-2 py-1.5"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={deal.dealSize || ''}
                        onChange={(e) => updateDeal(i, 'dealSize', e.target.value)}
                        className="w-28 border border-gray-200 rounded-md px-2 py-1.5"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={deal.stage}
                        onChange={(e) => updateDeal(i, 'stage', e.target.value)}
                        className="border border-gray-200 rounded-md px-2 py-1.5"
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={deal.daysInStage || ''}
                        onChange={(e) => updateDeal(i, 'daysInStage', e.target.value)}
                        className="w-20 border border-gray-200 rounded-md px-2 py-1.5"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={deal.lastActivityDays || ''}
                        onChange={(e) => updateDeal(i, 'lastActivityDays', e.target.value)}
                        className="w-20 border border-gray-200 rounded-md px-2 py-1.5"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => removeDeal(i)}
                        className="text-gray-400 hover:text-red-500 transition"
                        aria-label={`Remove ${deal.company || 'deal'}`}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
            <button onClick={addDeal} className="text-blue-600 text-sm font-medium hover:text-blue-700">
              + Add deal
            </button>
            <button onClick={loadSampleData} className="text-gray-500 text-sm hover:text-gray-700">
              Load sample data
            </button>
          </div>
        </div>

        <button
          onClick={analyzeDeals}
          disabled={isAnalyzing || deals.length === 0}
          className="bg-blue-600 text-white rounded-lg px-6 py-2.5 font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? 'Analyzing pipeline...' : 'Analyze Pipeline'}
        </button>

        {error && (
          <p className="text-red-500 mt-4">{error}</p>
        )}

        {result && (
          <div className="mt-8 space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Pipeline Summary</h2>
              <p className="text-gray-600 mb-4">{result.summary}</p>
              <div className="flex gap-8">
                <div>
                  <p className="text-sm text-gray-500">Total pipeline value</p>
                  <p className="text-xl font-semibold text-gray-900">{formatCurrency(result.totalPipelineValue)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">At risk (high risk deals)</p>
                  <p className="text-xl font-semibold text-red-600">{formatCurrency(result.atRiskValue)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="divide-y divide-gray-100">
                {result.deals.map((d, i) => (
                  <div key={i} className="p-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-gray-900">{d.company}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{d.reason}</p>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border ${riskStyles[d.riskLevel]}`}
                    >
                      {d.riskLevel} risk
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}