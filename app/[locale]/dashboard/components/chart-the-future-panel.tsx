"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  CandlestickChart,
  ChartCandlestick,
  Grip,
  Layers,
  MonitorSmartphone,
  Rocket,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type FeatureToggleKey =
  | "aiChat"
  | "signals"
  | "strategyBuilder"
  | "riskCoach"
  | "portfolioAI"
  | "alerts"
  | "autoRebalance";

type WidgetToggleKey =
  | "signalBoard"
  | "sentimentBoard"
  | "riskHeatmap"
  | "strategyPanel"
  | "portfolioPulse"
  | "chatDock";

type IndicatorKey = "rsi" | "macd" | "ema" | "volume";
type RiskProfile = "Conservative" | "Balanced" | "Aggressive";
type TerminalTab = "signals" | "strategies" | "insights";
type TradeSide = "BUY" | "SELL";

type ToggleItem<T extends string> = {
  key: T;
  label: string;
  description: string;
};

type SignalCall = {
  id: string;
  pair: string;
  side: TradeSide;
  style: string;
  confidence: number;
  horizon: string;
  entry: string;
  stopLoss: string;
  takeProfit: string;
  reason: string;
  sentiment: "Bullish" | "Bearish";
};

const FEATURE_SWITCHES: ToggleItem<FeatureToggleKey>[] = [
  {
    key: "aiChat",
    label: "AI Chat Assistant",
    description: "Enable conversational trading with voice/text commands.",
  },
  {
    key: "signals",
    label: "AI Signal Engine",
    description: "Show real-time buy/sell calls with explainable reasoning.",
  },
  {
    key: "strategyBuilder",
    label: "Strategy Builder",
    description: "Generate, customize, and deploy AI-assisted strategies.",
  },
  {
    key: "riskCoach",
    label: "Emotional Risk Coach",
    description: "Detect overtrading, panic exits, and revenge trading.",
  },
  {
    key: "portfolioAI",
    label: "Portfolio Intelligence",
    description: "Track allocation health and receive rebalance suggestions.",
  },
  {
    key: "alerts",
    label: "Proactive Alerts",
    description: "Notify on volatility spikes, stop-loss shifts, and risk events.",
  },
  {
    key: "autoRebalance",
    label: "Auto-Rebalance",
    description: "Allow AI to propose allocation adjustments when risk drifts.",
  },
];

const WIDGET_LIBRARY: ToggleItem<WidgetToggleKey>[] = [
  {
    key: "signalBoard",
    label: "Signal Board",
    description: "Live stream of high-conviction opportunities.",
  },
  {
    key: "sentimentBoard",
    label: "Sentiment Board",
    description: "Bullish/Bearish pulse from news, social, and technicals.",
  },
  {
    key: "riskHeatmap",
    label: "Risk Heatmap",
    description: "View exposure by symbol, setup, and session.",
  },
  {
    key: "strategyPanel",
    label: "Strategy Panel",
    description: "Manage one-click deploy and optimization workflows.",
  },
  {
    key: "portfolioPulse",
    label: "Portfolio Pulse",
    description: "Monitor concentration, drawdown, and growth projection.",
  },
  {
    key: "chatDock",
    label: "Dockable Chat",
    description: "Toggle floating or docked AI chat placement.",
  },
];

const INDICATORS: ToggleItem<IndicatorKey>[] = [
  { key: "rsi", label: "RSI", description: "Momentum" },
  { key: "macd", label: "MACD", description: "Trend" },
  { key: "ema", label: "EMA", description: "Bias" },
  { key: "volume", label: "Volume", description: "Flow" },
];

