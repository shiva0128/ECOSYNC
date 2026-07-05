import React from 'react';
import { useMockDb } from '../context/MockDbContext';
import { Truck, Award, CheckCircle, ArrowRight, Trash2 } from 'lucide-react';

export const RecyclerDashboard: React.FC = () => {
  const { 
    currentUser, 
    disposalLogs, 
    updateDisposalStatus, 
    issueCertificate 
  } = useMockDb();

  const myLogs = disposalLogs.filter(log => log.recyclerId === currentUser?.id);

  const dismantlingLogs = myLogs.filter(l => l.status === 'Dismantling');
  const transitLogs = myLogs.filter(l => l.status === 'In Transit');
  const recycledLogs = myLogs.filter(l => l.status === 'Recycled');

  const totalDivertedWaste = recycledLogs.reduce((acc, curr) => acc + curr.toxicWasteDivertedKg, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Recycler Dashboard</h2>
          <p className="text-xs text-slate-500 font-semibold">Process assigned e-waste materials and issue digital ESG certificates.</p>
        </div>
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-right text-xs shadow-sm">
          <span className="text-slate-500 font-bold">Total Certified Recycled</span>
          <p className="text-emerald-600 font-black text-lg font-mono">{totalDivertedWaste.toLocaleString()} kg</p>
        </div>
      </div>

      {/* Verification Check */}
      {currentUser && !currentUser.isVerified && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs space-y-1">
          <p className="font-bold">Awaiting Verification Approval</p>
          <p>Your recycler account is pending admin verification. You will be able to manage logs once verified.</p>
        </div>
      )}

      {/* Kanban Board Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Dismantling */}
        <div className="bg-slate-100/80 border border-slate-200 rounded-xl p-4 flex flex-col space-y-4 shadow-inner">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-amber-600 uppercase flex items-center gap-1.5">
              <Trash2 size={14} />
              1. Dismantling ({dismantlingLogs.length})
            </span>
          </div>

          <div className="flex-1 space-y-3 min-h-[300px] overflow-y-auto max-h-[500px] pr-1">
            {dismantlingLogs.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-8">No jobs in dismantling.</p>
            ) : (
              dismantlingLogs.map(log => (
                <div key={log.id} className="bg-white p-4 rounded-lg border border-slate-200/80 text-xs space-y-3 shadow-sm hover:border-slate-300 transition">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800">{log.categoryName}</p>
                    <p className="text-[10px] text-slate-500">Client: {log.orgName}</p>
                  </div>
                  <div className="flex justify-between font-mono text-[10px] text-slate-500 border-t border-slate-100 pt-2 font-semibold">
                    <span>Qty: {log.quantity}</span>
                    <span>Load: {log.toxicWasteDivertedKg} kg</span>
                  </div>
                  <button
                    onClick={() => updateDisposalStatus(log.id, 'In Transit')}
                    className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold transition flex items-center justify-center gap-1 text-[11px] shadow-sm"
                  >
                    Ship material
                    <ArrowRight size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: In Transit */}
        <div className="bg-slate-100/80 border border-slate-200 rounded-xl p-4 flex flex-col space-y-4 shadow-inner">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-blue-600 uppercase flex items-center gap-1.5">
              <Truck size={14} />
              2. In Transit ({transitLogs.length})
            </span>
          </div>

          <div className="flex-1 space-y-3 min-h-[300px] overflow-y-auto max-h-[500px] pr-1">
            {transitLogs.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-8">No jobs in transit.</p>
            ) : (
              transitLogs.map(log => (
                <div key={log.id} className="bg-white p-4 rounded-lg border border-slate-200/80 text-xs space-y-3 shadow-sm hover:border-slate-300 transition">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800">{log.categoryName}</p>
                    <p className="text-[10px] text-slate-500">Client: {log.orgName}</p>
                  </div>
                  <div className="flex justify-between font-mono text-[10px] text-slate-500 border-t border-slate-100 pt-2 font-semibold">
                    <span>Qty: {log.quantity}</span>
                    <span>Load: {log.toxicWasteDivertedKg} kg</span>
                  </div>
                  <button
                    onClick={() => updateDisposalStatus(log.id, 'Recycled')}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold transition flex items-center justify-center gap-1 text-[11px] shadow-sm"
                  >
                    Confirm Recycled
                    <CheckCircle size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Recycled & Certificate */}
        <div className="bg-slate-100/80 border border-slate-200 rounded-xl p-4 flex flex-col space-y-4 shadow-inner">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-emerald-700 uppercase flex items-center gap-1.5">
              <Award size={14} />
              3. Recycled ({recycledLogs.length})
            </span>
          </div>

          <div className="flex-1 space-y-3 min-h-[300px] overflow-y-auto max-h-[500px] pr-1">
            {recycledLogs.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-8">No items fully recycled yet.</p>
            ) : (
              recycledLogs.map(log => (
                <div key={log.id} className="bg-white p-4 rounded-lg border border-slate-200/80 text-xs space-y-3 shadow-sm hover:border-slate-300 transition">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800">{log.categoryName}</p>
                    <p className="text-[10px] text-slate-500">Client: {log.orgName}</p>
                  </div>
                  <div className="flex justify-between font-mono text-[10px] text-slate-500 border-t border-slate-100 pt-2 font-semibold">
                    <span>Qty: {log.quantity}</span>
                    <span>Load: {log.toxicWasteDivertedKg} kg</span>
                  </div>
                  
                  {log.certificateIssued ? (
                    <div className="w-full text-center py-1.5 bg-emerald-50 border border-emerald-250 text-emerald-700 font-bold rounded text-[11px]">
                      Certificate Issued
                    </div>
                  ) : (
                    <button
                      onClick={() => issueCertificate(log.id)}
                      className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold transition flex items-center justify-center gap-1 text-[11px] shadow-sm"
                    >
                      Issue ESG Certificate
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
