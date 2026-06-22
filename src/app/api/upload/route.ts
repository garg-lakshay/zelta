import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/authmiddleware";
import { generateAnalytics } from "@/services/analytics.service";

// ─── Column mapping helper ────────────────────────────────────────────────────
type CsvRow = Record<string, unknown>;

function getColumnValue(row: CsvRow, candidates: string[]): unknown {
  for (const key of candidates) {
    if (key in row && row[key] !== null && row[key] !== undefined && row[key] !== "") {
      return row[key];
    }
  }
  return null;
}

// ─── Trading column keywords for validation ───────────────────────────────────
const TRADING_KEYWORDS = [
  "symbol", "date", "quantity", "entry_price",
  "exit_price", "pnl", "sector", "price", "trade",
];

// ─── POST /api/upload ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // ── STEP 1: Read file from FormData ────────────────────────────────────────
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided. Please attach a CSV file." },
        { status: 400 },
      );
    }

    if (!file.name.endsWith(".csv")) {
      return NextResponse.json(
        { error: "Invalid file type. Only .csv files are accepted." },
        { status: 400 },
      );
    }

    const authResult = await verifyAuth(req);
    if (authResult instanceof NextResponse) return authResult;
    const userId = authResult.id;

    const csvText = await file.text();

    // ── STEP 2: Parse CSV ──────────────────────────────────────────────────────
    const parsed = Papa.parse<CsvRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, "_"),
    });

    if (!parsed.data.length) {
      return NextResponse.json(
        { error: "The CSV file is empty." },
        { status: 400 },
      );
    }

    // ── STEP 3: Validate it is a trading CSV ───────────────────────────────────
    const headers = Object.keys(parsed.data[0]);
    const matchCount = TRADING_KEYWORDS.filter((kw) =>
      headers.some((h) => h.includes(kw)),
    ).length;

    if (matchCount < 4) {
      return NextResponse.json(
        {
          error: "Invalid file. Please upload a trading history CSV.",
          hint: "File must contain trading columns like symbol, date, quantity, entry_price, exit_price, pnl",
        },
        { status: 400 },
      );
    }

    // ── STEP 4 & 5: Map columns → Trade model, validate, compute fields ────────
    const totalRows = parsed.data.length;
    const validTrades: {
      userId: string;
      symbol: string;
      sector: string | null;
      quantity: number;
      entryPrice: number;
      exitPrice: number;
      entryDate: Date;
      exitDate: Date;
      tradeValue: number;
      pnl: number;
      holdingDuration: number;
    }[] = [];

    for (const row of parsed.data) {
      const symbol = getColumnValue(row, [
        "symbol", "stock", "scrip", "instrument", "name", "ticker",
      ]);
      const quantityRaw = getColumnValue(row, [
        "quantity", "qty", "shares", "lots", "volume", "units",
      ]);
      const entryPriceRaw = getColumnValue(row, [
        "entry_price", "buy_price", "open_price", "purchase_price", "avg_buy_price",
      ]);
      const exitPriceRaw = getColumnValue(row, [
        "exit_price", "sell_price", "close_price", "selling_price", "avg_sell_price",
      ]);
      const dateRaw = getColumnValue(row, [
        "date", "trade_date", "entry_date", "buy_date", "transaction_date",
      ]);
      const exitDateRaw = getColumnValue(row, [
        "exit_date", "sell_date", "closing_date",
      ]);
      const pnlRaw = getColumnValue(row, [
        "pnl", "profit_loss", "profit", "net_profit", "realized_pnl", "p&l",
      ]);
      const sectorRaw = getColumnValue(row, [
        "sector", "industry", "category", "segment",
      ]);

      // Validate required fields
      if (!symbol || typeof symbol !== "string" || symbol.trim() === "") continue;

      const quantity = Number(quantityRaw);
      const entryPrice = Number(entryPriceRaw);
      const exitPrice = Number(exitPriceRaw);
      const pnl = pnlRaw !== null ? Number(pnlRaw) : (exitPrice - entryPrice) * quantity;

      if (!quantity || quantity <= 0) continue;
      if (!entryPrice || entryPrice <= 0) continue;
      if (!exitPrice || exitPrice <= 0) continue;

      const entryDate = dateRaw ? new Date(String(dateRaw)) : null;
      if (!entryDate || isNaN(entryDate.getTime())) continue;

      const exitDate = exitDateRaw
        ? new Date(String(exitDateRaw))
        : new Date(entryDate);

      if (isNaN(exitDate.getTime())) continue;

      const tradeValue = entryPrice * quantity;
      const holdingDuration =
        exitDate.getTime() !== entryDate.getTime()
          ? Math.round((exitDate.getTime() - entryDate.getTime()) / 60_000)
          : 0;

      validTrades.push({
        userId,
        symbol: symbol.trim().toUpperCase(),
        sector: sectorRaw ? String(sectorRaw).trim() : null,
        quantity,
        entryPrice,
        exitPrice,
        entryDate,
        exitDate,
        tradeValue,
        pnl: isNaN(pnl) ? 0 : pnl,
        holdingDuration,
      });
    }

    if (validTrades.length === 0) {
      return NextResponse.json(
        {
          error: "No valid trades found in the file.",
          hint: "Check that your CSV has valid numeric values for quantity, entry_price, exit_price",
        },
        { status: 400 },
      );
    }

    // ── STEP 6: Delete old trades, insert new ──────────────────────────────────
    await prisma.trade.deleteMany({ where: { userId } });
    await prisma.trade.createMany({ data: validTrades });

    // ── STEP 7: Calculate + save analytics immediately ─────────────────────────
    await generateAnalytics(userId);

    // ── STEP 8: Return success ─────────────────────────────────────────────────
    return NextResponse.json(
      {
        success: true,
        tradesInserted: validTrades.length,
        tradesSkipped: totalRows - validTrades.length,
      },
      { status: 200 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