const SIGNAL_CALLS: SignalCall[] = [
  {
    id: "nq-long-01",
    pair: "NQ Mar26",
    side: "BUY",
    style: "Scalp",
    confidence: 81,
    horizon: "+25m",
    entry: "23,482.50",
    stopLoss: "23,458.25",
    takeProfit: "23,548.00",
    reason: "Breakout continuation with improving breadth and positive sentiment shift.",
    sentiment: "Bullish",
  },
  {
    id: "es-short-02",
    pair: "ES Mar26",
    side: "SELL",
    style: "Swing",
    confidence: 74,
    horizon: "+1h",
    entry: "5,244.50",
    stopLoss: "5,258.25",
    takeProfit: "5,212.00",
    reason: "Failed retest at resistance and declining momentum under heavy rotation.",
    sentiment: "Bearish",
  },
  {
    id: "cl-long-03",
    pair: "CL Mar26",
    side: "BUY",
    style: "Trend",
    confidence: 77,
    horizon: "+45m",
    entry: "74.82",
    stopLoss: "74.16",
    takeProfit: "76.05",
    reason: "Regime shift favors upside continuation with improving commodity momentum.",
    sentiment: "Bullish",
  },
];

const BIAS_ALERTS = [
  "Confirmation bias detected: repeated long entries despite weak breadth.",
  "Loss aversion drift: open loser held beyond your normal stop discipline.",
  "Recency bias risk: position size increased after two wins without volatility change.",
];

const BEHAVIOR_ALERTS = [
  "You executed 6 trades in 40 minutes. Overtrading probability is elevated.",
  "Daily risk utilization reached 93%. Consider reducing trade frequency.",
  "AI suggests reviewing your plan before placing the next order.",
];

const MONITORING_PLAN = [
  "Continuous learning loop from accepted and rejected AI calls.",
  "Datadog APM tracing for interaction latency and reliability.",
  "Prometheus metrics for chart responsiveness and signal throughput.",
];

const SYMBOLS = ["NQ Mar26", "ES Mar26", "CL Mar26", "GC Apr26"];
const TIMEFRAMES = ["1m", "5m", "15m", "1h", "4h"];
const RISK_PROFILES: RiskProfile[] = ["Conservative", "Balanced", "Aggressive"];
const TERMINAL_TABS: { id: TerminalTab; label: string }[] = [
  { id: "signals", label: "AI Signals" },
  { id: "strategies", label: "AI Strategies" },
  { id: "insights", label: "AI Insights" },
];

const SIDE_STYLE: Record<TradeSide, string> = {
  BUY: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  SELL: "border-rose-400/30 bg-rose-400/10 text-rose-200",
};

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45 },
};

