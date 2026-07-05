import React, { useState } from 'react';
import { useMockDb } from '../context/MockDbContext';
import { Check, X, Shield, PlusCircle, Users, Layers, ShieldAlert, Award, FileSpreadsheet } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { 
    users, 
    categories, 
    verifyUser, 
    addCategory, 
    requirements, 
    disposalLogs 
  } = useMockDb();

  const [catName, setCatName] = useState('');
  const [catType, setCatType] = useState<'comparison' | 'standalone'>('comparison');
  const [legacyName, setLegacyName] = useState('');
  const [upgradeName, setUpgradeName] = useState('');
  const [legacyPowerW, setLegacyPowerW] = useState(60);
  const [upgradePowerW, setUpgradePowerW] = useState(15);
  const [legacyMaintCostYr, setLegacyMaintCostYr] = useState(100);
  const [upgradeMaintCostYr, setUpgradeMaintCostYr] = useState(30);
  const [unitCost, setUnitCost] = useState(400);
  const [lifespanYears, setLifespanYears] = useState(5);
  const [eWasteWeightKg, setEWasteWeightKg] = useState(0.5);

  const [formSuccess, setFormSuccess] = useState(false);

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName || !upgradeName) return;

    addCategory({
      name: catName,
      type: catType,
      legacyName: catType === 'comparison' ? legacyName : 'Grid Power Offset',
      upgradeName,
      legacyPowerW: Number(legacyPowerW),
      upgradePowerW: Number(upgradePowerW),
      legacyMaintCostYr: Number(legacyMaintCostYr),
      upgradeMaintCostYr: Number(upgradeMaintCostYr),
      unitCost: Number(unitCost),
      lifespanYears: Number(lifespanYears),
      eWasteWeightKg: Number(eWasteWeightKg)
    });

    setCatName('');
    setLegacyName('');
    setUpgradeName('');
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 2000);
  };

  const pendingUsers = users.filter(u => !u.isVerified);
  const verifiedUsers = users.filter(u => u.isVerified);

  const activeOrgs = verifiedUsers.filter(u => u.role === 'Organization').length;
  const activeVendors = verifiedUsers.filter(u => u.role === 'Vendor').length;
  const activeRecyclers = verifiedUsers.filter(u => u.role === 'Recycler').length;
  
  const totalWasteKg = disposalLogs
    .filter(l => l.status === 'Recycled')
    .reduce((acc, curr) => acc + curr.toxicWasteDivertedKg, 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Overview Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center text-slate-550">
            <span className="text-xs font-bold uppercase tracking-wider">Platform Partners</span>
            <Users size={18} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-black mt-2 text-slate-900">{verifiedUsers.length} <span className="text-xs text-slate-400 font-normal">Active</span></p>
          <div className="text-[10px] text-slate-500 mt-2 font-mono space-x-2">
            <span>Orgs: {activeOrgs}</span>
            <span>Vendors: {activeVendors}</span>
            <span>Recyclers: {activeRecyclers}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center text-slate-550">
            <span className="text-xs font-bold uppercase tracking-wider">Hardware Categories</span>
            <Layers size={18} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-black mt-2 text-slate-900">{categories.length}</p>
          <p className="text-[10px] text-slate-400 mt-2">Available upgrade specifications</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center text-slate-550">
            <span className="text-xs font-bold uppercase tracking-wider">Open Requirements</span>
            <ShieldAlert size={18} className="text-amber-600" />
          </div>
          <p className="text-2xl font-black mt-2 text-slate-900">{requirements.filter(r => r.status === 'Open').length}</p>
          <p className="text-[10px] text-slate-400 mt-2">Active marketplace requirements</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center text-slate-550">
            <span className="text-xs font-bold uppercase tracking-wider">Tonnage Diverted</span>
            <Award size={18} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-black mt-2 text-emerald-600">{totalWasteKg.toLocaleString()} kg</p>
          <p className="text-[10px] text-slate-400 mt-2">E-waste certified recycled</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Verification Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Shield className="text-emerald-600" size={20} />
                Entity Verification Dashboard
              </h3>
              {pendingUsers.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-bold text-amber-700 animate-pulse">
                  {pendingUsers.length} Pending
                </span>
              )}
            </div>

            {pendingUsers.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-slate-200 rounded-lg text-slate-400 text-sm">
                No registrations currently pending.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                      <th className="py-3 px-2">Name</th>
                      <th className="py-3 px-2">Email</th>
                      <th className="py-3 px-2">Role</th>
                      <th className="py-3 px-2 text-right">Verification Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map(user => (
                      <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition text-slate-700">
                        <td className="py-3.5 px-2 font-bold text-slate-900">{user.name}</td>
                        <td className="py-3.5 px-2 text-slate-500">{user.email}</td>
                        <td className="py-3.5 px-2 font-mono">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            user.role === 'Organization' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                            user.role === 'Vendor' ? 'bg-teal-50 text-teal-700 border border-teal-100' :
                            'bg-purple-50 text-purple-700 border border-purple-100'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => verifyUser(user.id, 'approve')}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 transition duration-150"
                              title="Approve Entity"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => verifyUser(user.id, 'reject')}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition duration-150"
                              title="Reject Entity"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Current Active Registry Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <FileSpreadsheet className="text-slate-500" size={20} />
              Active Partner Directory
            </h3>
            <div className="overflow-y-auto max-h-60 text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <th className="py-2">Name</th>
                    <th className="py-2">Role</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {verifiedUsers.map(user => (
                    <tr key={user.id} className="border-b border-slate-100 py-2">
                      <td className="py-2 text-slate-800 font-bold">{user.name}</td>
                      <td className="py-2 text-slate-500">{user.role}</td>
                      <td className="py-2">
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-750 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-150">
                          <Check size={10} /> Verified
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Category management Form */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 h-fit shadow-sm">
          <h3 className="text-lg font-extrabold text-slate-900 mb-2 flex items-center gap-2">
            <PlusCircle className="text-emerald-600" size={20} />
            Hardware Registry
          </h3>
          <p className="text-slate-500 text-xs mb-4">Add high-efficiency hardware profiles directly to the ecosystem catalog.</p>
          
          {formSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg font-semibold animate-fade-in">
              Category added to database successfully!
            </div>
          )}

          <form onSubmit={handleAddCategorySubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="block text-slate-500 font-bold">Profile Name</label>
                <input
                  type="text"
                  placeholder="e.g. T5 to LED 12W"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded text-slate-950 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-slate-500 font-bold">Install Type</label>
                <select
                  value={catType}
                  onChange={(e) => setCatType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded text-slate-950 focus:outline-none"
                >
                  <option value="comparison">Comparison Upgrade</option>
                  <option value="standalone">Standalone Generation</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-slate-500 font-bold">New/Upgrade Hardware</label>
              <input
                type="text"
                placeholder="e.g. LED Tube 12W"
                value={upgradeName}
                onChange={(e) => setUpgradeName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded text-slate-950 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            {catType === 'comparison' && (
              <div className="space-y-1">
                <label className="block text-slate-500 font-bold">Legacy Hardware Name</label>
                <input
                  type="text"
                  placeholder="e.g. Standard T5 Tube (28W)"
                  value={legacyName}
                  onChange={(e) => setLegacyName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded text-slate-950 focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="block text-slate-500 font-bold">
                  {catType === 'comparison' ? 'Legacy Power (W)' : 'Generating Power (W)'}
                </label>
                <input
                  type="number"
                  value={legacyPowerW}
                  onChange={(e) => setLegacyPowerW(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded text-slate-950 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-slate-500 font-bold">
                  {catType === 'comparison' ? 'Upgrade Power (W)' : 'Auxiliary Power (W)'}
                </label>
                <input
                  type="number"
                  value={upgradePowerW}
                  onChange={(e) => setUpgradePowerW(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded text-slate-950 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="block text-slate-500 font-bold">Legacy Maint. / Yr (₹)</label>
                <input
                  type="number"
                  value={legacyMaintCostYr}
                  disabled={catType === 'standalone'}
                  onChange={(e) => setLegacyMaintCostYr(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded text-slate-950 disabled:opacity-50"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-slate-500 font-bold">Upgrade Maint. / Yr (₹)</label>
                <input
                  type="number"
                  value={upgradeMaintCostYr}
                  onChange={(e) => setUpgradeMaintCostYr(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded text-slate-950"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="block text-slate-500 font-bold">Capex (₹)</label>
                <input
                  type="number"
                  value={unitCost}
                  onChange={(e) => setUnitCost(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded text-slate-950"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-slate-500 font-bold">Life (Yrs)</label>
                <input
                  type="number"
                  value={lifespanYears}
                  onChange={(e) => setLifespanYears(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded text-slate-950"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-slate-500 font-bold">Waste (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={eWasteWeightKg}
                  onChange={(e) => setEWasteWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded text-slate-950"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded shadow-md hover:shadow-emerald-600/15 transition duration-200"
            >
              Add New Hardware Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
