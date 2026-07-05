import React, { useState } from 'react';
import { useMockDb } from '../context/MockDbContext';
import type { Requirement } from '../context/MockDbContext';
import { Briefcase, CheckCircle, XCircle, Clock } from 'lucide-react';

export const VendorDashboard: React.FC = () => {
  const { 
    currentUser, 
    requirements, 
    bids, 
    submitBid
  } = useMockDb();

  const [activeTab, setActiveTab] = useState<'marketplace' | 'contracts'>('marketplace');
  const [selectedReq, setSelectedReq] = useState<Requirement | null>(null);

  // Bid Form Fields
  const [pricePerUnit, setPricePerUnit] = useState<number>(0);
  const [timelineDays, setTimelineDays] = useState<number>(10);
  const [bidSuccess, setBidSuccess] = useState(false);

  // Filter lists
  const openRequirements = requirements.filter(r => r.status === 'Open');
  const myBids = bids.filter(b => b.vendorId === currentUser?.id);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleOpenBidModal = (req: Requirement) => {
    setSelectedReq(req);
    setPricePerUnit(0);
    setTimelineDays(14);
    setBidSuccess(false);
  };

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq || pricePerUnit <= 0 || timelineDays <= 0) return;

    submitBid(selectedReq.id, pricePerUnit, timelineDays);
    setBidSuccess(true);
    setTimeout(() => {
      setBidSuccess(false);
      setSelectedReq(null);
      setActiveTab('contracts');
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Tab Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Vendor Dashboard</h2>
          <p className="text-xs text-slate-505">Bid on open efficiency projects and track fulfillment contracts.</p>
        </div>
        <div className="flex bg-slate-100 border border-slate-200 rounded-lg p-1 text-xs shadow-inner">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-4 py-2 font-bold rounded transition ${
              activeTab === 'marketplace' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-slate-650 hover:text-slate-900'
            }`}
          >
            Marketplace Feed ({openRequirements.length})
          </button>
          <button
            onClick={() => setActiveTab('contracts')}
            className={`px-4 py-2 font-bold rounded transition ${
              activeTab === 'contracts' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-slate-650 hover:text-slate-900'
            }`}
          >
            My Bids & Contracts ({myBids.length})
          </button>
        </div>
      </div>

      {/* Warning if user is not verified */}
      {currentUser && !currentUser.isVerified && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs space-y-1">
          <p className="font-bold">Awaiting Verification Approval</p>
          <p>Your vendor account is currently pending verification. You can browse the marketplace, but bids cannot be posted until an administrator verifies your company credentials.</p>
        </div>
      )}

      {/* MARKETPLACE FEED TAB */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6 animate-fade-in">
          {openRequirements.length === 0 ? (
            <div className="text-center py-12 bg-white border border-slate-200 rounded-xl text-slate-400 text-sm shadow-sm">
              No active hardware upgrade opportunities are available.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {openRequirements.map(req => {
                const alreadyBid = myBids.some(b => b.requirementId === req.id);
                
                return (
                  <div key={req.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-350 shadow-sm transition flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-bold text-slate-900">{req.categoryName}</span>
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-500 font-bold">
                          {req.datePosted}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">Posted by: <span className="font-bold text-slate-700">{req.orgName}</span></p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 text-slate-650 font-semibold shadow-inner">
                      <div className="flex justify-between">
                        <span>Fulfillment Qty:</span>
                        <span className="text-slate-800 font-mono">{req.quantity.toLocaleString()} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Grid Tariff Index:</span>
                        <span className="text-slate-800 font-mono">₹{req.electricityRate} / kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Required Runtime:</span>
                        <span className="text-slate-800 font-mono">{req.runtimeHrs} hours / day</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {alreadyBid ? (
                        <div className="w-full text-center py-2 bg-emerald-50 border border-emerald-205 text-emerald-700 font-bold rounded text-xs">
                          Bid Placed
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenBidModal(req)}
                          disabled={!currentUser?.isVerified}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded transition text-xs shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Submit Bid Proposal
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MY BIDS & CONTRACTS TAB */}
      {activeTab === 'contracts' && (
        <div className="space-y-6 animate-fade-in bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Briefcase size={20} className="text-emerald-600" />
              Active Contracts & Proposals
            </h3>
            <p className="text-slate-550 text-xs mt-1">Track submitted quotations, rejection logs, and accepted procurement orders.</p>
          </div>

          {myBids.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-200 rounded-lg text-slate-400 text-sm">
              No bids submitted yet. Visit the Marketplace Feed to bid.
            </div>
          ) : (
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-450 uppercase tracking-wider font-bold">
                    <th className="py-3 px-2">Project Request</th>
                    <th className="py-3 px-2">Unit Bid</th>
                    <th className="py-3 px-2">Total Bid</th>
                    <th className="py-3 px-2">Timeline</th>
                    <th className="py-3 px-2">Bid Status</th>
                    <th className="py-3 px-2 text-right">Fulfillment</th>
                  </tr>
                </thead>
                <tbody>
                  {myBids.map(bid => {
                    const req = requirements.find(r => r.id === bid.requirementId);
                    return (
                      <tr key={bid.id} className="border-b border-slate-100 text-slate-700">
                        <td className="py-3.5 px-2">
                          <p className="text-slate-900 font-bold">{req?.categoryName}</p>
                          <p className="text-[10px] text-slate-500 font-mono">Client: {req?.orgName}</p>
                        </td>
                        <td className="py-3.5 px-2 font-mono">₹{bid.pricePerUnit}</td>
                        <td className="py-3.5 px-2 font-mono font-bold text-slate-900">{formatCurrency(bid.totalAmount)}</td>
                        <td className="py-3.5 px-2">{bid.deliveryTimelineDays} days</td>
                        <td className="py-3.5 px-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-flex items-center gap-1 ${
                            bid.status === 'Accepted' ? 'bg-emerald-55 text-emerald-700 border-emerald-200' :
                            bid.status === 'Pending' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {bid.status === 'Accepted' && <CheckCircle size={10} />}
                            {bid.status === 'Pending' && <Clock size={10} />}
                            {bid.status === 'Rejected' && <XCircle size={10} />}
                            {bid.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-right">
                          {bid.status === 'Accepted' ? (
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-150">
                              Active Contract
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">None</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* BID MODAL CONTAINER */}
      {selectedReq && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 relative space-y-6 shadow-2xl">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Submit B2B Project Bid</h3>
              <p className="text-slate-500 text-xs mt-1">Provide competitive hardware pricing for {selectedReq.orgName}.</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 font-bold text-slate-650 shadow-inner">
              <p>Hardware: <span className="text-slate-800 font-bold">{selectedReq.categoryName}</span></p>
              <p>Requested Units: <span className="text-slate-800 font-mono font-bold">{selectedReq.quantity.toLocaleString()} units</span></p>
            </div>

            {bidSuccess ? (
              <div className="py-6 text-center text-emerald-600 font-bold text-sm">
                Bid submitted successfully to Client queue!
              </div>
            ) : (
              <form onSubmit={handleSubmitBid} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="block text-slate-500 font-bold">Unit Procurement Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 300"
                    onChange={(e) => setPricePerUnit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded text-slate-900 focus:outline-none focus:border-emerald-500"
                    required
                    min="1"
                  />
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">
                    Projected Total Quote: {formatCurrency(pricePerUnit * selectedReq.quantity)}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-500 font-bold">Delivery Timeline (Days)</label>
                  <input
                    type="number"
                    value={timelineDays}
                    onChange={(e) => setTimelineDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded text-slate-900 focus:outline-none"
                    required
                    min="1"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedReq(null)}
                    className="w-1/2 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold transition shadow-md hover:shadow-emerald-600/10"
                  >
                    Submit Quotation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
