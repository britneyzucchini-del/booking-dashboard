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

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    })

    const textBlock = message.content.find((block) => block.type === "text")
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from model")
    }

    const cleaned = textBlock.text.replace(/```json|```/g, "").trim()
    const parsed = JSON.parse(cleaned) as { summary: string; deals: DealAnalysis[] }

    const atRiskValue = deals
      .filter((_, i) => parsed.deals[i]?.riskLevel === "high")
      .reduce((sum, d) => sum + d.dealSize, 0)

    const result: AnalysisResult = {
      summary: parsed.summary,
      totalPipelineValue,
      atRiskValue,
      deals: parsed.deals,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Deal analysis failed:", error)
    return NextResponse.json({ error: "Failed to analyze deals" }, { status: 500 })
  }
}