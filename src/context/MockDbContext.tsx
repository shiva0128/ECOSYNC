import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'Admin' | 'Organization' | 'Vendor' | 'Recycler';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  rating?: number; // Vendors only
}

export interface Category {
  id: string;
  name: string;
  type: 'comparison' | 'standalone';
  legacyName: string;
  upgradeName: string;
  legacyPowerW: number;
  upgradePowerW: number;
  legacyMaintCostYr: number;
  upgradeMaintCostYr: number;
  unitCost: number;
  lifespanYears: number;
  eWasteWeightKg: number;
}

export interface Requirement {
  id: string;
  orgId: string;
  orgName: string;
  categoryId: string;
  categoryName: string;
  quantity: number;
  runtimeHrs: number;
  electricityRate: number;
  status: 'Open' | 'Bidding' | 'Fulfilled';
  datePosted: string;
}

export interface Bid {
  id: string;
  requirementId: string;
  vendorId: string;
  vendorName: string;
  pricePerUnit: number;
  totalAmount: number;
  deliveryTimelineDays: number;
  rating: number;
  status: 'Pending' | 'Accepted' | 'Rejected';
  dateSubmitted: string;
}

export interface DisposalLog {
  id: string;
  requirementId: string;
  orgId: string;
  orgName: string;
  recyclerId: string;
  recyclerName: string;
  categoryName: string;
  quantity: number;
  status: 'Dismantling' | 'In Transit' | 'Recycled';
  toxicWasteDivertedKg: number;
  certificateIssued: boolean;
  lastUpdated: string;
}

interface MockDbContextType {
  currentUser: User | null;
  users: User[];
  categories: Category[];
  requirements: Requirement[];
  bids: Bid[];
  disposalLogs: DisposalLog[];
  login: (email: string) => boolean;
  signup: (name: string, email: string, role: UserRole) => User;
  logout: () => void;
  verifyUser: (userId: string, action: 'approve' | 'reject') => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  postRequirement: (categoryId: string, quantity: number, runtimeHrs: number, electricityRate: number) => void;
  submitBid: (requirementId: string, pricePerUnit: number, deliveryTimelineDays: number) => void;
  acceptBid: (requirementId: string, bidId: string) => void;
  updateDisposalStatus: (logId: string, status: DisposalLog['status']) => void;
  issueCertificate: (logId: string) => void;
  setCurrentUserByRole: (role: UserRole | 'Guest') => void;
}

const MockDbContext = createContext<MockDbContextType | undefined>(undefined);

const initialUsers: User[] = [
  { id: 'u1', name: 'EcoSync Governor', email: 'admin@ecosync.com', role: 'Admin', isVerified: true },
  { id: 'u2', name: 'Tata Industrial Corp', email: 'tata@ecosync.com', role: 'Organization', isVerified: true },
  { id: 'u3', name: 'Apex Electronics Retail', email: 'apex@ecosync.com', role: 'Organization', isVerified: true },
  { id: 'u4', name: 'GreenVolt Hardware Solutions', email: 'greenvolt@ecosync.com', role: 'Vendor', isVerified: true, rating: 4.8 },
  { id: 'u5', name: 'BriteLight LED Suppliers', email: 'britelight@ecosync.com', role: 'Vendor', isVerified: true, rating: 4.5 },
  { id: 'u6', name: 'CleanCycle E-Waste Recyclers', email: 'cleancycle@ecosync.com', role: 'Recycler', isVerified: true },
  { id: 'u7', name: 'EcoMelt Metals & Plastics', email: 'ecomelt@ecosync.com', role: 'Recycler', isVerified: false },
  { id: 'u8', name: 'Pending Energy Corp', email: 'pending@ecosync.com', role: 'Organization', isVerified: false }
];

const initialCategories: Category[] = [
  {
    id: 't8-led',
    name: 'T8 to LED 18W',
    type: 'comparison',
    legacyName: 'T8 Fluorescent Tube (36W)',
    upgradeName: 'LED Tube (18W)',
    legacyPowerW: 36,
    upgradePowerW: 18,
    legacyMaintCostYr: 150,
    upgradeMaintCostYr: 50,
    unitCost: 350,
    lifespanYears: 5,
    eWasteWeightKg: 0.3
  },
  {
    id: 'fan-bldc',
    name: 'Fan 75W to BLDC 28W',
    type: 'comparison',
    legacyName: 'Standard AC Fan (75W)',
    upgradeName: 'BLDC Ceiling Fan (28W)',
    legacyPowerW: 75,
    upgradePowerW: 28,
    legacyMaintCostYr: 250,
    upgradeMaintCostYr: 75,
    unitCost: 2800,
    lifespanYears: 10,
    eWasteWeightKg: 12.0
  },
  {
    id: 'solar-10kw',
    name: 'Solar On-Grid 10kW',
    type: 'standalone',
    legacyName: 'Grid Power (Offset)',
    upgradeName: 'Solar PV Array 10kW',
    legacyPowerW: 10000, // represent energy generated offset
    upgradePowerW: 0,
    legacyMaintCostYr: 0,
    upgradeMaintCostYr: 3000,
    unitCost: 480000,
    lifespanYears: 25,
    eWasteWeightKg: 185.0
  }
];

