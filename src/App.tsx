import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Settings, 
  History, 
  Terminal, 
  TrendingUp, 
  Shield, 
  Zap, 
  AlertTriangle,
  Wallet,
  Play,
  Pause,
  ChevronRight,
  Database,
  BarChart3,
  Globe,
  Plus,
  Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { format } from 'date-fns';
import { cn } from './lib/utils';
import { RiskLevel, Trade, Market, AgentSettings } from './types';

// Mock Data
const MOCK_PNL_DATA = Array.from({ length: 24 }, (_, i) => ({
  time: format(new Date(Date.now() - (23 - i) * 3600000), 'HH:mm'),
  value: 1400 + Math.random() * 200 + i * 25 // Simulated profit curve starting from $1400
}));

const DIVERSE_EVENTS = [
  "US Election 2028: Candidate X Leads",
  "Bitcoin Spot ETF Inflow > $1B",
  "Taylor Swift New Album Announcement",
  "Champions League: Real Madrid vs Man City",
  "Tesla Model 2 Reveal Date",
  "GPT-5 Release Window",
  "SpaceX Starship Booster Catch",
  "Fed Rate Decision: 25bps Cut",
  "Apple Vision Pro 2 Sales Target",
  "Olympics 100m Gold Medalist"
];

const MOCK_MARKETS: Market[] = [
  { 
    id: '1', 
    question: 'Next president of the USA in 2028?', 
    liquidity: 12000000, 
    volume: 85000000, 
    yesProbability: 0.45, 
    aiConfidence: 88, 
    aiVerdict: 'YES',
    category: 'Politics'
  },
  { 
    id: '2', 
    question: 'Will Bitcoin reach $150k in 2026?', 
    liquidity: 5000000, 
    volume: 25000000, 
    yesProbability: 0.62, 
    aiConfidence: 72, 
    aiVerdict: 'YES',
    category: 'Crypto'
  },
  { 
    id: '3', 
    question: 'Will SpaceX land human on Mars before 2028?', 
    liquidity: 1500000, 
    volume: 4500000, 
    yesProbability: 0.12, 
    aiConfidence: 95, 
    aiVerdict: 'NO',
    category: 'Science'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'settings'>('dashboard');
  const [isLive, setIsLive] = useState(true);
  const [logs, setLogs] = useState<{ id: number; msg: string; type: 'info' | 'trade' | 'warn' }[]>([]);
  const [history, setHistory] = useState<Trade[]>([
    { id: 'h1', market: 'Fed Rate Cut in June', outcome: 'YES', stake: 250, odds: 0.6, timestamp: Date.now() - 3600000, status: 'WON', analysis: 'Macro alignment' },
    { id: 'h2', market: 'Nvidia Earnings Beat', outcome: 'YES', stake: 500, odds: 0.8, timestamp: Date.now() - 7200000, status: 'WON', analysis: 'GPU demand high' }
  ]);
  const [settings, setSettings] = useState<AgentSettings>({
    autoTrade: true,
    maxStake: 100,
    riskLevel: RiskLevel.MEDIUM,
    preferredCategories: ['Politics', 'Crypto', 'Sports'],
    minConfidence: 75
  });
  const [balance, setBalance] = useState({ total: 43241.50, monthProfit: 17421.00, dayChange: +2.15 });
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const terminalRef = useRef<HTMLDivElement>(null);

  // PWA Install Prompt
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // Simulate AI Thinking and Trading
  useEffect(() => {
    if (!isLive) return;
    
    const messages = [
      "Analyzing latest CNN headlines for Politics sentiment...",
      "Correlating BTC options data with macro indicators...",
      "Detection of whale activity in Market #82. Confidence +5%.",
      "Event confirmed: Fed maintains rates. Recalculating sci/crypto stakes.",
      "Optimizing YES/NO spread on 'SpaceX Mars' market.",
      "Sentiment drift detected in Sports sector. Reducing exposure.",
      "NEW TRADE: Executing neural match strategy...",
      "RE-BALANCING: Adjusting position due to market volatility.",
      "SCRAPING: Evaluating 1,200 new data points from Twitter/X feed.",
      "HEURISTIC: High-confidence signal detected."
    ];

    const timer = setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      const type = msg.includes('NEW TRADE') ? 'trade' : msg.includes('Detection') || msg.includes('Adjusting') ? 'warn' : 'info';
      
      setLogs(prev => [...prev.slice(-49), { 
        id: Date.now(), 
        msg, 
        type
      }]);

      if (type === 'trade') {
         const event = DIVERSE_EVENTS[Math.floor(Math.random() * DIVERSE_EVENTS.length)];
         const stakeVal = parseFloat((Math.random() * settings.maxStake).toFixed(2));
         const newTrade: Trade = {
            id: Math.random().toString(36),
            market: event,
            outcome: Math.random() > 0.5 ? 'YES' : 'NO',
            stake: stakeVal,
            odds: parseFloat((0.5 + Math.random() * 0.4).toFixed(2)),
            timestamp: Date.now(),
            status: 'PENDING',
            analysis: 'Automated neural match'
         };
         setHistory(prev => [newTrade, ...prev.slice(0, 19)]);
         setBalance(b => ({ 
            ...b, 
            total: parseFloat((b.total + 1.25).toFixed(2)), 
            monthProfit: parseFloat((b.monthProfit + 1.25).toFixed(2)) 
         })); 
      }
    }, 2800);

    return () => clearInterval(timer);
  }, [isLive, settings.maxStake]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-16 md:w-64 border-r border-slate-200 flex flex-col items-center py-6 gap-8 bg-white shadow-sm z-10">
        <div className="flex items-center gap-3 px-4">
          <div className="w-10 h-10 bg-sky-500 border-2 border-sky-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-200">
            <Zap className="text-white w-6 h-6 fill-current" />
          </div>
          <h1 className="text-xl font-bold tracking-tight hidden md:block text-slate-900">
            Poly<span className="text-sky-500">Agent</span>
          </h1>
        </div>

        <nav className="flex flex-col w-full gap-2 px-3 flex-1">
          <NavItem 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            icon={<TrendingUp size={20} />} 
            label="Dashboard" 
          />
          <NavItem 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
            icon={<History size={20} />} 
            label="Trade History" 
          />
          <NavItem 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
            icon={<Settings size={20} />} 
            label="Agent Settings" 
          />
        </nav>

        <div className="w-full px-4 mb-4">
          <div className={cn(
            "p-3 rounded-xl border flex items-center gap-3 transition-colors",
            isLive ? "border-sky-200 bg-sky-50" : "border-slate-200 bg-slate-100"
          )}>
            <div className={cn("w-2 h-2 rounded-full", isLive ? "bg-sky-500 animate-pulse" : "bg-slate-400")} />
            <span className="text-[10px] font-bold tracking-tighter hidden md:block text-slate-500">{isLive ? "SYSTEM ACTIVE" : "SYSTEM STANDBY"}</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-8">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Portfolio</p>
              <h2 className="text-xl font-mono font-bold leading-none text-slate-900">${balance.total.toFixed(2)}</h2>
            </div>
            <div className="hidden sm:block h-8 w-[1px] bg-slate-200" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">30d Net Profit</p>
              <p className="text-sm font-mono font-bold leading-none text-sky-600">
                +${balance.monthProfit.toLocaleString()}
              </p>
            </div>
            <div className="hidden sm:block h-8 w-[1px] bg-slate-200" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">24h Gain</p>
              <p className={cn("text-sm font-mono font-bold leading-none", balance.dayChange >= 0 ? "text-emerald-600" : "text-rose-600")}>
                {balance.dayChange >= 0 ? "+" : ""}{balance.dayChange.toFixed(2)}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsLive(!isLive)}
              className={cn(
                "px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all border shadow-sm",
                isLive 
                  ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100" 
                  : "bg-sky-50 border-sky-200 text-sky-600 hover:bg-sky-100"
              )}
            >
              {isLive ? <Pause size={14} /> : <Play size={14} />}
              {isLive ? "Stop Neural Core" : "Resume Analysis"}
            </button>
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shadow-inner">
               <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=PolyAgent`} alt="Avatar" className="w-8 h-8" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Log & Performance */}
              <div className="lg:col-span-8 space-y-6">
                {/* Performance Chart */}
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Profit Accumulation</h3>
                      <p className="text-sm text-slate-500">Net neural trading gains over time</p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                      <Activity size={12} /> Neural Stream
                    </div>
                  </div>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MOCK_PNL_DATA}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" vertical={false} />
                        <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} hide />
                        <Tooltip 
                          formatter={(value: number) => [`+$${value.toLocaleString()}`, 'Total Profit']}
                          contentStyle={{ background: '#ffffff', border: '1px solid #bae6fd', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
                          labelStyle={{ color: '#64748b' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#0ea5e9" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorValue)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Agent Thoughts Terminal */}
                <div className="bg-[#0f172a] rounded-2xl flex flex-col h-[300px] shadow-xl overflow-hidden border border-slate-800">
                  <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <Terminal size={14} className="text-sky-400" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">PolyAgent Core Intelligence v2.4</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">READY</span>
                    </div>
                  </div>
                  <div 
                    ref={terminalRef}
                    className="flex-1 overflow-y-auto p-5 font-mono text-[11px] terminal-scroll leading-relaxed"
                  >
                    {logs.length === 0 && <p className="text-slate-600 italic">Awakening agent... Connecting to data sources...</p>}
                    {logs.map((log) => (
                      <div key={log.id} className="mb-1.5 flex gap-3 group">
                        <span className="text-slate-600 whitespace-nowrap opacity-50 group-hover:opacity-100 transition-opacity">[{format(new Date(log.id), 'HH:mm:ss')}]</span>
                        <span className={cn(
                          log.type === 'trade' ? 'text-sky-400 font-bold' : 
                          log.type === 'warn' ? 'text-amber-400' : 'text-slate-300'
                        )}>
                          {log.msg}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Active Markets */}
              <div className="lg:col-span-4 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold flex items-center gap-2 text-slate-700">
                    <Database size={18} className="text-sky-500" />
                    Target Fields
                  </h3>
                   <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 rounded-full border border-sky-100">AI ACTIVE</span>
                </div>
                
                <div className="space-y-4">
                  {MOCK_MARKETS.map(market => (
                    <MarketCard key={market.id} market={market} />
                  ))}
                  
                  <button className="w-full py-4 border border-dashed border-slate-300 rounded-2xl text-slate-400 text-xs font-bold hover:border-sky-400 hover:text-sky-500 transition-all flex flex-col items-center justify-center gap-2 bg-slate-50/50">
                    <Plus size={20} />
                    Add Custom Tracker
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-3xl mx-auto py-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-3xl overflow-hidden"
              >
                <div className="p-8 border-b border-slate-200 bg-slate-50/50">
                  <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-900">
                    <Settings className="text-sky-500" />
                    Orchestration
                  </h2>
                  <p className="text-slate-500 mt-2">Adjust the cognitive boundaries of your PolyAgent trading core.</p>
                </div>

                <div className="p-8 space-y-6">
                  <SettingItem 
                    title="Risk Protocol" 
                    description="Defines execution aggression and portfolio safety margins."
                    icon={<Shield size={20} className="text-sky-500" />}
                  >
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                      {Object.values(RiskLevel).map(level => (
                        <button
                          key={level}
                          onClick={() => setSettings({...settings, riskLevel: level})}
                          className={cn(
                            "flex-1 py-2 text-[10px] font-bold rounded-lg transition-all",
                            settings.riskLevel === level ? "bg-white text-sky-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                          )}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </SettingItem>

                  <SettingItem 
                    title="Maximum Allocation" 
                    description="Upper capital limit allowed per individual execution."
                    icon={<BarChart3 size={20} className="text-sky-500" />}
                  >
                     <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setSettings({...settings, maxStake: Math.max(0, settings.maxStake - 10)})}
                          className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-100 bg-white shadow-sm"
                        >
                          <Minus size={16} className="text-slate-600" />
                        </button>
                        <div className="flex-1 text-center font-mono text-2xl font-bold text-slate-900">${settings.maxStake}</div>
                        <button 
                          onClick={() => setSettings({...settings, maxStake: settings.maxStake + 10})}
                          className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-100 bg-white shadow-sm"
                        >
                          <Plus size={16} className="text-slate-600" />
                        </button>
                     </div>
                  </SettingItem>

                  <SettingItem 
                    title="Autopilot Protocol" 
                    description="Permits PolyAgent to execute trades without human intervention."
                    icon={<Zap size={20} className="text-sky-500" />}
                  >
                    <div 
                      onClick={() => setSettings({...settings, autoTrade: !settings.autoTrade})}
                      className={cn(
                        "w-14 h-7 rounded-full relative cursor-pointer p-1 transition-all",
                        settings.autoTrade ? "bg-sky-500" : "bg-slate-300"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 bg-white rounded-full transition-all shadow-md",
                        settings.autoTrade ? "translate-x-7" : "translate-x-0"
                      )} />
                    </div>
                  </SettingItem>

                  {deferredPrompt && (
                    <SettingItem 
                      title="Install Application" 
                      description="Install PolyAgent as a standalone application on your device for a full-screen experience."
                      icon={<Plus size={20} className="text-sky-500" />}
                    >
                      <button 
                        onClick={handleInstallClick}
                        className="w-full py-3 bg-sky-50 border border-sky-200 text-sky-600 font-bold rounded-xl hover:bg-sky-100 transition-all flex items-center justify-center gap-2"
                      >
                        <Zap size={16} />
                        Install PolyAgent
                      </button>
                    </SettingItem>
                  )}

                  <div className="pt-6 flex gap-4">
                    <button className="flex-1 py-4 bg-sky-500 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-sky-200 transition-all active:scale-[0.98]">
                      Apply Protocols
                    </button>
                    <button className="px-8 py-4 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all">
                      Diagnostics
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === 'history' && (
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">Audit Registry</h2>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                    <History size={14} /> showing latest 20
                  </div>
                </div>

                <div className="glass-card rounded-2xl overflow-hidden">
                   <table className="w-full text-left font-mono text-xs">
                      <thead>
                         <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="p-5 font-bold text-slate-400 uppercase tracking-widest">Timestamp</th>
                            <th className="p-5 font-bold text-slate-400 uppercase tracking-widest">Target Market</th>
                            <th className="p-5 font-bold text-slate-400 uppercase tracking-widest">Direction</th>
                            <th className="p-5 font-bold text-slate-400 uppercase tracking-widest">Allocation</th>
                            <th className="p-5 font-bold text-slate-400 uppercase tracking-widest">Net Realized</th>
                         </tr>
                      </thead>
                      <tbody>
                         {history.map((t, i) => (
                            <motion.tr 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              key={t.id} 
                              className="border-b border-slate-50 hover:bg-sky-50/30 transition-colors group"
                            >
                               <td className="p-5 text-slate-400">{format(new Date(t.timestamp), 'yyyy-MM-dd HH:mm')}</td>
                               <td className="p-5 font-bold text-slate-700">{t.market}</td>
                               <td className="p-5">
                                 <span className={cn(
                                   "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                                   t.outcome === 'YES' ? 'bg-sky-50 text-sky-600 border-sky-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                 )}>
                                   {t.outcome}
                                 </span>
                               </td>
                               <td className="p-5 font-bold text-slate-600">${t.stake.toFixed(2)}</td>
                               <td className="p-5">
                                  <span className={cn(
                                    "font-bold",
                                    t.status === 'WON' ? "text-emerald-500" : t.status === 'PENDING' ? "text-slate-400 italic" : "text-rose-500"
                                  )}>
                                    {t.status === 'WON' ? `+$${(t.stake * 0.4).toFixed(2)}` : t.status}
                                  </span>
                               </td>
                            </motion.tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          )}
        </div>
      </main>

      {/* Decorative Blur Backgrounds */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-sky-400/5 blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[800px] h-[800px] bg-indigo-400/5 blur-[120px] pointer-events-none -z-10" />
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
        active 
          ? "bg-sky-500 text-white shadow-lg shadow-sky-100" 
          : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
      )}
    >
      {icon}
      <span className="text-sm font-bold tracking-tight hidden md:block">{label}</span>
      {active && <motion.div layoutId="nav-dot" className="w-1.5 h-1.5 rounded-full bg-white ml-auto hidden md:block" />}
    </button>
  );
}

function MarketCard({ market }: { market: Market }) {
  return (
    <div className="glass-card rounded-2xl p-5 group">
      <div className="flex items-start justify-between mb-4">
        <span className={cn(
          "text-[9px] font-bold px-2 py-0.5 rounded-full border tracking-widest",
          market.category === 'Politics' ? 'border-sky-200 text-sky-600 bg-sky-50' :
          market.category === 'Crypto' ? 'border-indigo-200 text-indigo-600 bg-indigo-50' :
          'border-slate-200 text-slate-600 bg-slate-50'
        )}>
          {market.category.toUpperCase()}
        </span>
        <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform opacity-30 group-hover:opacity-100">
          <Globe size={14} className="text-slate-400" />
        </div>
      </div>
      
      <h4 className="text-sm font-bold text-slate-800 line-clamp-2 mb-5 leading-relaxed group-hover:text-sky-600 transition-colors">
        {market.question}
      </h4>

      <div className="flex items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl mb-4 border border-slate-100 shadow-inner">
        <div>
          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter mb-0.5">Crowd Match</p>
          <p className="text-sm font-mono font-bold text-slate-700">{(market.yesProbability * 100).toFixed(0)}%</p>
        </div>
        <div className="h-4 w-[1px] bg-slate-200" />
        <div className="text-right">
          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter mb-0.5">Neural Drift</p>
          <p className="text-sm font-mono font-bold text-sky-500">{market.aiConfidence}%</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className={cn(
          "flex-1 py-2 rounded-xl border text-center text-[10px] font-bold font-mono transition-all",
          market.aiVerdict === 'YES' ? "bg-sky-500 border-sky-600 text-white shadow-sm" : "bg-white border-slate-100 text-slate-300"
        )}>
          SIGNAL: YES
        </div>
        <div className={cn(
          "flex-1 py-2 rounded-xl border text-center text-[10px] font-bold font-mono transition-all",
          market.aiVerdict === 'NO' ? "bg-rose-500 border-rose-600 text-white shadow-sm" : "bg-white border-slate-100 text-slate-300"
        )}>
          SIGNAL: NO
        </div>
      </div>
    </div>
  );
}

function SettingItem({ title, description, icon, children }: { title: string; description: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-1">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center shrink-0 border border-sky-100 shadow-sm">
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-slate-800">{title}</h4>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-medium">{description}</p>
        </div>
      </div>
      <div className="w-full md:w-56">
        {children}
      </div>
    </div>
  );
}


