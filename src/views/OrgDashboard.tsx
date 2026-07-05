import React, { useState } from 'react';
import { useMockDb } from '../context/MockDbContext';
import { calculateSavings } from '../utils/savingsCalculator';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { 
  TrendingUp, 
  Leaf, 
  Trash2, 
  Activity, 
  Briefcase, 
  PlusCircle, 
  Download, 
  CheckCircle,
  Truck
} from 'lucide-react';

export const OrgDashboard: React.FC = () => {
  const { 
    currentUser,
    categories, 
    requirements, 
    bids, 
    disposalLogs, 
    postRequirement,
    acceptBid
  } = useMockDb();

  const [activeTab, setActiveTab] = useState<'analyze' | 'procure' | 'dispose'>('analyze');

  // Calculator States
  const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id || 't8-led');
  const [quantity, setQuantity] = useState(500);
  const [runtimeHrs, setRuntimeHrs] = useState(12);
  const [electricityRate, setElectricityRate] = useState(8);
  const [postSuccess, setPostSuccess] = useState(false);

  const selectedCategory = categories.find(c => c.id === selectedCatId) || categories[0];
  const savings = selectedCategory 
    ? calculateSavings(selectedCategory, quantity, runtimeHrs, electricityRate)
    : null;

  const [expandedReqId, setExpandedReqId] = useState<string | null>(null);

  const myRequirements = requirements.filter(r => r.orgId === currentUser?.id);
  const myDisposals = disposalLogs.filter(d => d.orgId === currentUser?.id);

  const totalWasteDivertedKg = myDisposals
    .filter(d => d.status === 'Recycled')
    .reduce((acc, curr) => acc + curr.toxicWasteDivertedKg, 0);

  const completedRequirements = requirements.filter(r => r.orgId === currentUser?.id && r.status === 'Fulfilled');
  const totalCO2OffsetTons = completedRequirements.reduce((acc, curr) => {
    const cat = categories.find(c => c.id === curr.categoryId);
    if (!cat) return acc;
    const calc = calculateSavings(cat, curr.quantity, curr.runtimeHrs, curr.electricityRate);
    return acc + calc.co2OffsetTons;
  }, 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handlePostMarketplace = () => {
    if (!selectedCategory) return;
    postRequirement(selectedCatId, quantity, runtimeHrs, electricityRate);
    setPostSuccess(true);
    setTimeout(() => {
      setPostSuccess(false);
      setActiveTab('procure');
    }, 1500);
  };

  const handleDownloadCertificate = (log: any) => {
    const content = `ECOSYNC ESG COMPLIANCE CERTIFICATE
-----------------------------------------
Certificate ID: CERT-${log.id.toUpperCase()}
Issue Date: ${log.lastUpdated}
Organization: ${log.orgName}
Recycling Partner: ${log.recyclerName}
Material Recycled: ${log.categoryName}
Quantity: ${log.quantity} units
Total E-Waste Diverted: ${log.toxicWasteDivertedKg} kg

Status: Certified Environmentally Recovered & Recycled.
-----------------------------------------
EcoSync Compliance Registry`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EcoSync_Certificate_${log.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Dashboard Subheader Navigation */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Client Dashboard</h2>
          <p className="text-xs text-slate-500">Manage savings projections, bid procurements, and circular e-waste flows.</p>
        </div>
        <div className="flex bg-slate-100 border border-slate-200 rounded-lg p-1 text-xs shadow-inner">
          <button
            onClick={() => setActiveTab('analyze')}
            className={`px-4 py-2 font-bold rounded transition ${
              activeTab === 'analyze' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-slate-650 hover:text-slate-900'
            }`}
          >
            1. Analyze
          </button>
          <button
            onClick={() => setActiveTab('procure')}
            className={`px-4 py-2 font-bold rounded transition ${
              activeTab === 'procure' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-slate-650 hover:text-slate-900'
            }`}
          >
            2. Procure
          </button>
          <button
            onClick={() => setActiveTab('dispose')}
            className={`px-4 py-2 font-bold rounded transition ${
              activeTab === 'dispose' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-slate-650 hover:text-slate-900'
            }`}
          >
            3. Dispose (Circular)
          </button>
        </div>
      </div>

      {/* ANALYZE TAB */}
      {activeTab === 'analyze' && savings && (
        <div className="space-y-8 animate-fade-in">
          {/* Main Calculator */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            {/* Inputs */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity size={18} className="text-emerald-600" />
                Decarbonization Calculator
              </h3>
              
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Hardware Category</label>
                <select
                  value={selectedCatId}
                  onChange={(e) => setSelectedCatId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-250 rounded text-slate-900 focus:outline-none focus:border-emerald-500"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <label className="font-bold text-slate-500 uppercase tracking-wider">QUANTITY</label>
                  <span className="text-emerald-650 font-mono font-bold">{quantity.toLocaleString()} units</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="5000"
                  step="10"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full accent-emerald-605 bg-slate-200 h-1.5 rounded cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <label className="font-bold text-slate-500 uppercase tracking-wider">RUNTIME</label>
                  <span className="text-emerald-650 font-mono font-bold">{runtimeHrs} hours / day</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  step="1"
                  value={runtimeHrs}
                  onChange={(e) => setRuntimeHrs(parseInt(e.target.value))}
                  className="w-full accent-emerald-605 bg-slate-200 h-1.5 rounded cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <label className="font-bold text-slate-500 uppercase tracking-wider">ELECTRICITY RATE</label>
                  <span className="text-emerald-650 font-mono font-bold">₹{electricityRate} / kWh</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="20"
                  step="0.5"
                  value={electricityRate}
                  onChange={(e) => setElectricityRate(parseFloat(e.target.value))}
                  className="w-full accent-emerald-605 bg-slate-200 h-1.5 rounded cursor-pointer"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handlePostMarketplace}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded flex items-center justify-center gap-2 transition shadow"
                >
                  <PlusCircle size={16} />
                  Post Requirement to Marketplace
                </button>
                {postSuccess && (
                  <p className="text-xs text-center text-emerald-600 font-semibold mt-2">
                    Requirement successfully posted! Routing to Procurement board...
                  </p>
                )}
              </div>
            </div>

            {/* Calculations Output */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Annual Return (ROI)</span>
                  <p className="text-xl font-bold text-emerald-605 font-mono mt-1">{formatCurrency(savings.annualSavings)}</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Payback Period</span>
                  <p className="text-xl font-bold text-slate-900 font-mono mt-1">{savings.breakevenYears} Yrs</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Carbon offset</span>
                  <p className="text-xl font-bold text-teal-650 font-mono mt-1">{savings.co2OffsetTons} Tons</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pending E-Waste</span>
                  <p className="text-xl font-bold text-amber-600 font-mono mt-1">{savings.eWasteWeightKg.toLocaleString()} kg</p>
                </div>
              </div>

              {/* TCO Mini Line chart */}
              <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg space-y-2">
                <h4 className="text-xs font-bold text-slate-800">Break-Even Chart Preview</h4>
                <div className="h-44 text-[10px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={savings.tcoData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="year" stroke="#718096" />
                      <YAxis stroke="#718096" tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }} />
                      <Line type="monotone" dataKey="legacyCost" stroke="#f59e0b" name="Legacy Cost" dot={false} />
                      <Line type="monotone" dataKey="upgradeCost" stroke="#10b981" name="Upgrade Cost" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROCURE TAB */}
      {activeTab === 'procure' && (
        <div className="space-y-6 animate-fade-in bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Briefcase size={20} className="text-emerald-600" />
              Active Procurement Requests
            </h3>
            <p className="text-slate-550 text-xs mt-1">Accept bids submitted by verified suppliers. Acceptance automatically generates the circular disposal log.</p>
          </div>

          {myRequirements.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-200 rounded-lg text-slate-400 text-sm">
              No procurement requirements posted. Go to the "Analyze" tab to list one.
            </div>
          ) : (
            <div className="space-y-4">
              {myRequirements.map(req => {
                const reqBids = bids.filter(b => b.requirementId === req.id);
                const isExpanded = expandedReqId === req.id;

                return (
                  <div key={req.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 shadow-sm">
                    {/* Header Row */}
                    <div 
                      onClick={() => setExpandedReqId(isExpanded ? null : req.id)}
                      className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50 transition cursor-pointer"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{req.categoryName}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                            req.status === 'Open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            req.status === 'Bidding' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-slate-100 text-slate-500 border-slate-250'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono">
                          Quantity: {req.quantity.toLocaleString()} units | Posted: {req.datePosted}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right text-xs">
                          <p className="text-slate-500 font-semibold">Total Bids Received</p>
                          <p className="font-bold text-slate-805">{reqBids.length} proposals</p>
                        </div>
                        <span className="text-slate-400 text-lg font-mono">
                          {isExpanded ? '−' : '+'}
                        </span>
                      </div>
                    </div>

                    {/* Bids dropdown */}
                    {isExpanded && (
                      <div className="p-4 bg-white border-t border-slate-200 space-y-4">
                        <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Vendor Bids Overview</h4>
                        {reqBids.length === 0 ? (
                          <p className="text-xs text-slate-450 italic py-2">No vendor bids submitted yet. Check back soon.</p>
                        ) : (
                          <div className="overflow-x-auto text-xs">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-slate-200 text-slate-450 uppercase tracking-wider font-bold">
                                  <th className="py-2 px-1">Vendor Name</th>
                                  <th className="py-2 px-1">Rating</th>
                                  <th className="py-2 px-1">Unit Price</th>
                                  <th className="py-2 px-1">Total Quote</th>
                                  <th className="py-2 px-1">Delivery Time</th>
                                  <th className="py-2 px-1 text-right">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {reqBids.map(bid => (
                                  <tr key={bid.id} className="border-b border-slate-100 text-slate-700">
                                    <td className="py-3 px-1 text-slate-900 font-bold">{bid.vendorName}</td>
                                    <td className="py-3 px-1 text-amber-500 font-semibold">★ {bid.rating.toFixed(1)}</td>
                                    <td className="py-3 px-1 font-mono">₹{bid.pricePerUnit}</td>
                                    <td className="py-3 px-1 font-mono text-slate-900 font-bold">₹{bid.totalAmount.toLocaleString()}</td>
                                    <td className="py-3 px-1">{bid.deliveryTimelineDays} days</td>
                                    <td className="py-3 px-1 text-right">
                                      {bid.status === 'Accepted' ? (
                                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded font-bold border border-emerald-200">
                                          Accepted
                                        </span>
                                      ) : bid.status === 'Rejected' ? (
                                        <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                          Closed
                                        </span>
                                      ) : req.status === 'Fulfilled' ? (
                                        <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                          Closed
                                        </span>
                                      ) : (
                                        <button
                                          onClick={() => acceptBid(req.id, bid.id)}
                                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded transition shadow"
                                        >
                                          Accept Bid
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* DISPOSE TAB */}
      {activeTab === 'dispose' && (
        <div className="space-y-6 animate-fade-in">
          {/* ESG Metrics Summary card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Leaf className="text-emerald-600" size={20} />
                Corporate ESG Performance Card
              </h3>
              <p className="text-slate-550 text-xs mt-1">Audit-ready documentation and compliance certificates for scope-3 infrastructure disposal.</p>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <Trash2 size={20} />
                  </div>
                  <div>
                    <p className="text-slate-450 text-[10px] uppercase font-bold tracking-wider">Toxic Waste Diverted</p>
                    <p className="text-xl font-black text-slate-900 font-mono mt-0.5">{totalWasteDivertedKg.toLocaleString()} kg</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-50 text-teal-650 border border-teal-100">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className="text-slate-450 text-[10px] uppercase font-bold tracking-wider">Annual Carbon Offsets (CO2e)</p>
                    <p className="text-xl font-black text-slate-900 font-mono mt-0.5">{totalCO2OffsetTons.toFixed(2)} Tons</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl flex flex-col justify-between shadow-inner">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase">
                  <CheckCircle size={14} className="text-emerald-600" />
                  Circular Loop Integrity
                </p>
                <p className="text-slate-550 text-[11px] leading-relaxed">All legacy gear decommissioned in EcoSync platform must route through certified dismantlers. This guarantees no toxic waste ends up in general landfills.</p>
              </div>
              <div className="text-[10px] text-slate-500 font-mono space-y-1 mt-4 pt-3 border-t border-slate-200">
                <p>Tracked Disposal Tasks: {myDisposals.length}</p>
                <p>Completed Recycling Audits: {myDisposals.filter(d => d.status === 'Recycled').length}</p>
              </div>
            </div>
          </div>

          {/* Disposal tracking logs */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Truck className="text-emerald-600" size={16} />
              Material Disposal & E-Waste Pipeline
            </h4>
            
            {myDisposals.length === 0 ? (
              <p className="text-xs text-slate-450 italic py-4 text-center border border-dashed border-slate-200 rounded-lg">
                No active disposal cycles. Once a procurement bid is accepted, tracking logs populate here automatically.
              </p>
            ) : (
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-450 uppercase tracking-wider font-bold">
                      <th className="py-3 px-2">Category</th>
                      <th className="py-3 px-2">Quantity Replaced</th>
                      <th className="py-3 px-2">Assigned Recycler</th>
                      <th className="py-3 px-2">Diverted Waste</th>
                      <th className="py-3 px-2">Logistics State</th>
                      <th className="py-3 px-2 text-right">Compliance Doc</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myDisposals.map(log => (
                      <tr key={log.id} className="border-b border-slate-100 text-slate-700">
                        <td className="py-3.5 px-2 text-slate-900 font-bold">{log.categoryName}</td>
                        <td className="py-3.5 px-2 font-mono">{log.quantity.toLocaleString()} units</td>
                        <td className="py-3.5 px-2 text-slate-800 font-semibold">{log.recyclerName}</td>
                        <td className="py-3.5 px-2 font-mono text-emerald-650 font-bold">{log.toxicWasteDivertedKg} kg</td>
                        <td className="py-3.5 px-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            log.status === 'Dismantling' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            log.status === 'In Transit' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-right">
                          {log.certificateIssued ? (
                            <button
                              onClick={() => handleDownloadCertificate(log)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded shadow transition"
                            >
                              <Download size={12} />
                              Certificate
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">
                              Awaiting Recycling (Status: {log.status})
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