export function ChartTheFuturePanel() {
  const [features, setFeatures] = useState<Record<FeatureToggleKey, boolean>>({
    aiChat: true,
    signals: true,
    strategyBuilder: true,
    riskCoach: true,
    portfolioAI: true,
    alerts: true,
    autoRebalance: true,
  });

  const [widgets, setWidgets] = useState<Record<WidgetToggleKey, boolean>>({
    signalBoard: true,
    sentimentBoard: true,
    riskHeatmap: true,
    strategyPanel: true,
    portfolioPulse: true,
    chatDock: true,
  });

  const [indicators, setIndicators] = useState<Record<IndicatorKey, boolean>>({
    rsi: true,
    macd: true,
    ema: true,
    volume: true,
  });

  const [symbol, setSymbol] = useState(SYMBOLS[0]);
  const [timeframe, setTimeframe] = useState(TIMEFRAMES[1]);
  const [selectedSignalId, setSelectedSignalId] = useState(SIGNAL_CALLS[0].id);
  const [terminalTab, setTerminalTab] = useState<TerminalTab>("signals");
  const [riskProfile, setRiskProfile] = useState<RiskProfile>("Balanced");
  const [successThreshold, setSuccessThreshold] = useState(70);
  const [aiProactivity, setAiProactivity] = useState(62);
  const [chatDocked, setChatDocked] = useState(true);
  const [chatMinimized, setChatMinimized] = useState(false);

  const selectedSignal = useMemo(
    () => SIGNAL_CALLS.find((item) => item.id === selectedSignalId) ?? SIGNAL_CALLS[0],
    [selectedSignalId],
  );

  const enabledFeatureCount = useMemo(
    () => Object.values(features).filter(Boolean).length,
    [features],
  );

  const enabledWidgetCount = useMemo(
    () => Object.values(widgets).filter(Boolean).length,
    [widgets],
  );

  const toggleFeature = (key: FeatureToggleKey) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleWidget = (key: WidgetToggleKey) => {
    setWidgets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleIndicator = (key: IndicatorKey) => {
    setIndicators((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="mx-4 mt-2 mb-6 space-y-4">
      <motion.section
        {...fadeUp}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/85 p-5 sm:p-6 shadow-[0_30px_90px_-55px_rgba(20,184,166,0.55)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(20,184,166,0.12),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(45,212,191,0.08),transparent_40%)]" />
        <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/25 bg-teal-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-teal-300">
              <Sparkles className="size-3.5" />
              Futures Intelligence Layer
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Chart The Future
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300 sm:text-base">
              A production-ready AI trading cockpit for futures execution. Keep the workspace clean,
              customize every module, and let adaptive intelligence handle signals, risk, and behavioral coaching.
            </p>
          </div>

          <div className="grid w-full gap-2 sm:grid-cols-3 xl:w-[420px]">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">AI Modules</p>
              <p className="mt-1 text-xl font-black text-teal-300">
                {enabledFeatureCount}/{FEATURE_SWITCHES.length}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Workspace Widgets</p>
              <p className="mt-1 text-xl font-black text-teal-300">
                {enabledWidgetCount}/{WIDGET_LIBRARY.length}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Risk Profile</p>
              <p className="mt-1 text-xl font-black text-teal-300">{riskProfile}</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Central Dashboard",
              text: "Chart, AI calls, and portfolio context in one command surface.",
              icon: Layers,
            },
            {
              title: "Conversational Trading",
              text: "Run commands like Buy 0.5 BTC at 60,000 with explainable outcomes.",
              icon: Bot,
            },
            {
              title: "Adaptive Risk Engine",
              text: "Behavior-aware alerts that adapt stop and exposure to your profile.",
              icon: ShieldCheck,
            },
            {
              title: "Continuous Learning",
              text: "Feedback loops keep model quality improving after launch.",
              icon: BrainCircuit,
            },
          ].map((item, idx) => (
            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.04, duration: 0.35 }}
              key={item.title}
              className="rounded-2xl border border-white/10 bg-zinc-900/60 px-4 py-3"
            >
              <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-teal-300">
                <item.icon className="size-3.5" />
                {item.title}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">{item.text}</p>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section
        {...fadeUp}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="grid gap-4 xl:grid-cols-[1.55fr_0.95fr]"
      >
        <motion.article
          initial={{ opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="rounded-3xl border border-white/10 bg-zinc-950/85 p-4 sm:p-5"
        >
          <header className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={symbol}
                onChange={(event) => setSymbol(event.target.value)}
                className="h-9 rounded-lg border border-white/15 bg-black/30 px-3 text-sm text-zinc-100 outline-none"
              >
                {SYMBOLS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <div className="inline-flex rounded-lg border border-white/10 bg-black/25 p-1">
                {TIMEFRAMES.map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setTimeframe(tf)}
                    className={cn(
                      "rounded-md px-2 py-1 text-[11px] font-semibold transition-colors",
                      timeframe === tf
                        ? "bg-teal-400/20 text-teal-200"
                        : "text-zinc-400 hover:text-zinc-200",
                    )}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {INDICATORS.map((indicator) => (
                <button
                  key={indicator.key}
                  type="button"
                  onClick={() => toggleIndicator(indicator.key)}
                  className={cn(
                    "rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors",
                    indicators[indicator.key]
                      ? "border-teal-400/35 bg-teal-400/12 text-teal-200"
                      : "border-white/10 bg-white/5 text-zinc-400",
                  )}
                >
                  {indicator.label}
                </button>
              ))}
            </div>
          </header>

          <div className="mt-4 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,#111827_0%,#0b1220_70%,#080d16_100%)] p-3">
            <div className="relative h-[320px] overflow-hidden rounded-xl border border-teal-400/20 bg-zinc-950">
              <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:42px_32px]" />
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 1000 320"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M25 255 C120 278, 188 165, 260 190 C332 215, 410 90, 485 132 C560 174, 636 116, 704 146 C772 176, 835 88, 900 112 C950 132, 972 96, 990 70"
                  stroke="rgba(45,212,191,0.95)"
                  strokeWidth="3"
                />
                <path
                  d="M25 272 C135 290, 230 240, 315 248 C400 256, 500 220, 592 212 C684 204, 770 222, 846 198 C914 176, 962 182, 990 172"
                  stroke="rgba(161,161,170,0.72)"
                  strokeDasharray="6 8"
                  strokeWidth="2"
                />
                <circle cx="315" cy="248" r="5" fill="#2dd4bf" />
                <circle cx="704" cy="146" r="5" fill="#2dd4bf" />
                <circle cx="982" cy="78" r="6" fill="#2dd4bf" />
              </svg>

              <span className="absolute left-5 top-5 rounded-lg border border-emerald-400/35 bg-emerald-400/10 px-2 py-1 text-xs font-semibold text-emerald-200">
                $68.85 Uptrend
              </span>
              <span className="absolute left-[24%] top-[62%] rounded-lg border border-teal-400/35 bg-teal-400/15 px-2 py-1 text-xs font-semibold text-teal-200">
                AI BUY
              </span>
              <span className="absolute right-5 top-[22%] rounded-lg border border-sky-400/35 bg-sky-400/10 px-2 py-1 text-xs font-semibold text-sky-200">
                Predicted Level
              </span>

              <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs">
                <span className="inline-flex items-center gap-1 text-emerald-200">
                  <TrendingUp className="size-3.5" />
                  Sentiment: Bullish
                </span>
                <span className="text-zinc-400">|</span>
                <span className="text-zinc-300">Volatility: High</span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-[0.12em] text-zinc-200">Today&apos;s AI Calls</h3>
              <p className="text-xs text-zinc-500">Click any call to inspect AI rationale</p>
            </div>

            {SIGNAL_CALLS.map((call) => (
              <button
                key={call.id}
                type="button"
                onClick={() => setSelectedSignalId(call.id)}
                className={cn(
                  "w-full rounded-2xl border p-3 text-left transition-colors",
                  selectedSignalId === call.id
                    ? "border-teal-400/40 bg-teal-400/8"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20",
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-zinc-100">
                      {call.side} {call.pair}
                      <span className="ml-2 text-zinc-400">/ {call.style}</span>
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
                      Entry {call.entry} | Stop {call.stopLoss} | TP {call.takeProfit}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={cn("rounded-md border px-2 py-1 text-xs font-semibold", SIDE_STYLE[call.side])}>
                      {call.side}
                    </span>
                    <p className="mt-1 text-xs text-teal-300">{call.confidence}% confidence</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.article>

        <motion.div
          initial={{ opacity: 0, x: 18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="space-y-4"
        >
          <article className="rounded-3xl border border-white/10 bg-zinc-950/85 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black tracking-tight text-white">AI Command Center</h3>
              <ChartCandlestick className="size-4 text-teal-300" />
            </div>

            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Selected Recommendation</p>
              <p className="mt-2 text-lg font-black text-zinc-100">
                {selectedSignal.side} {selectedSignal.pair}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-md border border-white/10 bg-black/30 px-2 py-1 text-zinc-300">
                  Horizon {selectedSignal.horizon}
                </span>
                <span
                  className={cn(
                    "rounded-md border px-2 py-1",
                    selectedSignal.sentiment === "Bullish"
                      ? "border-emerald-400/35 bg-emerald-400/10 text-emerald-200"
                      : "border-rose-400/35 bg-rose-400/10 text-rose-200",
                  )}
                >
                  {selectedSignal.sentiment}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-300">{selectedSignal.reason}</p>
              <p className="mt-2 text-xs text-zinc-400">
                Suggested stop-loss: {selectedSignal.stopLoss} | take-profit: {selectedSignal.takeProfit}
              </p>
            </div>

            <div className="mt-3 inline-flex w-full rounded-lg border border-white/10 bg-white/[0.03] p-1">
              {TERMINAL_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTerminalTab(tab.id)}
                  className={cn(
                    "flex-1 rounded-md px-2 py-1.5 text-xs font-semibold transition-colors",
                    terminalTab === tab.id
                      ? "bg-teal-400/20 text-teal-200"
                      : "text-zinc-400 hover:text-zinc-200",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {terminalTab === "signals" && (
              <div className="mt-3 space-y-2">
                {SIGNAL_CALLS.map((call) => (
                  <div key={`mini-${call.id}`} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                    <p className="text-sm font-semibold text-zinc-100">
                      {call.side} {call.pair}
                    </p>
                    <p className="text-xs text-zinc-400">{call.horizon} | Conviction {call.confidence}%</p>
                  </div>
                ))}
              </div>
            )}

            {terminalTab === "strategies" && (
              <div className="mt-3 space-y-2">
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-sm font-semibold text-zinc-100">One-Click AI Strategy Deployment</p>
                  <p className="mt-1 text-xs text-zinc-400">
                    AI asks quick inputs: risk tolerance and assets, then builds strategy templates.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button className="rounded-lg bg-teal-400 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-black">
                      Deploy
                    </button>
                    <button className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-zinc-200">
                      Backtest
                    </button>
                  </div>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-sm font-semibold text-zinc-100">Dynamic Optimization</p>
                  <p className="mt-1 text-xs text-zinc-400">
                    Live volatility updates auto-tune stop-loss, take-profit, and execution timing.
                  </p>
                </div>
              </div>
            )}

            {terminalTab === "insights" && (
              <div className="mt-3 space-y-2">
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-sm font-semibold text-zinc-100">Portfolio Health Monitor</p>
                  <p className="mt-1 text-xs text-zinc-300">
                    80% concentration in tech-sensitive instruments. AI suggests reducing beta exposure.
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-sm font-semibold text-zinc-100">Predictive Growth</p>
                  <p className="mt-1 text-xs text-zinc-300">
                    Current projection: +10.2% next month under present market regime.
                  </p>
                </div>
              </div>
            )}
          </article>

          <article
            className={cn(
              "rounded-3xl border bg-zinc-950/85 p-4 transition-all",
              chatDocked
                ? "border-white/10"
                : "border-teal-400/40 shadow-[0_20px_70px_-50px_rgba(20,184,166,0.8)]",
            )}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-[0.12em] text-zinc-200">Chat With AI</h3>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setChatDocked((prev) => !prev)}
                  className="rounded-md border border-white/15 bg-white/[0.03] px-2 py-1 text-[11px] text-zinc-300"
                >
                  {chatDocked ? "Docked" : "Floating"}
                </button>
                <button
                  type="button"
                  onClick={() => setChatMinimized((prev) => !prev)}
                  className="rounded-md border border-white/15 bg-white/[0.03] px-2 py-1 text-[11px] text-zinc-300"
                >
                  {chatMinimized ? "Expand" : "Minimize"}
                </button>
              </div>
            </div>

            {!chatMinimized && (
              <div className="mt-3 space-y-2">
                <div className="rounded-lg border border-teal-400/30 bg-teal-400/10 p-2 text-xs text-teal-100">
                  What should I do if my stop-loss is hit on {symbol}?
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2 text-xs text-zinc-200">
                  Reduce size by 20%, wait for confirmation candle, and avoid immediate revenge entry.
                </div>
                <div className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-xs text-zinc-400">
                  Example command: Buy 0.5 BTC at 60,000 when confidence is above {successThreshold}%.
                </div>
              </div>
            )}
          </article>
        </motion.div>
      </motion.section>

      <motion.section
        {...fadeUp}
        transition={{ duration: 0.45, delay: 0.08 }}
        className="grid gap-4 lg:grid-cols-3"
      >
        <article className="rounded-3xl border border-white/10 bg-zinc-950/85 p-4">
          <div className="mb-3 flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-teal-300" />
            <h3 className="text-sm font-black uppercase tracking-[0.12em] text-zinc-200">AI Feature Controls</h3>
          </div>

          <div className="space-y-2">
            {FEATURE_SWITCHES.map((item) => (
              <div
                key={item.key}
                className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2"
              >
                <div>
                  <p className="text-xs font-semibold text-zinc-100">{item.label}</p>
                  <p className="text-[11px] text-zinc-400">{item.description}</p>
                </div>
                <Switch
                  checked={features[item.key]}
                  onCheckedChange={() => toggleFeature(item.key)}
                  aria-label={`toggle-${item.label}`}
                />
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-[11px] font-semibold text-zinc-200">
              AI proactivity level: {aiProactivity}%
            </p>
            <input
              type="range"
              min={10}
              max={100}
              value={aiProactivity}
              onChange={(event) => setAiProactivity(Number(event.target.value))}
              className="mt-2 w-full accent-teal-400"
            />
            <p className="mt-1 text-[11px] text-zinc-500">
              Controls how often AI proactively suggests trades and risk actions.
            </p>
          </div>
        </article>

        <article className="rounded-3xl border border-white/10 bg-zinc-950/85 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Grip className="size-4 text-teal-300" />
            <h3 className="text-sm font-black uppercase tracking-[0.12em] text-zinc-200">Widget Composer</h3>
          </div>

          <p className="mb-3 text-xs text-zinc-400">
            Add or remove modules to keep the workspace minimal. Drag-and-drop panel layout can be enabled from this tab.
          </p>

          <div className="space-y-2">
            {WIDGET_LIBRARY.map((item) => (
              <div
                key={item.key}
                className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2"
              >
                <div>
                  <p className="text-xs font-semibold text-zinc-100">{item.label}</p>
                  <p className="text-[11px] text-zinc-400">{item.description}</p>
                </div>
                <Switch
                  checked={widgets[item.key]}
                  onCheckedChange={() => toggleWidget(item.key)}
                  aria-label={`widget-${item.label}`}
                />
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-white/10 bg-zinc-950/85 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Target className="size-4 text-teal-300" />
            <h3 className="text-sm font-black uppercase tracking-[0.12em] text-zinc-200">Risk Personalization</h3>
          </div>

          <div className="space-y-2">
            {RISK_PROFILES.map((profile) => (
              <button
                key={profile}
                type="button"
                onClick={() => setRiskProfile(profile)}
                className={cn(
                  "w-full rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-colors",
                  riskProfile === profile
                    ? "border-teal-400/35 bg-teal-400/10 text-teal-200"
                    : "border-white/10 bg-white/[0.03] text-zinc-300",
                )}
              >
                {profile}
              </button>
            ))}
          </div>

          <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-[11px] font-semibold text-zinc-200">
              Notify only when success probability is above {successThreshold}%
            </p>
            <input
              type="range"
              min={50}
              max={90}
              value={successThreshold}
              onChange={(event) => setSuccessThreshold(Number(event.target.value))}
              className="mt-2 w-full accent-teal-400"
            />
            <p className="mt-1 text-[11px] text-zinc-500">
              Keeps signal flow aligned with your tolerance and execution style.
            </p>
          </div>
        </article>
      </motion.section>

      <motion.section
        {...fadeUp}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="grid gap-4 xl:grid-cols-3"
      >
        <article className="rounded-3xl border border-white/10 bg-zinc-950/85 p-4 xl:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <ShieldAlert className="size-4 text-amber-300" />
            <h3 className="text-sm font-black uppercase tracking-[0.12em] text-zinc-200">Risk And Emotional Coaching</h3>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-300">Behavior Alerts</p>
              <ul className="mt-2 space-y-2 text-xs text-zinc-300">
                {BEHAVIOR_ALERTS.map((item) => (
                  <li key={item} className="rounded-lg border border-white/10 bg-black/25 px-2 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-300">Cognitive Bias Detection</p>
              <ul className="mt-2 space-y-2 text-xs text-zinc-300">
                {BIAS_ALERTS.map((item) => (
                  <li key={item} className="rounded-lg border border-white/10 bg-black/25 px-2 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-white/10 bg-zinc-950/85 p-4">
          <div className="mb-3 flex items-center gap-2">
            <MonitorSmartphone className="size-4 text-teal-300" />
            <h3 className="text-sm font-black uppercase tracking-[0.12em] text-zinc-200">Portfolio And Ops</h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-300">Portfolio Health</p>
            <p className="mt-2 text-xs text-zinc-300">
              Overexposed to tech futures. AI suggests partial rebalance into lower-correlation instruments.
            </p>
            <p className="mt-2 text-xs text-teal-300">Projected monthly growth: +10.2%</p>
          </div>

          <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-300">Post-Launch Monitoring</p>
            <ul className="mt-2 space-y-2 text-xs text-zinc-300">
              {MONITORING_PLAN.map((item) => (
                <li key={item} className="rounded-lg border border-white/10 bg-black/25 px-2 py-2">
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] font-semibold">
              <span className="rounded-md border border-white/10 bg-black/20 px-2 py-1 text-center text-zinc-200">Datadog</span>
              <span className="rounded-md border border-white/10 bg-black/20 px-2 py-1 text-center text-zinc-200">Prometheus</span>
            </div>
          </div>
        </article>
      </motion.section>

      <motion.section
        {...fadeUp}
        transition={{ duration: 0.45, delay: 0.12 }}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          {
            title: "Signal Transparency",
            copy: "Every call includes confidence, rationale, and risk-reward context.",
            icon: BarChart3,
          },
          {
            title: "Strategy Lifecycle",
            copy: "Design, deploy, backtest, and continuously optimize from one flow.",
            icon: Rocket,
          },
          {
            title: "Futures Focus",
            copy: "Built for discretionary futures traders who value precision over noise.",
            icon: CandlestickChart,
          },
          {
            title: "Execution Discipline",
            copy: "Guardrails and coaching reduce emotional errors before they compound.",
            icon: Zap,
          },
        ].map((item, idx) => (
          <motion.article
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            key={item.title}
            className="rounded-2xl border border-white/10 bg-zinc-950/85 p-3"
          >
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-teal-300">
              <item.icon className="size-3.5" />
              {item.title}
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-zinc-400">{item.copy}</p>
          </motion.article>
        ))}
      </motion.section>

      <motion.section
        {...fadeUp}
        transition={{ duration: 0.45, delay: 0.14 }}
        className="rounded-3xl border border-white/10 bg-gradient-to-r from-zinc-950/90 to-zinc-900/85 p-4 sm:p-5"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-teal-300">Next Step</p>
            <h3 className="mt-1 text-lg font-black tracking-tight text-white">Ready To Connect Live Data</h3>
            <p className="mt-1 text-xs text-zinc-400">
              Hook this interface to real chart feeds, model outputs, and broker execution endpoints.
            </p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-black">
            Enable Live Mode
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </motion.section>
    </div>
  );
}
