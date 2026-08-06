import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

type Deal = {
  company: string
  dealSize: number
  stage: string
  daysInStage: number
  lastActivityDays: number
}

type DealsPayload = {
  deals?: unknown
}

type DealAnalysis = {
  company: string
  riskLevel: "low" | "medium" | "high"
  reason: string
}

type AnalysisResult = {
  summary: string
  totalPipelineValue: number
  atRiskValue: number
  deals: DealAnalysis[]
}

function isValidDeal(value: unknown): value is Deal {
  if (!value || typeof value !== "object") return false
  const d = value as Record<string, unknown>
  return (
    typeof d.company === "string" &&
    typeof d.dealSize === "number" &&
    typeof d.stage === "string" &&
    typeof d.daysInStage === "number" &&
    typeof d.lastActivityDays === "number"
  )
}

function analyzeDealsLocally(deals: Deal[]): { summary: string; deals: DealAnalysis[] } {
  const analyzed: DealAnalysis[] = deals.map((d) => {
    let score = 0
    const reasons: string[] = []

    if (d.lastActivityDays >= 21) {
      score += 3
      reasons.push(`no activity in ${d.lastActivityDays} days`)
    } else if (d.lastActivityDays >= 10) {
      score += 2
      reasons.push(`activity has slowed (${d.lastActivityDays} days since last touch)`)
    } else if (d.lastActivityDays >= 5) {
      score += 1
    }

    if (d.daysInStage >= 30) {
      score += 3
      reasons.push(`stuck in ${d.stage} for ${d.daysInStage} days`)
    } else if (d.daysInStage >= 14) {
      score += 2
      reasons.push(`${d.daysInStage} days in ${d.stage}, longer than typical`)
    } else if (d.daysInStage >= 7) {
      score += 1
    }

    if (d.dealSize >= 50000 && score >= 2) {
      score += 1
      reasons.push("large deal size raises the stakes if it slips")
    }

    let riskLevel: DealAnalysis["riskLevel"]
    if (score >= 4) riskLevel = "high"
    else if (score >= 2) riskLevel = "medium"
    else riskLevel = "low"

    const reason =
      reasons.length > 0
        ? `${reasons[0].charAt(0).toUpperCase()}${reasons[0].slice(1)}${reasons.length > 1 ? `; ${reasons.slice(1).join("; ")}` : ""}.`
        : `Healthy pace for the ${d.stage} stage.`

    return { company: d.company, riskLevel, reason }
  })

  const highCount = analyzed.filter((d) => d.riskLevel === "high").length
  const mediumCount = analyzed.filter((d) => d.riskLevel === "medium").length

  let summary: string
  if (highCount === 0 && mediumCount === 0) {
    summary = `All ${deals.length} deals are progressing normally with no signs of stalling. Pipeline health looks strong.`
  } else if (highCount === 0) {
    summary = `${mediumCount} of ${deals.length} deals show early warning signs of slowing down, but nothing critical yet. Worth a check-in on those.`
  } else {
    summary = `${highCount} of ${deals.length} deals are at high risk of stalling, mainly due to long gaps in activity or extended time in stage. These need attention soon to avoid slipping out of the quarter.`
  }

  return { summary, deals: analyzed }
}

export async function POST(request: Request) {
  let payload: DealsPayload

  try {
    const body: unknown = await request.json()
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new Error("Invalid request body")
    }
    payload = body as DealsPayload
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  if (!Array.isArray(payload.deals) || payload.deals.length === 0) {
    return NextResponse.json({ error: "At least one deal is required" }, { status: 400 })
  }

  const deals = payload.deals.filter(isValidDeal)

  if (deals.length === 0) {
    return NextResponse.json({ error: "No valid deals provided" }, { status: 400 })
  }

  const totalPipelineValue = deals.reduce((sum, d) => sum + d.dealSize, 0)

  const dealsSummary = deals
    .map(
      (d, i) =>
        `${i + 1}. ${d.company} — $${d.dealSize.toLocaleString()} — Stage: ${d.stage} — ${d.daysInStage} days in current stage — Last activity: ${d.lastActivityDays} days ago`
    )
    .join("\n")

  const prompt = `You are a B2B SaaS revenue operations analyst. Analyze this sales pipeline and flag deals at risk of stalling.

Deals:
${dealsSummary}

For each deal, assess risk level (low, medium, or high) based on:
- Time in current stage (longer = more risk)
- Days since last activity (longer = more risk, especially 14+ days)
- Deal size (larger deals stalling is more costly)

Respond with ONLY valid JSON, no markdown formatting, no code fences, matching this exact shape:
{
  "summary": "2-3 sentence plain-English summary of overall pipeline health",
  "deals": [
    { "company": "string", "riskLevel": "low" | "medium" | "high", "reason": "one sentence, specific and actionable" }
  ]
}`

  let parsed: { summary: string; deals: DealAnalysis[] }
  let usedFallback = false

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    })

    const textBlock = message.content.find((block) => block.type === "text")
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from model")
    }

    const cleaned = textBlock.text.replace(/```json|```/g, "").trim()
    parsed = JSON.parse(cleaned) as { summary: string; deals: DealAnalysis[] }
  } catch (error) {
    // AI call failed (billing, network, rate limit, etc.) — fall back to a
    // deterministic local analysis so the tool still works end-to-end.
    console.error("AI analysis failed, using local fallback:", error)
    parsed = analyzeDealsLocally(deals)
    usedFallback = true
  }

  const atRiskValue = deals
    .filter((_, i) => parsed.deals[i]?.riskLevel === "high")
    .reduce((sum, d) => sum + d.dealSize, 0)

  const result: AnalysisResult & { usedFallback: boolean } = {
    summary: parsed.summary,
    totalPipelineValue,
    atRiskValue,
    deals: parsed.deals,
    usedFallback,
  }

  return NextResponse.json(result)
}