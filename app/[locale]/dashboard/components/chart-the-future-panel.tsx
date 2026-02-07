"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  Brain,
  BrainCircuit,
  CandlestickChart,
  Gauge,
  Grip,
  LineChart,
  MessageSquare,
  MonitorSmartphone,
  Radar,
  Rocket,
  Settings2,
  ShieldAlert,
  ChartCandlestick,
  ShieldCheck,
  SlidersHorizontal,
  Target,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type FeatureToggleKey =
  | "aiChat"
  | "signals"
  | "riskCoach"
  | "strategyBuilder"
  | "portfolioOptimizer"
  | "alerts"
  | "autoRebalance";

type WidgetToggleKey =
  | "aiSignalBoard"
  | "marketSentiment"
  | "riskHeatmap"
  | "strategyBuilder"
  | "portfolioHealth"
  | "tradeTape";

type IndicatorKey = "rsi" | "macd" | "ema" | "volume";
type RiskProfile = "Conservative" | "Balanced" | "Aggressive";
type TerminalTab = "signals" | "strategies" | "insights";
type CallSide = "BUY" | "SELL";

type ToggleItem<T extends string> = {
  key: T;
  label: string;
  description: string;
};

type AICall = {
  id: string;
  pair: string;
  style: string;
  side: CallSide;
  horizon: string;
  confidence: number;
  entry: string;
  stopLoss: string;
  takeProfit: string;
  rationale: string;
};

const FEATURE_TOGGLES: ToggleItem<FeatureToggleKey>[] = [
  {
    key: "aiChat",
    label: "AI Chat Assistant",
    description: "Voice/text conversational trading support.",
  },
  {
    key: "signals",
    label: "Signal Engine",
    description: "Real-time futures buy/sell calls with confidence scoring.",
  },
  {
    key: "riskCoach",
    label: "Emotional Risk Coach",
    description: "Detect overtrading, revenge trading, and loss chasing.",
  },
  {
    key: "strategyBuilder",
    label: "Strategy Builder",
    description: "Generate and tune AI strategies, then backtest.",
  },
  {
    key: "portfolioOptimizer",
    label: "Portfolio Optimizer",
    description: "Risk-adjusted allocation guidance and exposure checks.",
  },
  {
    key: "alerts",
    label: "Proactive Alerts",
    description: "Push alerts for volatility, stop-loss updates, and bias.",
  },
  {
    key: "autoRebalance",
    label: "Auto-Rebalance",
    description: "AI-assisted rebalance recommendations for account health.",
  },
];

const WIDGET_TOGGLES: ToggleItem<WidgetToggleKey>[] = [
  {
    key: "aiSignalBoard",
    label: "AI Signal Board",
    description: "High-conviction setup stream and signal reasons.",
  },
  {
    key: "marketSentiment",
    label: "Market Sentiment",
    description: "Bullish/Bearish engine from news, flow, and technicals.",
  },
  {
    key: "riskHeatmap",
    label: "Risk Heatmap",
    description: "Exposure heatmap by symbol, session, and strategy.",
  },
  {
    key: "strategyBuilder",
    label: "Strategy Builder",
    description: "Deploy and monitor AI-generated strategy templates.",
  },
  {
    key: "portfolioHealth",
    label: "Portfolio Health",
    description: "Allocation, drawdown, and risk-reward overview.",
  },
  {
    key: "tradeTape",
    label: "Trade Tape",
    description: "Live trade tape and execution quality monitoring.",
  },
];

const INDICATORS: ToggleItem<IndicatorKey>[] = [
  { key: "rsi", label: "RSI", description: "Momentum" },
  { key: "macd", label: "MACD", description: "Trend strength" },
  { key: "ema", label: "EMA", description: "Dynamic trend" },
  { key: "volume", label: "Volume", description: "Participation" },
];

const AI_CALLS: AICall[] = [
  {
    id: "nq-scalp-long",
    pair: "NQ Mar26",
    style: "Scalping",
    side: "BUY",
    horizon: "+25m",
    confidence: 81,
    entry: "23,482.50",
    stopLoss: "23,458.25",
    takeProfit: "23,548.00",
    rationale:
      "Trend continuation with rising delta and supportive sentiment pulse.",
  },
  {
    id: "es-swing-short",
    pair: "ES Mar26",
    style: "Swing",
    side: "SELL",
    horizon: "+1h",
    confidence: 74,
    entry: "5,244.50",
    stopLoss: "5,258.25",
    takeProfit: "5,212.00",
    rationale:
      "Exhaustion near resistance and weak breadth signal in risk assets.",
  },
  {
    id: "cl-breakout-long",
    pair: "CL Mar26",
    style: "Trend",
    side: "BUY",
    horizon: "+45m",
    confidence: 77,
    entry: "74.82",
    stopLoss: "74.16",
    takeProfit: "76.05",
    rationale:
      "Breakout regime with improving macro sentiment and rising momentum.",
  },
];

