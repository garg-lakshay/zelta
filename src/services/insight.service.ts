import type { InsightInput, InsightItem } from "@/types/analytics.types";

const FALLBACK: InsightItem[] = [
  { type: "tip", message: "Upload more trades for detailed AI insights." },
];

export async function generateInsights(
  data: InsightInput,
): Promise<InsightItem[]> {
  const prompt = `You are a professional trading coach reviewing a trader's performance data.

Trader Statistics:
- Win Rate: ${data.winRate.toFixed(1)}%
- Profit Factor: ${data.profitFactor.toFixed(2)}
- Max Drawdown: ${data.maxDrawdown.toFixed(1)}%
- Discipline Score: ${data.disciplineScore}/100
- Emotional Score: ${data.emotionalScore}/100
- Risk Score: ${data.riskScore}/100
- Master Score: ${data.masterScore}/100
- Trader Personality: ${data.traderPersonality}
- Largest Losing Streak: ${data.largestLosingStreak} consecutive trades
- Revenge Trades Detected: ${data.revengeCount}
- Average Trades Per Day: ${data.averageTradesPerDay.toFixed(1)}
- Expectancy Per Trade: Rs ${data.expectancy.toFixed(0)}

Generate exactly 4 insights based on this data.
Use warnings for problems and tips for improvements.
Mention actual numbers from the data — be specific.
Keep each message under 20 words.

Return ONLY a raw JSON array. No markdown. No explanation. No code blocks.
[
  { "type": "warning", "message": "..." },
  { "type": "tip", "message": "..." }
]`;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("[Insights] GEMINI_API_KEY is not set.");
      return FALLBACK;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error(
        `[Insights] Gemini API error ${response.status}: ${errBody}`,
      );
      return FALLBACK;
    }

    const result = await response.json() as {
      candidates: { content: { parts: { text: string }[] } }[];
    };
    const raw: string = result.candidates[0].content.parts[0].text;
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned) as InsightItem[];
  } catch (err) {
    console.error("[Insights] Unexpected error:", err);
    return FALLBACK;
  }
}
