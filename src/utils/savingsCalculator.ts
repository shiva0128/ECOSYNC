import type { Category } from '../context/MockDbContext';

export interface SavingsResults {
  legacyAnnualEnergyKWh: number;
  upgradeAnnualEnergyKWh: number;
  legacyAnnualCost: number;
  upgradeAnnualCost: number;
  legacyEnergyCost: number;
  upgradeEnergyCost: number;
  legacyMaintCost: number;
  upgradeMaintCost: number;
  capex: number;
  annualSavings: number;
  breakevenYears: number;
  co2OffsetTons: number;
  eWasteWeightKg: number;
  fiveYearSavings: number;
  tcoData: Array<{ year: number; legacyCost: number; upgradeCost: number }>;
  fiveYearBreakdown: Array<{
    name: string;
    Energy: number;
    Maintenance: number;
    Capital: number;
  }>;
}

export const calculateSavings = (
  category: Category,
  quantity: number,
  runtimeHrs: number,
  electricityRate: number
): SavingsResults => {
  const CO2_FACTOR_KG_KWH = 0.82; // Indian grid average emission factor: 0.82 kg CO2 / kWh

  let legacyAnnualEnergyKWh = 0;
  let upgradeAnnualEnergyKWh = 0;
  let legacyEnergyCost = 0;
  let upgradeEnergyCost = 0;
  let legacyMaintCost = 0;
  let upgradeMaintCost = 0;
  let capex = 0;
  let annualSavings = 0;
  let breakevenYears = 0;
  let co2OffsetTons = 0;
  let eWasteWeightKg = category.eWasteWeightKg * quantity;

  if (category.type === 'comparison') {
    // Replaced device comparison
    legacyAnnualEnergyKWh = (category.legacyPowerW * quantity * runtimeHrs * 365) / 1000;
    upgradeAnnualEnergyKWh = (category.upgradePowerW * quantity * runtimeHrs * 365) / 1000;

    legacyEnergyCost = legacyAnnualEnergyKWh * electricityRate;
    upgradeEnergyCost = upgradeAnnualEnergyKWh * electricityRate;

    legacyMaintCost = category.legacyMaintCostYr * quantity;
    upgradeMaintCost = category.upgradeMaintCostYr * quantity;

    capex = category.unitCost * quantity;

    const legacyTotalAnnual = legacyEnergyCost + legacyMaintCost;
    const upgradeTotalAnnual = upgradeEnergyCost + upgradeMaintCost;

    annualSavings = legacyTotalAnnual - upgradeTotalAnnual;
    breakevenYears = annualSavings > 0 ? capex / annualSavings : Infinity;
    co2OffsetTons = ((legacyAnnualEnergyKWh - upgradeAnnualEnergyKWh) * CO2_FACTOR_KG_KWH) / 1000;
  } else {
    // Standalone upgrade (e.g. Solar)
    // Here, legacyPowerW is used as the nominal capacity of the system (e.g. 10kW = 10000W)
    // Assume 10kW system generates 15,000 kWh/year
    const annualYieldPerUnitKWh = 15000;
    const annualYieldTotalKWh = annualYieldPerUnitKWh * quantity;

    // The legacy setup consumes this grid electricity; upgrade offsets it
    legacyAnnualEnergyKWh = annualYieldTotalKWh;
    upgradeAnnualEnergyKWh = 0; // Solar offsets it to 0

    legacyEnergyCost = annualYieldTotalKWh * electricityRate;
    upgradeEnergyCost = 0;

    legacyMaintCost = 0;
    upgradeMaintCost = category.upgradeMaintCostYr * quantity;

    capex = category.unitCost * quantity;

    const legacyTotalAnnual = legacyEnergyCost + legacyMaintCost;
    const upgradeTotalAnnual = upgradeEnergyCost + upgradeMaintCost;

    annualSavings = legacyTotalAnnual - upgradeTotalAnnual;
    breakevenYears = annualSavings > 0 ? capex / annualSavings : Infinity;
    co2OffsetTons = (annualYieldTotalKWh * CO2_FACTOR_KG_KWH) / 1000;
  }

  // TCO data over 10 years
  const tcoData = [];
  for (let year = 0; year <= 10; year++) {
    const legacyCost = (legacyEnergyCost + legacyMaintCost) * year;
    const upgradeCost = capex + (upgradeEnergyCost + upgradeMaintCost) * year;
    tcoData.push({
      year,
      legacyCost: Math.round(legacyCost),
      upgradeCost: Math.round(upgradeCost),
    });
  }

  // 5-Year Cumulative Expenses Breakdown (for stacked bar chart)
  const legacyTotalMaint = legacyMaintCost * 5;
  const legacyTotalEnergy = legacyEnergyCost * 5;

  const upgradeTotalMaint = upgradeMaintCost * 5;
  const upgradeTotalEnergy = upgradeEnergyCost * 5;

  const fiveYearBreakdown = [
    {
      name: 'Legacy Setup',
      Capital: 0,
      Maintenance: Math.round(legacyTotalMaint),
      Energy: Math.round(legacyTotalEnergy),
    },
    {
      name: 'EcoSync Upgrade',
      Capital: Math.round(capex),
      Maintenance: Math.round(upgradeTotalMaint),
      Energy: Math.round(upgradeTotalEnergy),
    },
  ];

  const legacy5YrTotal = legacyTotalEnergy + legacyTotalMaint;
  const upgrade5YrTotal = capex + upgradeTotalEnergy + upgradeTotalMaint;
  const fiveYearSavings = legacy5YrTotal - upgrade5YrTotal;

  return {
    legacyAnnualEnergyKWh,
    upgradeAnnualEnergyKWh,
    legacyAnnualCost: legacyEnergyCost + legacyMaintCost,
    upgradeAnnualCost: upgradeEnergyCost + upgradeMaintCost,
    legacyEnergyCost,
    upgradeEnergyCost,
    legacyMaintCost,
    upgradeMaintCost,
    capex,
    annualSavings,
    breakevenYears: isNaN(breakevenYears) ? 0 : parseFloat(breakevenYears.toFixed(2)),
    co2OffsetTons: parseFloat(co2OffsetTons.toFixed(2)),
    eWasteWeightKg,
    fiveYearSavings: Math.round(fiveYearSavings),
    tcoData,
    fiveYearBreakdown,
  };
};