const BEHAVIOR_ALERTS = [
  "You placed 6 trades in the last 40 minutes. Overtrading risk elevated.",
  "Loss aversion detected: holding a losing position beyond your baseline.",
  "Risk limit warning: projected daily risk at 93% of cap.",
];

const COGNITIVE_BIAS_ALERTS = [
  "Confirmation bias: repeated long entries while breadth remains weak.",
  "Recency bias: sizing up after two wins despite unchanged volatility regime.",
];

const FUTURE_MONITORING = [
  "Continuous model learning loop from accepted/rejected AI calls.",
  "Production monitoring plan with Datadog traces + Prometheus metrics.",
  "Feedback telemetry for strategy drift and alert quality improvements.",
];

const RISK_PROFILES: RiskProfile[] = ["Conservative", "Balanced", "Aggressive"];

const SYMBOLS = ["NQ Mar26", "ES Mar26", "CL Mar26", "GC Apr26"];
const TIMEFRAMES = ["1m", "5m", "15m", "1h", "4h"];
const TERMINAL_TABS: { id: TerminalTab; label: string }[] = [
  { id: "signals", label: "AI Signals" },
  { id: "strategies", label: "AI Strategies" },
  { id: "insights", label: "AI Insights" },
];

export function ChartTheFuturePanel() {
  const [features, setFeatures] = useState<Record<FeatureToggleKey, boolean>>({
    aiChat: true,
    signals: true,
    riskCoach: true,
    strategyBuilder: true,
    portfolioOptimizer: true,
    alerts: true,
    autoRebalance: true,
  });
  const [widgets, setWidgets] = useState<Record<WidgetToggleKey, boolean>>({
    aiSignalBoard: true,
    marketSentiment: true,
    riskHeatmap: true,
    strategyBuilder: true,
    portfolioHealth: true,
    tradeTape: false,
  });
  const [indicators, setIndicators] = useState<Record<IndicatorKey, boolean>>({
    rsi: true,
    macd: true,
    ema: true,
    volume: true,
  });
  const [riskProfile, setRiskProfile] = useState<RiskProfile>("Balanced");
  const [successThreshold, setSuccessThreshold] = useState(70);
  const [selectedSymbol, setSelectedSymbol] = useState(SYMBOLS[0]);
  const [selectedTimeframe, setSelectedTimeframe] = useState(TIMEFRAMES[1]);
  const [activeTerminalTab, setActiveTerminalTab] = useState<TerminalTab>("signals");
  const [selectedCallId, setSelectedCallId] = useState(AI_CALLS[0].id);
  const [chatDocked, setChatDocked] = useState(true);
  const [chatMinimized, setChatMinimized] = useState(false);

  const enabledCount = useMemo(
    () => Object.values(features).filter(Boolean).length,
    [features],
  );
  const enabledWidgetCount = useMemo(
    () => Object.values(widgets).filter(Boolean).length,
    [widgets],
  );
  const selectedCall = useMemo(
    () => AI_CALLS.find((call) => call.id === selectedCallId) ?? AI_CALLS[0],
    [selectedCallId],
  );

  const handleFeatureToggle = (key: FeatureToggleKey) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const handleWidgetToggle = (key: WidgetToggleKey) => {
    setWidgets((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const handleIndicatorToggle = (key: IndicatorKey) => {
    setIndicators((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const sideButtonClass = (side: CallSide) =>
    side === "BUY"
      ? "border-emerald-400/40 bg-emerald-500/20 text-emerald-200"
      : "border-rose-400/40 bg-rose-500/20 text-rose-200";

  return (
    <div className="mx-4 mt-2 mb-6 space-y-4">
      <section className="relative overflow-hidden rounded-[28px] border border-sky-500/25 bg-[radial-gradient(circle_at_15%_10%,rgba(59,130,246,0.2),transparent_42%),radial-gradient(circle_at_85%_0%,rgba(6,182,212,0.16),transparent_40%),linear-gradient(160deg,#020716_0%,#060d1f_48%,#070917_100%)] p-4 md:p-5 shadow-[0_20px_80px_rgba(8,20,52,0.45)]">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle,_rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="absolute -top-14 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -bottom-16 right-8 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 space-y-4">
          <header className="rounded-2xl border border-white/10 bg-[#030814]/80 px-3 py-3 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-200">
                  <ChartCandlestick className="size-3.5" />
                  Dashboard
                </div>
                <div className="hidden items-center gap-2 text-sm text-zinc-300 md:flex">
                  <span className="rounded-full border border-white/10 px-3 py-1">Markets</span>
                  <span className="rounded-full border border-white/10 px-3 py-1">Portfolio</span>
                  <span className="rounded-full border border-white/10 px-3 py-1">News</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-200">
                  AI 73.4
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-zinc-300">
                  17/76 Signals
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-zinc-300">
                  Futures Session
                </span>
              </div>
            </div>
          </header>

          <div className="grid gap-4 xl:grid-cols-[1.6fr_0.9fr]">
            <div className="grid gap-4 md:grid-cols-[44px_1fr]">
              <aside className="hidden flex-col items-center gap-2 rounded-2xl border border-white/10 bg-[#060c1c]/80 py-2 md:flex">
                {[BarChart3, CandlestickChart, Radar, SlidersHorizontal, MessageSquare, Gauge, Brain].map(
                  (Icon, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={cn(
                        "inline-flex h-8 w-8 items-center justify-center rounded-lg border text-zinc-300 transition-colors",
                        idx === 0
                          ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-200"
                          : "border-white/10 bg-white/5 hover:border-white/20",
                      )}
                      aria-label="tool"
                    >
                      <Icon className="size-4" />
                    </button>
                  ),
                )}
              </aside>

              <div className="space-y-4">
                <article className="rounded-2xl border border-sky-400/20 bg-[#060c1c]/85 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedSymbol}
                        onChange={(event) => setSelectedSymbol(event.target.value)}
                        className="rounded-lg border border-white/15 bg-[#030713] px-3 py-1.5 text-sm text-white outline-none"
                      >
                        {SYMBOLS.map((symbol) => (
                          <option key={symbol} value={symbol}>
                            {symbol}
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
                        {TIMEFRAMES.map((tf) => (
                          <button
                            key={tf}
                            type="button"
                            onClick={() => setSelectedTimeframe(tf)}
                            className={cn(
                              "rounded-md px-2 py-1 text-[11px] transition-colors",
                              selectedTimeframe === tf
                                ? "bg-cyan-500/20 text-cyan-200"
                                : "text-zinc-400 hover:text-zinc-200",
                            )}
                          >
                            {tf}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {INDICATORS.map((indicator) => (
                        <button
                          key={indicator.key}
                          type="button"
                          onClick={() => handleIndicatorToggle(indicator.key)}
                          className={cn(
                            "rounded-md border px-2 py-1 text-[11px] transition-colors",
                            indicators[indicator.key]
                              ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-200"
                              : "border-white/10 bg-white/5 text-zinc-400",
                          )}
                        >
                          {indicator.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative mt-3 h-[340px] overflow-hidden rounded-xl border border-cyan-500/25 bg-[radial-gradient(circle_at_50%_35%,rgba(56,189,248,0.2),transparent_45%),linear-gradient(180deg,#06112b_0%,#071024_55%,#050915_100%)]">
                    <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(148,163,184,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.2)_1px,transparent_1px)] [background-size:42px_32px]" />
                    <div className="absolute left-0 right-0 top-[24%] h-px bg-white/20" />
                    <div className="absolute left-0 right-0 top-[46%] h-px bg-white/15" />
                    <div className="absolute left-0 right-0 top-[68%] h-px bg-white/10" />

                    <svg
                      className="absolute inset-0 h-full w-full"
                      viewBox="0 0 1000 340"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M20 260 C120 280, 180 170, 250 190 C320 210, 370 95, 440 130 C510 165, 590 120, 660 145 C730 170, 770 80, 840 120 C910 160, 940 80, 980 62"
                        stroke="rgba(56,189,248,0.95)"
                        strokeWidth="3"
                      />
                      <path
                        d="M20 280 C120 300, 220 240, 310 248 C400 256, 480 220, 570 214 C660 208, 760 230, 840 205 C920 180, 960 192, 980 185"
                        stroke="rgba(148,163,184,0.7)"
                        strokeDasharray="6 8"
                        strokeWidth="2"
                      />
                      <circle cx="310" cy="248" r="5" fill="#67e8f9" />
                      <circle cx="660" cy="145" r="5" fill="#67e8f9" />
                      <circle cx="960" cy="62" r="6" fill="#67e8f9" />
                    </svg>

                    <div className="absolute bottom-5 left-5 right-5 flex items-end gap-[3px]">
                      {[36, 42, 30, 52, 48, 62, 56, 66, 71, 78, 65, 84, 79, 90, 82, 98, 88, 104, 96, 110].map(
                        (height, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "w-1.5 rounded-sm",
                              idx % 3 === 0 ? "bg-rose-400/70" : "bg-cyan-300/70",
                            )}
                            style={{ height }}
                          />
                        ),
                      )}
                    </div>

                    <span className="absolute left-6 top-6 rounded-lg border border-emerald-400/35 bg-emerald-500/20 px-2 py-1 text-xs font-semibold text-emerald-100">
                      $68.85 Uptrend
                    </span>
                    <span className="absolute left-[28%] top-[63%] rounded-lg border border-cyan-400/40 bg-cyan-500/20 px-2 py-1 text-xs font-semibold text-cyan-100">
                      AI BUY
                    </span>
                    <span className="absolute right-6 top-[23%] rounded-lg border border-cyan-400/35 bg-cyan-500/15 px-2 py-1 text-xs font-semibold text-cyan-100">
                      Target Zone
                    </span>
                  </div>
                </article>

                <article className="rounded-2xl border border-white/10 bg-[#060b18]/85 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">Today&apos;s AI Calls</p>
                    <span className="text-xs text-zinc-400">
                      Interactive recommendations with reasoning
                    </span>
                  </div>

                  <div className="space-y-2">
                    {AI_CALLS.map((call) => (
                      <button
                        key={call.id}
                        type="button"
                        onClick={() => setSelectedCallId(call.id)}
                        className={cn(
                          "w-full rounded-xl border p-3 text-left transition-colors",
                          selectedCallId === call.id
                            ? "border-cyan-400/40 bg-cyan-500/10"
                            : "border-white/10 bg-white/5 hover:border-white/25",
                        )}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {call.side} {call.pair}
                              <span className="ml-2 text-zinc-300">/ {call.style}</span>
                            </p>
                            <p className="mt-1 text-xs text-zinc-400">
                              Entry {call.entry} | Stop {call.stopLoss} | TP {call.takeProfit}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={cn(
                                "inline-flex rounded-md border px-2 py-1 text-xs font-semibold",
                                sideButtonClass(call.side),
                              )}
                            >
                              {call.side}
                            </span>
                            <p className="mt-1 text-xs text-cyan-200">
                              {call.confidence}% confidence
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </article>
              </div>
            </div>

            <aside className="space-y-4">
              <article className="rounded-2xl border border-white/10 bg-[#060b17]/90 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-4xl tracking-tight text-white">AI</h3>
                  <Settings2 className="size-4 text-zinc-400" />
                </div>
                <p className="mt-3 text-4xl font-semibold text-white">$62,835</p>
                <p className="mt-1 text-sm text-emerald-300">+3.57% session delta</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2 py-1 text-xs text-emerald-100">
                    Uptrend
                  </span>
                  <span className="rounded-full border border-cyan-400/30 bg-cyan-500/15 px-2 py-1 text-xs text-cyan-100">
                    Bullish sentiment
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-xs text-zinc-300">
                    Futures focus
                  </span>
                </div>
              </article>

              <article className="rounded-2xl border border-orange-400/25 bg-orange-500/8 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-orange-200">
                  AI Recommendation
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {selectedCall.side} {selectedCall.pair}
                </p>
                <p className="mt-2 text-sm text-zinc-200">{selectedCall.rationale}</p>
                <p className="mt-3 text-xs text-zinc-300">
                  Suggested stop-loss: {selectedCall.stopLoss} | take-profit: {selectedCall.takeProfit}
                </p>
              </article>

              <article className="rounded-2xl border border-white/10 bg-[#050a15]/90 p-3">
                <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
                  {TERMINAL_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTerminalTab(tab.id)}
                      className={cn(
                        "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                        activeTerminalTab === tab.id
                          ? "bg-cyan-500/20 text-cyan-100"
                          : "text-zinc-400 hover:text-zinc-200",
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {activeTerminalTab === "signals" && (
                  <div className="mt-3 space-y-2">
                    {AI_CALLS.map((call) => (
                      <button
                        key={`signal-${call.id}`}
                        type="button"
                        onClick={() => setSelectedCallId(call.id)}
                        className={cn(
                          "w-full rounded-lg border px-3 py-2 text-left",
                          selectedCallId === call.id
                            ? "border-cyan-400/40 bg-cyan-500/10"
                            : "border-white/10 bg-white/5",
                        )}
                      >
                        <p className="text-sm font-semibold text-white">
                          {call.side} {call.pair}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {call.horizon} | Conviction {call.confidence}%
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {activeTerminalTab === "strategies" && (
                  <div className="mt-3 space-y-2">
                    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                      <p className="text-sm font-semibold text-white">One-Click AI Strategy Deployment</p>
                      <p className="mt-1 text-xs text-zinc-400">
                        AI asks quick setup questions, then generates an optimized plan.
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button className="rounded-lg border border-cyan-400/40 bg-cyan-500/15 px-3 py-1.5 text-xs text-cyan-100">
                          Deploy
                        </button>
                        <button className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-zinc-200">
                          Backtest
                        </button>
                      </div>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                      <p className="text-sm font-semibold text-white">Dynamic Optimization</p>
                      <p className="mt-1 text-xs text-zinc-400">
                        Stop-loss and take-profit auto-adjust to volatility regime shifts.
                      </p>
                    </div>
                  </div>
                )}

                {activeTerminalTab === "insights" && (
                  <div className="mt-3 space-y-2">
                    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                      <p className="text-sm font-semibold text-white">Portfolio Health</p>
                      <p className="mt-1 text-xs text-zinc-300">
                        80% tech exposure detected. AI suggests partial rebalance to lower volatility.
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                      <p className="text-sm font-semibold text-white">Predictive Growth</p>
                      <p className="mt-1 text-xs text-zinc-300">
                        Expected 10.2% monthly growth under current conditions, risk-adjusted.
                      </p>
                    </div>
                  </div>
                )}
              </article>

              <article
                className={cn(
                  "rounded-2xl border bg-[#050a15]/92 p-3 transition-all",
                  chatDocked ? "border-white/10" : "border-cyan-400/45 shadow-[0_0_30px_rgba(34,211,238,0.2)]",
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">Chat with AI</p>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setChatDocked((prev) => !prev)}
                      className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[11px] text-zinc-300"
                    >
                      {chatDocked ? "Docked" : "Floating"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setChatMinimized((prev) => !prev)}
                      className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[11px] text-zinc-300"
                    >
                      {chatMinimized ? "Expand" : "Minimize"}
                    </button>
                  </div>
                </div>

                {!chatMinimized && (
                  <div className="mt-3 space-y-2">
                    <div className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 p-2 text-xs text-cyan-100">
                      What is the market outlook for {selectedSymbol}?
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-xs text-zinc-200">
                      AI sees a continuation setup. Keep risk under 1R and trail stop under VWAP.
                    </div>
                    <div className="rounded-lg border border-white/10 bg-[#030712] px-3 py-2 text-xs text-zinc-400">
                      Type command: &quot;Buy 1 contract when confidence &gt; {successThreshold}%&quot;
                    </div>
                  </div>
                )}
              </article>
            </aside>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-[#070c18] p-4">
          <div className="mb-3 flex items-center gap-2">
            <SlidersHorizontal className="size-4.5 text-cyan-300" />
            <h3 className="text-sm font-semibold text-white">AI Feature Controls</h3>
          </div>
          <div className="space-y-2">
            {FEATURE_TOGGLES.map((item) => (
              <div
                key={item.key}
                className="flex items-start justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
              >
                <div>
                  <p className="text-xs font-semibold text-white">{item.label}</p>
                  <p className="text-[11px] text-zinc-400">{item.description}</p>
                </div>
                <Switch
                  checked={features[item.key]}
                  onCheckedChange={() => handleFeatureToggle(item.key)}
                  aria-label={`toggle-${item.label}`}
                />
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-cyan-200">
            Active AI modules: {enabledCount}/{FEATURE_TOGGLES.length}
          </p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-[#070c18] p-4">
          <div className="mb-3 flex items-center gap-2">
            <Grip className="size-4.5 text-cyan-300" />
            <h3 className="text-sm font-semibold text-white">Widget Composer</h3>
          </div>
          <p className="mb-3 text-xs text-zinc-400">
            Add/remove AI widgets. Panels are drag-ready for workspace personalization.
          </p>
          <div className="space-y-2">
            {WIDGET_TOGGLES.map((item) => (
              <div
                key={item.key}
                className="flex items-start justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
              >
                <div>
                  <p className="text-xs font-semibold text-white">{item.label}</p>
                  <p className="text-[11px] text-zinc-400">{item.description}</p>
                </div>
                <Switch
                  checked={widgets[item.key]}
                  onCheckedChange={() => handleWidgetToggle(item.key)}
                  aria-label={`toggle-${item.label}`}
                />
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-cyan-200">
            Active widgets: {enabledWidgetCount}/{WIDGET_TOGGLES.length}
          </p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-[#070c18] p-4">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="size-4.5 text-cyan-300" />
            <h3 className="text-sm font-semibold text-white">Risk Personalization</h3>
          </div>
          <div className="space-y-2">
            {RISK_PROFILES.map((profile) => (
              <button
                key={profile}
                type="button"
                onClick={() => setRiskProfile(profile)}
                className={cn(
                  "w-full rounded-lg border px-3 py-2 text-left text-xs",
                  riskProfile === profile
                    ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-100"
                    : "border-white/10 bg-white/5 text-zinc-300",
                )}
              >
                {profile}
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3">
            <p className="text-xs font-semibold text-white">
              Alert only when success probability is above {successThreshold}%
            </p>
            <input
              type="range"
              min={50}
              max={90}
              value={successThreshold}
              onChange={(event) => setSuccessThreshold(Number(event.target.value))}
              className="mt-2 w-full accent-cyan-400"
            />
            <p className="mt-2 text-[11px] text-zinc-400">
              AI adapts signal frequency and stop management to {riskProfile} mode.
            </p>
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-[#070c18] p-4 xl:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <ShieldAlert className="size-4.5 text-orange-300" />
            <h3 className="text-sm font-semibold text-white">Risk and Emotional Coaching</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-200">
                Behavioral Alerts
              </p>
              <ul className="mt-2 space-y-2 text-xs text-zinc-300">
                {BEHAVIOR_ALERTS.map((alert) => (
                  <li key={alert} className="rounded-md border border-white/10 bg-black/20 p-2">
                    {alert}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-200">
                Cognitive Bias Detection
              </p>
              <ul className="mt-2 space-y-2 text-xs text-zinc-300">
                {COGNITIVE_BIAS_ALERTS.map((alert) => (
                  <li key={alert} className="rounded-md border border-white/10 bg-black/20 p-2">
                    {alert}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-[#070c18] p-4">
          <div className="mb-3 flex items-center gap-2">
            <MonitorSmartphone className="size-4.5 text-cyan-300" />
            <h3 className="text-sm font-semibold text-white">Post-Launch Ops</h3>
          </div>
          <ul className="space-y-2 text-xs text-zinc-300">
            {FUTURE_MONITORING.map((item) => (
              <li key={item} className="rounded-lg border border-white/10 bg-white/5 p-2">
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
            <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-zinc-200">
              Datadog
            </span>
            <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-zinc-200">
              Prometheus
            </span>
          </div>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-2xl border border-white/10 bg-[#070c18] p-3">
          <p className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
            <BrainCircuit className="size-4 text-cyan-300" />
            AI Intelligence
          </p>
          <p className="mt-2 text-[11px] text-zinc-400">
            Multi-turn AI conversations for live execution decisions.
          </p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-[#070c18] p-3">
          <p className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
            <LineChart className="size-4 text-cyan-300" />
            Dynamic Risk-Reward
          </p>
          <p className="mt-2 text-[11px] text-zinc-400">
            Real-time stop-loss and take-profit adjustment recommendations.
          </p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-[#070c18] p-3">
          <p className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
            <Rocket className="size-4 text-cyan-300" />
            Strategy Automation
          </p>
          <p className="mt-2 text-[11px] text-zinc-400">
            One-click deploy, backtest, optimize, and rebalance workflows.
          </p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-[#070c18] p-3">
          <p className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
            <Target className="size-4 text-cyan-300" />
            Futures Edge
          </p>
          <p className="mt-2 text-[11px] text-zinc-400">
            Built for futures traders with precision, speed, and discipline.
          </p>
        </article>
      </section>
    </div>
  );
}