const initialRequirements: Requirement[] = [
  {
    id: 'r1',
    orgId: 'u2',
    orgName: 'Tata Industrial Corp',
    categoryId: 't8-led',
    categoryName: 'T8 to LED 18W',
    quantity: 1200,
    runtimeHrs: 12,
    electricityRate: 9,
    status: 'Open',
    datePosted: '2026-07-01'
  },
  {
    id: 'r2',
    orgId: 'u3',
    orgName: 'Apex Electronics Retail',
    categoryId: 'fan-bldc',
    categoryName: 'Fan 75W to BLDC 28W',
    quantity: 350,
    runtimeHrs: 18,
    electricityRate: 8,
    status: 'Open',
    datePosted: '2026-07-03'
  }
];

const initialBids: Bid[] = [
  {
    id: 'b1',
    requirementId: 'r1',
    vendorId: 'u4',
    vendorName: 'GreenVolt Hardware Solutions',
    pricePerUnit: 330,
    totalAmount: 396000,
    deliveryTimelineDays: 14,
    rating: 4.8,
    status: 'Pending',
    dateSubmitted: '2026-07-02'
  },
  {
    id: 'b2',
    requirementId: 'r1',
    vendorId: 'u5',
    vendorName: 'BriteLight LED Suppliers',
    pricePerUnit: 310,
    totalAmount: 372000,
    deliveryTimelineDays: 20,
    rating: 4.5,
    status: 'Pending',
    dateSubmitted: '2026-07-02'
  }
];

const initialDisposalLogs: DisposalLog[] = [];

