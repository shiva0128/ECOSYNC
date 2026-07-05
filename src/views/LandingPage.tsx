import React, { useState } from 'react';
import { useMockDb } from '../context/MockDbContext';
import { calculateSavings } from '../utils/savingsCalculator';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  Leaf, 
  TrendingUp, 
  Clock, 
  Trash2, 
  ArrowRight, 
  Info,
  Activity,
  Zap
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { categories } = useMockDb();
  const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id || 't8-led');
  const [quantity, setQuantity] = useState(500);
  const [runtimeHrs, setRuntimeHrs] = useState(12);
  const [electricityRate, setElectricityRate] = useState(8);

  const selectedCategory = categories.find(c => c.id === selectedCatId) || categories[0];

  const savings = selectedCategory 
    ? calculateSavings(selectedCategory, quantity, runtimeHrs, electricityRate)
    : null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-10 px-6 max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
          <Activity size={14} className="animate-pulse" />
          Real-Time B2B Circular Procurement
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
          Synchronize Infrastructure Upgrades with <span className="text-emerald-600">Circular Logistics</span>
        </h1>
        <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
          Calculate your total cost of ownership (TCO) savings, list your hardware requirements in the B2B marketplace, and automatically route old hardware into verified recycler streams.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <button 
            onClick={() => onNavigate('auth')}
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-emerald-500/20 transition duration-300 flex items-center justify-center gap-2 group"
          >
            Access EcoSync Platform
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <a 
            href="#calculator"
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg border border-slate-250 transition duration-300 text-center"
          >
            Try Free TCO Calculator
          </a>
        </div>
      </section>

      {/* Platform Live Stats Ribbon */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-slate-200 p-6 rounded-2xl max-w-6xl mx-auto shadow-sm">
        <div className="text-center">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Toxic Waste Diverted</p>
          <p className="text-emerald-600 text-2xl font-black mt-1">42,850+ kg</p>
        </div>
        <div className="text-center border-l border-slate-200">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Carbon Offsets (CO2e)</p>
          <p className="text-teal-650 text-2xl font-black mt-1">1,240+ Tons</p>
        </div>
        <div className="text-center border-l border-slate-200">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total TCO Saved</p>
          <p className="text-slate-900 text-2xl font-black mt-1">₹8.4M+</p>
        </div>
        <div className="text-center border-l border-slate-200">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active B2B Partners</p>
          <p className="text-emerald-650 text-2xl font-black mt-1">120+ Companies</p>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 max-w-6xl mx-auto shadow-sm scroll-mt-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Inputs Column */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <Zap className="text-emerald-600" size={22} />
                Infrastructure Calculator
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Configure your current hardware layout to project operational savings.
              </p>
            </div>

            {/* Category selection */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Upgrade Option / Category</label>
              <select
                value={selectedCatId}
                onChange={(e) => setSelectedCatId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-250 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name} ({cat.type === 'standalone' ? 'Standalone' : 'Comparison'})</option>
                ))}
              </select>
            </div>

            {/* Quantity Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label className="font-semibold text-slate-700">Quantity</label>
                <span className="text-emerald-600 font-mono font-semibold">{quantity.toLocaleString()} units</span>
              </div>
              <input
                type="range"
                min="10"
                max="5000"
                step="10"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full accent-emerald-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>10</span>
                <span>2,500</span>
                <span>5,000</span>
              </div>
            </div>

            {/* Runtime Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label className="font-semibold text-slate-700">Daily Runtime</label>
                <span className="text-emerald-600 font-mono font-semibold">{runtimeHrs} hours / day</span>
              </div>
              <input
                type="range"
                min="1"
                max="24"
                step="1"
                value={runtimeHrs}
                onChange={(e) => setRuntimeHrs(parseInt(e.target.value))}
                className="w-full accent-emerald-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>1 hr</span>
                <span>12 hrs</span>
                <span>24 hrs</span>
              </div>
            </div>

            {/* Electricity Rate Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label className="font-semibold text-slate-700">Electricity Tariff</label>
                <span className="text-emerald-600 font-mono font-semibold">₹{electricityRate} / kWh</span>
              </div>
              <input
                type="range"
                min="3"
                max="20"
                step="0.5"
                value={electricityRate}
                onChange={(e) => setElectricityRate(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>₹3</span>
                <span>₹11.5</span>
                <span>₹20</span>
              </div>
            </div>

            {/* Product description card */}
            {selectedCategory && (
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2 text-slate-600">
                <div className="flex items-center gap-1.5 font-bold text-slate-750 uppercase tracking-wider text-[10px]">
                  <Info size={12} className="text-emerald-600" />
                  Hardware Lifecycle Information
                </div>
                {selectedCategory.type === 'comparison' ? (
                  <p>
                    Upgrading from <span className="text-amber-600 font-semibold">{selectedCategory.legacyName}</span> to <span className="text-emerald-600 font-semibold">{selectedCategory.upgradeName}</span> reduces power draw from <span className="font-semibold">{selectedCategory.legacyPowerW}W</span> to <span className="font-semibold">{selectedCategory.upgradePowerW}W</span> per unit, lowering replacement cycles to <span className="font-semibold">{selectedCategory.lifespanYears} years</span>.
                  </p>
                ) : (
                  <p>
                    Deploying <span className="text-emerald-600 font-semibold">{selectedCategory.upgradeName}</span> generates local solar energy offsetting grid dependency. Each 10kW unit generates roughly <span className="font-semibold font-mono">15,000 kWh</span> annually with a system lifespan of <span className="font-semibold">{selectedCategory.lifespanYears} years</span>.
                  </p>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px] text-slate-500">
                  <span>Capex Unit Cost: <span className="text-slate-800 font-mono font-bold">₹{selectedCategory.unitCost.toLocaleString()}</span></span>
                  <span>E-waste Factor: <span className="text-slate-800 font-mono font-bold">{selectedCategory.eWasteWeightKg} kg/unit</span></span>
                </div>
              </div>
            )}
          </div>

          {/* Savings Outcome Cards */}
          {savings && (
            <div className="w-full lg:w-1/2 flex flex-col justify-between space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Annual Savings Card */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-350 transition duration-200 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Annual ROI Savings</span>
                    <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600"><TrendingUp size={16} /></span>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl md:text-3xl font-extrabold text-emerald-600 font-mono">{formatCurrency(savings.annualSavings)}</p>
                    <p className="text-xs text-slate-500 mt-1">Operational savings per year</p>
                  </div>
                </div>

                {/* Payback Period Card */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-350 transition duration-200 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payback Period</span>
                    <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600"><Clock size={16} /></span>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl md:text-3xl font-extrabold text-slate-900 font-mono">
                      {savings.breakevenYears === Infinity ? 'N/A' : `${savings.breakevenYears} Yrs`}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Break-even ROI point</p>
                  </div>
                </div>

                {/* Carbon Offset Card */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-350 transition duration-200 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">CO2 Emissions Reduced</span>
                    <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600"><Leaf size={16} /></span>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl md:text-3xl font-extrabold text-teal-650 font-mono">{savings.co2OffsetTons} Tons</p>
                    <p className="text-xs text-slate-500 mt-1">Offset annually (CO2e)</p>
                  </div>
                </div>

                {/* E-Waste Diverted Card */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-350 transition duration-200 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending E-waste Load</span>
                    <span className="p-1.5 rounded-lg bg-amber-100 text-amber-600"><Trash2 size={16} /></span>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl md:text-3xl font-extrabold text-amber-600 font-mono">{savings.eWasteWeightKg.toLocaleString()} kg</p>
                    <p className="text-xs text-slate-500 mt-1">Hardware routed to recyclers</p>
                  </div>
                </div>
              </div>

              {/* Capital and 5-Year net Savings banner */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-50/50 to-slate-50 border border-emerald-200/60 shadow-sm">
                <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                  <span>Total Upfront Capital Cost (Capex):</span>
                  <span className="text-slate-900 font-mono font-bold">{formatCurrency(savings.capex)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold mt-2 pt-2 border-t border-slate-200">
                  <span className="text-emerald-700">5-Year Cumulative Net Savings:</span>
                  <span className="text-emerald-700 font-mono">{formatCurrency(savings.fiveYearSavings)}</span>
                </div>
              </div>

              {/* CTA Form Trigger */}
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('auth')}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md hover:shadow-emerald-600/10 transition duration-300 flex items-center justify-center gap-2 group text-base"
                >
                  Sign in to post this requirement to the marketplace
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Visual Analytics / Recharts */}
      {savings && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* TCO Line Chart */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-slate-900">10-Year TCO Break-Even Projection</h3>
              <p className="text-slate-550 text-xs">Comparing cumulative expenditures: Legacy operations vs. EcoSync upgrade.</p>
            </div>
            <div className="h-72 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={savings.tcoData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" stroke="#64748b" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                  <YAxis 
                    stroke="#64748b" 
                    tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}
                    labelFormatter={(label) => `Year ${label}`}
                    formatter={(value: any) => [formatCurrency(value), '']}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Line 
                    type="monotone" 
                    dataKey="legacyCost" 
                    name="Legacy Setup" 
                    stroke="#f59e0b" 
                    strokeWidth={2.5} 
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="upgradeCost" 
                    name="EcoSync Upgrade" 
                    stroke="#10b981" 
                    strokeWidth={2.5} 
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 5-Year Expenses Stacked Bar Chart */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-slate-900">5-Year Cumulative Expense Breakdown</h3>
              <p className="text-slate-550 text-xs">Comparing total cost compositions: Energy (OpEx) vs Maintenance (OpEx) vs Capital (CapEx).</p>
            </div>
            <div className="h-72 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={savings.fiveYearBreakdown}
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis 
                    stroke="#64748b" 
                    tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}
                    formatter={(value: any) => [formatCurrency(value), '']}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Bar dataKey="Capital" stackId="a" fill="#4f46e5" name="Capital Expense (CapEx)" />
                  <Bar dataKey="Maintenance" stackId="a" fill="#f59e0b" name="Maintenance Cost" />
                  <Bar dataKey="Energy" stackId="a" fill="#10b981" name="Energy Cost" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}

      {/* Replacement Cycle Timeline */}
      {savings && (
        <section className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl max-w-6xl mx-auto space-y-6 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Hardware Life & E-waste Recycling Cycle</h3>
            <p className="text-slate-500 text-xs">Timeline of events triggered by the deployment of {selectedCategory?.upgradeName}.</p>
          </div>
          <div className="relative">
            {/* Horizontal Line for timeline */}
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 -translate-y-1/2 hidden md:block"></div>
            
            {/* Timeline nodes */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {/* Event 1: Install */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative z-10 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold text-sm mb-3">01</div>
                  <h4 className="font-bold text-slate-800 text-sm">Deployment (Y0)</h4>
                  <p className="text-slate-550 text-xs mt-1">Procure energy-efficient hardware. Upfront Capital Cost: {formatCurrency(savings.capex)}.</p>
                </div>
              </div>

              {/* Event 2: Break even */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative z-10 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-250 text-emerald-650 flex items-center justify-center font-bold text-sm mb-3">02</div>
                  <h4 className="font-bold text-slate-800 text-sm">ROI Break-Even (Y{savings.breakevenYears})</h4>
                  <p className="text-slate-550 text-xs mt-1">Cumulative operational savings fully offset the initial hardware procurement expense.</p>
                </div>
              </div>

              {/* Event 3: Maintenance */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative z-10 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold text-sm mb-3">03</div>
                  <h4 className="font-bold text-slate-800 text-sm">Operational Run (Y{Math.ceil(selectedCategory.lifespanYears / 2)})</h4>
                  <p className="text-slate-550 text-xs mt-1">Mid-life hardware efficiency run. EcoSync monitors grid offset performance indices.</p>
                </div>
              </div>

              {/* Event 4: Recycling */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 relative z-10 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center font-bold text-sm mb-3">04</div>
                  <h4 className="font-bold text-emerald-700 text-sm">E-Waste Logistics (Y{selectedCategory.lifespanYears})</h4>
                  <p className="text-slate-600 text-xs mt-1">End of Life reached. Old legacy materials ({savings.eWasteWeightKg.toLocaleString()} kg) are routed to recyclers.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