export const MockDbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ecosync_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('ecosync_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });
  const [requirements, setRequirements] = useState<Requirement[]>(() => {
    const saved = localStorage.getItem('ecosync_requirements');
    return saved ? JSON.parse(saved) : initialRequirements;
  });
  const [bids, setBids] = useState<Bid[]>(() => {
    const saved = localStorage.getItem('ecosync_bids');
    return saved ? JSON.parse(saved) : initialBids;
  });
  const [disposalLogs, setDisposalLogs] = useState<DisposalLog[]>(() => {
    const saved = localStorage.getItem('ecosync_disposal');
    return saved ? JSON.parse(saved) : initialDisposalLogs;
  });

  // Save state to localStorage for persistence across testing reloads
  useEffect(() => {
    localStorage.setItem('ecosync_users', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem('ecosync_categories', JSON.stringify(categories));
  }, [categories]);
  useEffect(() => {
    localStorage.setItem('ecosync_requirements', JSON.stringify(requirements));
  }, [requirements]);
  useEffect(() => {
    localStorage.setItem('ecosync_bids', JSON.stringify(bids));
  }, [bids]);
  useEffect(() => {
    localStorage.setItem('ecosync_disposal', JSON.stringify(disposalLogs));
  }, [disposalLogs]);

  // Login handler
  const login = (email: string): boolean => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  // Signup handler
  const signup = (name: string, email: string, role: UserRole): User => {
    const isVerified = role === 'Admin'; // Admin is pre-verified, others pending admin approval
    const newUser: User = {
      id: 'u_' + Math.random().toString(36).substring(2, 9),
      name,
      email,
      role,
      isVerified,
      rating: role === 'Vendor' ? 5.0 : undefined
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  // Logout handler
  const logout = () => {
    setCurrentUser(null);
  };

  // Admin verifies user
  const verifyUser = (userId: string, action: 'approve' | 'reject') => {
    setUsers(prev => 
      prev.map(u => u.id === userId ? { ...u, isVerified: action === 'approve' } : u)
    );
    // If the active user was updated, update currentUser state too
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, isVerified: action === 'approve' } : null);
    }
  };

  // Admin adds comparison/upgrade category
  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: 'cat_' + Math.random().toString(36).substring(2, 9)
    };
    setCategories(prev => [...prev, newCategory]);
  };

  // Organization posts requirement
  const postRequirement = (categoryId: string, quantity: number, runtimeHrs: number, electricityRate: number) => {
    if (!currentUser || currentUser.role !== 'Organization') return;
    const cat = categories.find(c => c.id === categoryId);
    if (!cat) return;

    const newReq: Requirement = {
      id: 'r_' + Math.random().toString(36).substring(2, 9),
      orgId: currentUser.id,
      orgName: currentUser.name,
      categoryId,
      categoryName: cat.name,
      quantity,
      runtimeHrs,
      electricityRate,
      status: 'Open',
      datePosted: new Date().toISOString().split('T')[0]
    };
    setRequirements(prev => [newReq, ...prev]);
  };

  // Vendor submits bid
  const submitBid = (requirementId: string, pricePerUnit: number, deliveryTimelineDays: number) => {
    if (!currentUser || currentUser.role !== 'Vendor') return;
    const totalAmount = pricePerUnit * (requirements.find(r => r.id === requirementId)?.quantity || 1);

    const newBid: Bid = {
      id: 'b_' + Math.random().toString(36).substring(2, 9),
      requirementId,
      vendorId: currentUser.id,
      vendorName: currentUser.name,
      pricePerUnit,
      totalAmount,
      deliveryTimelineDays,
      rating: currentUser.rating || 5.0,
      status: 'Pending',
      dateSubmitted: new Date().toISOString().split('T')[0]
    };
    setBids(prev => [...prev, newBid]);
  };

  // Organization accepts vendor bid
  const acceptBid = (requirementId: string, bidId: string) => {
    if (!currentUser || currentUser.role !== 'Organization') return;

    // 1. Update requirement status
    setRequirements(prev =>
      prev.map(r => r.id === requirementId ? { ...r, status: 'Fulfilled' } : r)
    );

    // 2. Update bids statuses
    setBids(prev =>
      prev.map(b => {
        if (b.requirementId === requirementId) {
          return b.id === bidId ? { ...b, status: 'Accepted' } : { ...b, status: 'Rejected' };
        }
        return b;
      })
    );

    // 3. Create e-waste disposal log automatically (Circular Loop requirement!)
    const req = requirements.find(r => r.id === requirementId);
    const bid = bids.find(b => b.id === bidId);
    if (!req) return;

    const cat = categories.find(c => c.id === req.categoryId);
    const wasteWeight = cat ? cat.eWasteWeightKg * req.quantity : 10 * req.quantity;

    // Pick first available verified recycler or fallback to a dummy if none verified
    const verifiedRecyclers = users.filter(u => u.role === 'Recycler' && u.isVerified);
    const assignedRecycler = verifiedRecyclers.length > 0 
      ? verifiedRecyclers[Math.floor(Math.random() * verifiedRecyclers.length)]
      : { id: 'fallback-rec', name: 'General Circular Processing' };

    const newLog: DisposalLog = {
      id: 'dl_' + Math.random().toString(36).substring(2, 9),
      requirementId,
      orgId: currentUser.id,
      orgName: currentUser.name,
      recyclerId: assignedRecycler.id,
      recyclerName: assignedRecycler.name,
      categoryName: req.categoryName,
      quantity: req.quantity,
      status: 'Dismantling',
      toxicWasteDivertedKg: parseFloat(wasteWeight.toFixed(2)),
      certificateIssued: false,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setDisposalLogs(prev => [newLog, ...prev]);
  };

  // Recycler updates logistics status
  const updateDisposalStatus = (logId: string, status: DisposalLog['status']) => {
    setDisposalLogs(prev =>
      prev.map(l => l.id === logId ? { ...l, status, lastUpdated: new Date().toISOString().split('T')[0] } : l)
    );
  };

  // Recycler issues compliance certificate
  const issueCertificate = (logId: string) => {
    setDisposalLogs(prev =>
      prev.map(l => l.id === logId ? { ...l, certificateIssued: true, lastUpdated: new Date().toISOString().split('T')[0] } : l)
    );
  };

  // Quick switch role (Helper for B2B demo/prototyping)
  const setCurrentUserByRole = (role: UserRole | 'Guest') => {
    if (role === 'Guest') {
      setCurrentUser(null);
    } else {
      const found = users.find(u => u.role === role && u.isVerified);
      if (found) {
        setCurrentUser(found);
      } else {
        // Fallback to first user of that role
        const fallback = users.find(u => u.role === role);
        if (fallback) setCurrentUser(fallback);
      }
    }
  };

  return (
    <MockDbContext.Provider value={{
      currentUser,
      users,
      categories,
      requirements,
      bids,
      disposalLogs,
      login,
      signup,
      logout,
      verifyUser,
      addCategory,
      postRequirement,
      submitBid,
      acceptBid,
      updateDisposalStatus,
      issueCertificate,
      setCurrentUserByRole
    }}>
      {children}
    </MockDbContext.Provider>
  );
};

export const useMockDb = () => {
  const context = useContext(MockDbContext);
  if (context === undefined) {
    throw new Error('useMockDb must be used within a MockDbProvider');
  }
  return context;
};
