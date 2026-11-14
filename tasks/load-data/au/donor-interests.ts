import type { DonorInterestAttribution } from "@/types/interests";

import { AttributionRole, PolicyInterestTag } from "@/types/interests";

/**
 * Australian donor interest mapping for international 24-tag policy interest & lobby group tracking.
 */
export const AUSTRALIAN_DONOR_INTERESTS_BY_NAME: Record<
  string,
  DonorInterestAttribution[]
> = {
  // ==========================================
  // Domain 1: Energy & Resources
  // ==========================================
  "Woodside Energy Group Ltd": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.partial },
  ],
  "Woodside Energy Ltd": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.partial },
  ],
  Woodside: [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.partial },
  ],
  "Santos Ltd": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
  ],
  Santos: [{ tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core }],
  "BHP Group Ltd": [
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.partial },
  ],
  "BHP Billiton Ltd": [
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.partial },
  ],
  BHP: [
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.partial },
  ],
  "Rio Tinto Ltd": [
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
  ],
  "Rio Tinto": [
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
  ],
  "Hancock Prospecting Pty Ltd": [
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.partial },
  ],
  "Hancock Coal Infrastructure Pty Ltd": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
  ],
  "Hancock Prospecting": [
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.partial },
  ],
  "Roy Hill Holdings Pty Ltd": [
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
  ],
  "Roy Hill Operations Pty Ltd": [
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
  ],
  "Roy Hill": [
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
  ],
  "Mineral Resources Ltd": [
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.partial },
  ],
  "Mineral Resources": [
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.partial },
  ],
  "Minerals Council of Australia": [
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
  ],
  "New South Wales Minerals Council Ltd": [
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
  ],
  "Squadron Energy Pty Ltd": [
    { tag: PolicyInterestTag.RenewablesCleantech, role: AttributionRole.core },
  ],
  "Squadron Energy": [
    { tag: PolicyInterestTag.RenewablesCleantech, role: AttributionRole.core },
  ],
  "Clean Energy Council Ltd": [
    { tag: PolicyInterestTag.RenewablesCleantech, role: AttributionRole.core },
  ],
  "Clean Energy Council": [
    { tag: PolicyInterestTag.RenewablesCleantech, role: AttributionRole.core },
  ],
  "National Farmers Federation": [
    { tag: PolicyInterestTag.AgricultureForestry, role: AttributionRole.core },
  ],
  "National Farmers' Federation": [
    { tag: PolicyInterestTag.AgricultureForestry, role: AttributionRole.core },
  ],
  "Mineralogy Pty Ltd": [
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
  ],
  "Queensland Nickel Pty Ltd": [
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
  ],
  "Waratah Coal Pty Ltd": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
  ],
  "Coal Australia Ltd": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
  ],
  "Australian Energy Producers": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
  ],
  "APPEA Limited trading as Australian Energy Producers": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
  ],
  "Adani Mining Pty Ltd": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
  ],
  "Chevron Australia Ptd Ltd": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
  ],
  "Chevron Australia Pty Ltd": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
  ],
  "Chevron Australia": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
  ],
  Chevron: [{ tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core }],
  "INPEX Operations Australia Pty Ltd": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
  ],
  INPEX: [{ tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core }],
  "Origin Energy": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.RenewablesCleantech,
      role: AttributionRole.partial,
    },
  ],
  "Origin Energy Ltd": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.RenewablesCleantech,
      role: AttributionRole.partial,
    },
  ],
  "Ampol Ltd": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.partial },
  ],
  Ampol: [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.partial },
  ],
  "Alinta Servco Pty Ltd": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.RenewablesCleantech,
      role: AttributionRole.partial,
    },
  ],
  "Alinta Energy": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.RenewablesCleantech,
      role: AttributionRole.partial,
    },
  ],
  "Tamboran Resources Ltd": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
  ],
  "AUS GOLD MINING GROUP PTY LTD": [
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
  ],
  "Nimrod Resources Ltd": [
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
  ],
  "Cartwheel Resources Pty Ltd": [
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
  ],
  "QN Resources Pty Ltd": [
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
  ],
  "Queensland Nickel Sales Pty Ltd": [
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
  ],
  "Sugolena Pty Ltd": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "SUGOLENA HOLDINGS PTY LTD": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "Marks, Paul": [
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
  ],
  "P Marks Investment Pty Ltd": [
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
  ],
  "Waratah Group (Australia) Pty Ltd": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
  ],
  "The Trustee for St Baker Family Trust": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.RenewablesCleantech,
      role: AttributionRole.partial,
    },
  ],
  "Boundless Earth Ltd": [
    { tag: PolicyInterestTag.RenewablesCleantech, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "The Sunrise Project Australia Ltd": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.RenewablesCleantech,
      role: AttributionRole.partial,
    },
  ],
  "Manildra Group": [
    { tag: PolicyInterestTag.AgricultureForestry, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.partial,
    },
  ],
  "Pardoo Beef Corporation Pty Ltd": [
    { tag: PolicyInterestTag.AgricultureForestry, role: AttributionRole.core },
  ],
  "Burnewang Pastoral Company Pty Ltd": [
    { tag: PolicyInterestTag.AgricultureForestry, role: AttributionRole.core },
  ],

  // ==========================================
  // Domain 2: Built Environment
  // ==========================================
  "Meriton Properties Pty Ltd": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  Meriton: [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Sentinel Property Group": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Walker Group Holdings Pty Ltd": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Walker Corporation Pty Ltd": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Walker Corporation": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Property Council of Australia Ltd": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Property Council of Australia": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  Lendlease: [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.core,
    },
  ],
  "Lendlease Corporation Ltd": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.core,
    },
  ],
  "Lend Lease": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.core,
    },
  ],
  "John Holland Group Pty Ltd": [
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.core,
    },
  ],
  "John Holland": [
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.core,
    },
  ],
  "Master Builders Australia Ltd": [
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.core,
    },
  ],
  "Master Builders Australia": [
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.core,
    },
  ],
  "Master Builders Association QLD": [
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.core,
    },
  ],
  "Qantas Airways Ltd": [
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.core },
  ],
  Qantas: [
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.core },
  ],
  "Virgin Australia Airlines Pty Ltd": [
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.core },
  ],
  "Virgin Australia": [
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.core },
  ],
  "Linfox Australia Pty Ltd": [
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.core },
  ],
  Linfox: [
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.core },
  ],
  "Altum Pty Ltd ATF The Altum Property Unit Trust": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Transurban Ltd": [
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.core,
    },
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.partial },
  ],
  Transurban: [
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.core,
    },
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.partial },
  ],
  "Plenary Group Holdings Pty Ltd": [
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.PropertyDevelopment,
      role: AttributionRole.partial,
    },
  ],
  "Plenary Group": [
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.PropertyDevelopment,
      role: AttributionRole.partial,
    },
  ],
  "Australian Gypsum Industries": [
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.partial,
    },
  ],
  "Australia Pacific Airports Corporation": [
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.partial,
    },
  ],
  "Regional Express Holdings Ltd": [
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.core },
  ],
  "Rex Airlines": [
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.core },
  ],
  "Bus Association Victoria": [
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.core },
  ],
  "Australian Trucking Association Ltd": [
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.core },
  ],
  "Australian Trucking Association": [
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.core },
  ],
  "Fox Group Holdings Pty Ltd": [
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.PropertyDevelopment,
      role: AttributionRole.partial,
    },
  ],
  "Westfield Corporation Ltd": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  Westfield: [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "The Gandel Group Pty Ltd": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Henroth Investments Pty Ltd": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Satterley Property Group Pty Ltd": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Satterley Property Group": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Payce Management Pty Ltd": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Toga Pty. Ltd.": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.HospitalityTourism,
      role: AttributionRole.partial,
    },
  ],
  Toga: [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.HospitalityTourism,
      role: AttributionRole.partial,
    },
  ],
  "Consolidated Properties Group": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Springfield Land Corporation ATF Springfield Development Trust": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Servcorp Administration Pty Ltd": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  Servcorp: [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "THE TRUSTEE FOR PRECISION GROUP UNIT TRUST": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Brunswick Property Vic Pty Ltd": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Catsaras, Marcus": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "SILVER RIVER INVESTMENT HOLDINGS PTY LTD": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "Randazzo C & G Development": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Randazzo Properties NT Pty Ltd": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],

  // ==========================================
  // Domain 3: Finance & Advisory
  // ==========================================
  "ANZ Banking Group Ltd": [
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.core },
  ],
  "ANZ Bank": [
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.core },
  ],
  ANZ: [{ tag: PolicyInterestTag.BankingLending, role: AttributionRole.core }],
  "Commonwealth Bank of Australia": [
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.core },
  ],
  CBA: [{ tag: PolicyInterestTag.BankingLending, role: AttributionRole.core }],
  "National Australia Bank Ltd": [
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.core },
  ],
  "National Australia Bank": [
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.core },
  ],
  NAB: [{ tag: PolicyInterestTag.BankingLending, role: AttributionRole.core }],
  "Westpac Banking Corporation": [
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.core },
  ],
  "Westpac Group": [
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.core },
  ],
  Westpac: [
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.core },
  ],
  "Australian Banking Association Ltd": [
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.core },
  ],
  "Australian Banking Association": [
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.core },
  ],
  "Macquarie Group Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.partial },
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.partial },
  ],
  "Macquarie Bank Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.partial },
  ],
  Macquarie: [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.partial },
  ],
  "Industry Super Australia Pty Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Industry Super Australia": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  PricewaterhouseCoopers: [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "PwC Australia": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  PwC: [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "Deloitte Touche Tohmatsu": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  Deloitte: [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "Ernst & Young": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  EY: [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "KPMG Australia": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  KPMG: [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "Maurice Blackburn Pty Ltd": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "Maurice Blackburn": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "BDO Australia": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  BDO: [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "Financial Services Council Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Insurance Council of Australia Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Insurance Australia Group Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  IAG: [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Allianz Australia Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Allianz Australia Insurance Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  Allianz: [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "QBE Insurance (Australia) Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  QBE: [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Suncorp Group Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.core },
  ],
  Suncorp: [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.core },
  ],
  "TAL Services Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Genworth Mortgage Insurance Australia Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.partial },
  ],
  "Customer Owned Banking Association": [
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.core },
  ],
  COBA: [{ tag: PolicyInterestTag.BankingLending, role: AttributionRole.core }],
  "Australian Finance Industry Association": [
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.core },
    { tag: PolicyInterestTag.CryptoFintech, role: AttributionRole.partial },
  ],
  AFIA: [
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.core },
    { tag: PolicyInterestTag.CryptoFintech, role: AttributionRole.partial },
  ],
  "Australian Investment Council Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Employers Mutual Management Pty Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Crescent Capital Partners Holdings Pty Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Stonehill Nominees Pty Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Jefferson Investments Pty Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "William Taylor Nominees Pty Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Tripple Ventures Pty Ltd ATF Tripple Ventures Unit Trust": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.RenewablesCleantech,
      role: AttributionRole.partial,
    },
  ],
  "Tripple Extension Pty Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.RenewablesCleantech,
      role: AttributionRole.partial,
    },
  ],
  "GSA Capital Pty Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.PropertyDevelopment,
      role: AttributionRole.partial,
    },
  ],
  "Visa AP (Australia) Pty Ltd": [
    { tag: PolicyInterestTag.CryptoFintech, role: AttributionRole.core },
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.partial },
  ],
  "Visa Worldwide": [
    { tag: PolicyInterestTag.CryptoFintech, role: AttributionRole.core },
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.partial },
  ],
  "Keldoulis Investments Pty Ltd": [
    { tag: PolicyInterestTag.CryptoFintech, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "Keldoulis, Robert": [
    { tag: PolicyInterestTag.CryptoFintech, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "COINBASE AUSTRALIA PTY LTD": [
    { tag: PolicyInterestTag.CryptoFintech, role: AttributionRole.core },
  ],
  Coinbase: [
    { tag: PolicyInterestTag.CryptoFintech, role: AttributionRole.core },
  ],
  "SWYFTX PTY LTD": [
    { tag: PolicyInterestTag.CryptoFintech, role: AttributionRole.core },
  ],
  Swyftx: [
    { tag: PolicyInterestTag.CryptoFintech, role: AttributionRole.core },
  ],
  "CRYPTOLOC TECHNOLOGY PTY LTD": [
    { tag: PolicyInterestTag.CryptoFintech, role: AttributionRole.core },
  ],
  "Craven, Edward James": [
    { tag: PolicyInterestTag.CryptoFintech, role: AttributionRole.core },
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.core },
  ],
  "Holding Redlich": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "Slater & Gordon Ltd": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "Slater & Gordon": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "Arnold Bloch Leibler": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "Zaparas Lawyers": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "Hawker Britton Pty Ltd": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "PremierNational Pty Ltd": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "Barton Deakin Pty Ltd": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "Nexus APAC Pty Ltd": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "Precision Public Affairs Pty Ltd": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "Envoy Public Affairs": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "The Civic Group": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "Corporate Affairs Australia Pty Ltd": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "Anacta Strategies Pty Ltd": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "Sarina Russo": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "Sarina Russo Group": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "Sarina Russo Job Access (Australia) Pty. Ltd.": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "ORYXIUM PTY Ltd": [
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.core,
    },
  ],

  // ==========================================
  // Domain 4: Regulated Consumer
  // ==========================================
  "TABCORP HOLDINGS Ltd": [
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.HospitalityTourism,
      role: AttributionRole.partial,
    },
  ],
  "Tabcorp Holdings Ltd": [
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.HospitalityTourism,
      role: AttributionRole.partial,
    },
  ],
  Tabcorp: [
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.HospitalityTourism,
      role: AttributionRole.partial,
    },
  ],
  "Sportsbet PTY LTD": [
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.core },
  ],
  "Sportsbet Pty Ltd": [
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.core },
  ],
  Sportsbet: [
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.core },
  ],
  "The Star Entertainment Group Ltd": [
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.core },
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
  ],
  "Star Entertainment Group": [
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.core },
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
  ],
  "Star Entertainment": [
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.core },
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
  ],
  "Crown Resorts Ltd": [
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.HospitalityTourism,
      role: AttributionRole.partial,
    },
  ],
  "Crown Resorts": [
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.HospitalityTourism,
      role: AttributionRole.partial,
    },
  ],
  "Responsible Wagering Australia Holdings Ltd": [
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.core },
  ],
  "Responsible Wagering Australia": [
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.core },
  ],
  "Australian Hotels Association": [
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.partial },
    { tag: PolicyInterestTag.AlcoholBeverages, role: AttributionRole.partial },
  ],
  ClubsNSW: [
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.partial },
    { tag: PolicyInterestTag.AlcoholBeverages, role: AttributionRole.partial },
  ],
  "Endeavour Group Ltd": [
    { tag: PolicyInterestTag.AlcoholBeverages, role: AttributionRole.core },
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.partial },
  ],
  "Endeavour Group": [
    { tag: PolicyInterestTag.AlcoholBeverages, role: AttributionRole.core },
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.partial },
  ],
  "Lion Pty Ltd": [
    { tag: PolicyInterestTag.AlcoholBeverages, role: AttributionRole.core },
  ],
  Lion: [
    { tag: PolicyInterestTag.AlcoholBeverages, role: AttributionRole.core },
  ],
  "Carlton & United Breweries": [
    { tag: PolicyInterestTag.AlcoholBeverages, role: AttributionRole.core },
  ],
  "Carlton & United Breweries Ltd": [
    { tag: PolicyInterestTag.AlcoholBeverages, role: AttributionRole.core },
  ],
  "CUB Pty Ltd": [
    { tag: PolicyInterestTag.AlcoholBeverages, role: AttributionRole.core },
  ],
  "Philip Morris Ltd": [
    { tag: PolicyInterestTag.TobaccoNicotine, role: AttributionRole.core },
  ],
  "Philip Morris": [
    { tag: PolicyInterestTag.TobaccoNicotine, role: AttributionRole.core },
  ],
  "Woolworths Group Ltd": [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
    { tag: PolicyInterestTag.AlcoholBeverages, role: AttributionRole.partial },
  ],
  "Woolworths Ltd": [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
    { tag: PolicyInterestTag.AlcoholBeverages, role: AttributionRole.partial },
  ],
  Woolworths: [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
    { tag: PolicyInterestTag.AlcoholBeverages, role: AttributionRole.partial },
  ],
  "Coles Group Ltd": [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
    { tag: PolicyInterestTag.AlcoholBeverages, role: AttributionRole.partial },
  ],
  Coles: [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
    { tag: PolicyInterestTag.AlcoholBeverages, role: AttributionRole.partial },
  ],
  "Wesfarmers Ltd": [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.partial },
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.partial },
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.partial,
    },
  ],
  Wesfarmers: [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.partial },
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.partial },
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.partial,
    },
  ],
  "The Lottery Corporation Ltd": [
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.core },
  ],
  "The Lottery Corporation": [
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.core },
  ],
  "Turpie, Duncan": [
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.partial,
    },
  ],
  "CLUBS AUSTRALIA Ltd": [
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.partial },
    { tag: PolicyInterestTag.AlcoholBeverages, role: AttributionRole.partial },
  ],
  "Clubs Australia": [
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.partial },
    { tag: PolicyInterestTag.AlcoholBeverages, role: AttributionRole.partial },
  ],
  "Spirits & Cocktails Australia": [
    { tag: PolicyInterestTag.AlcoholBeverages, role: AttributionRole.core },
  ],
  "Hemmes Trading Pty Ltd": [
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
    { tag: PolicyInterestTag.AlcoholBeverages, role: AttributionRole.partial },
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.partial },
  ],
  "Mathieson, Bruce": [
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.partial },
    { tag: PolicyInterestTag.AlcoholBeverages, role: AttributionRole.partial },
  ],
  "Village Roadshow Pty Ltd": [
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
    { tag: PolicyInterestTag.MediaBroadcasting, role: AttributionRole.partial },
  ],
  "Village Roadshow": [
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
    { tag: PolicyInterestTag.MediaBroadcasting, role: AttributionRole.partial },
  ],
  "Palmer Coolum Resort Pty Ltd": [
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.partial },
  ],
  "Packer, Roslyn": [
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.partial },
  ],
  "DoorDash Technologies Australia Pty Ltd": [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.TechTelecomPlatforms,
      role: AttributionRole.partial,
    },
  ],
  DoorDash: [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.TechTelecomPlatforms,
      role: AttributionRole.partial,
    },
  ],
  "Retail Guild of Australia Inc": [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
  ],
  "National Automotive Leasing and Salary Packaging Association": [
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.partial,
    },
  ],
  "Australian Automotive Dealer Association": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],

  // ==========================================
  // Domain 5: Health, Tech & Industry
  // ==========================================
  "Bayer Australia Ltd": [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.AgricultureForestry,
      role: AttributionRole.partial,
    },
  ],
  Bayer: [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.AgricultureForestry,
      role: AttributionRole.partial,
    },
  ],
  MSD: [{ tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core }],
  "Novartis Pharmaceuticals Australia Pty Ltd": [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
  ],
  Novartis: [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
  ],
  "Sanofi-Aventis Australia Pty Ltd": [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
  ],
  Sanofi: [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
  ],
  "Bristol-Myers Squibb Australia Pty Ltd": [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
  ],
  "Bristol-Myers Squibb": [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
  ],
  "Johnson & Johnson Pty Ltd": [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
    { tag: PolicyInterestTag.PrivateHealthCare, role: AttributionRole.partial },
  ],
  "Johnson & Johnson": [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
    { tag: PolicyInterestTag.PrivateHealthCare, role: AttributionRole.partial },
  ],
  "Roche Products Pty Ltd": [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
  ],
  Roche: [{ tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core }],
  "Pfizer Australia Pty Ltd": [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
  ],
  Pfizer: [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
  ],
  "Organon Pharma Pty Ltd": [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
  ],
  Organon: [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
  ],
  "Medtronic Australasia Pty Ltd": [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
    { tag: PolicyInterestTag.PrivateHealthCare, role: AttributionRole.partial },
  ],
  Medtronic: [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
    { tag: PolicyInterestTag.PrivateHealthCare, role: AttributionRole.partial },
  ],
  "Pathology Australia Ltd": [
    { tag: PolicyInterestTag.PrivateHealthCare, role: AttributionRole.core },
  ],
  "Idameneo (No.789) Ltd": [
    { tag: PolicyInterestTag.PrivateHealthCare, role: AttributionRole.core },
  ],
  "Tech Council of Australia": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
  ],
  "Tata Consultancy Services": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
  ],
  "Singtel Optus Pty Ltd": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
  ],
  "SingTel Optus Pty Ltd": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
  ],
  Optus: [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
  ],
  "MACQUARIE TECHNOLOGY GROUP LTD": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
  ],
  "Amazon Commercial Services Pty Ltd": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.partial },
  ],
  Amazon: [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.partial },
  ],
  "Cannon-Brookes, Michael": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.RenewablesCleantech,
      role: AttributionRole.partial,
    },
  ],
  "Farquhar, Scott": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.RenewablesCleantech,
      role: AttributionRole.partial,
    },
  ],
  "Obrecht, Clifford James": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
  ],
  "Wood, Graeme": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Network Ten Pty Ltd": [
    { tag: PolicyInterestTag.MediaBroadcasting, role: AttributionRole.core },
  ],
  "Network 10": [
    { tag: PolicyInterestTag.MediaBroadcasting, role: AttributionRole.core },
  ],
  "Australian Capital Equity Pty Ltd": [
    { tag: PolicyInterestTag.MediaBroadcasting, role: AttributionRole.core },
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.partial },
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.partial },
  ],
  "Mitchell, Harold": [
    { tag: PolicyInterestTag.MediaBroadcasting, role: AttributionRole.core },
  ],
  "Wall OAM, Pamela": [
    { tag: PolicyInterestTag.DefenseAerospace, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.partial,
    },
  ],
  "Wall AM, Ian": [
    { tag: PolicyInterestTag.DefenseAerospace, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.partial,
    },
  ],
  "Crouch, Michael": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "The Michael Crouch Foundation": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Schaffer Corporation Ltd": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.partial,
    },
  ],
  "The Pratt Foundation": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Medicines Australia Ltd": [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
  ],
  "Medicines Australia": [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
  ],
  "CSL Ltd": [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
  ],
  "CSL Limited": [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
  ],
  CSL: [{ tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core }],
  "The Pharmacy Guild of Australia": [
    { tag: PolicyInterestTag.PrivateHealthCare, role: AttributionRole.core },
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.partial },
  ],
  "Pharmacy Guild of Australia": [
    { tag: PolicyInterestTag.PrivateHealthCare, role: AttributionRole.core },
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.partial },
  ],
  "Paul Ramsay Holdings Pty Ltd": [
    { tag: PolicyInterestTag.PrivateHealthCare, role: AttributionRole.core },
  ],
  "Ramsay Health Care Ltd": [
    { tag: PolicyInterestTag.PrivateHealthCare, role: AttributionRole.core },
  ],
  "Ramsay Health Care": [
    { tag: PolicyInterestTag.PrivateHealthCare, role: AttributionRole.core },
  ],
  "Telstra Corporation": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
  ],
  "Telstra Corporation Ltd": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
  ],
  "Telstra Group Ltd": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
  ],
  Telstra: [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
  ],
  "Atlassian Pty Ltd": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
  ],
  Atlassian: [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
  ],
  "Nine Entertainment Co. Holdings Ltd": [
    { tag: PolicyInterestTag.MediaBroadcasting, role: AttributionRole.core },
  ],
  "Nine Entertainment": [
    { tag: PolicyInterestTag.MediaBroadcasting, role: AttributionRole.core },
  ],
  "Seven West Media Ltd": [
    { tag: PolicyInterestTag.MediaBroadcasting, role: AttributionRole.core },
  ],
  "Seven West Media": [
    { tag: PolicyInterestTag.MediaBroadcasting, role: AttributionRole.core },
  ],
  "Thales Australia Ltd": [
    { tag: PolicyInterestTag.DefenseAerospace, role: AttributionRole.core },
  ],
  "Thales Australia": [
    { tag: PolicyInterestTag.DefenseAerospace, role: AttributionRole.core },
  ],
  "Nioa Nominees PTY LTD ATF Bill Nioa Family Trust": [
    { tag: PolicyInterestTag.DefenseAerospace, role: AttributionRole.core },
  ],
  "Nioa, Elizabeth": [
    { tag: PolicyInterestTag.DefenseAerospace, role: AttributionRole.core },
  ],
  Nioa: [
    { tag: PolicyInterestTag.DefenseAerospace, role: AttributionRole.core },
  ],
  "Pratt Holdings Pty Ltd": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Visy Industries": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Visy Board Pty Ltd": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  Visy: [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "BlueScope Steel Ltd": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.partial },
  ],

  // ==========================================
  // Domain 6: Labor & Advocacy
  // ==========================================
  "Construction, Forestry, Maritime, Mining & Energy Union (CFMEU)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  CFMEU: [{ tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core }],
  "Shop, Distributive and Allied Employees Association (SDA)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  SDA: [{ tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core }],
  "Australian Workers Union (AWU)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  "Australian Workers' Union (AWU)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  AWU: [{ tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core }],
  "Electrical Trades Union of Australia (ETU)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  "Electrical Trades Union of Australia - Victorian Branch": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  ETU: [{ tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core }],
  "Communications, Electrical and Plumbing Union (CEPU)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  "Communications, Electrical and Plumbing Union - Electrical, Energy and Services Division":
    [{ tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core }],
  CEPU: [{ tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core }],
  "Health and Community Services Union (HSU)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  "Health Services Union (HSU)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  HSU: [{ tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core }],
  "Cormack Foundation Pty Ltd": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Cormack Foundation": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Chifley Research Centre": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Climate 200 Pty Ltd": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.RenewablesCleantech,
      role: AttributionRole.partial,
    },
  ],
  "Climate 200": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.RenewablesCleantech,
      role: AttributionRole.partial,
    },
  ],
  "Advance Aus Ltd": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  ADVANCE: [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Australian Services Union (ASU)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  ASU: [{ tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core }],
  "Transport Workers Union of Australia (TWU)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  "Transport Workers' Union of Australia (TWU)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  TWU: [{ tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core }],
  "Australian Education Union (AEU)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  AEU: [{ tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core }],
  "Australian Manufacturing Workers Union (AMWU)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  AMWU: [{ tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core }],
  "Community and Public Sector Union (CPSU)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  CPSU: [{ tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core }],
  "United Workers Union (UWU)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  UWU: [{ tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core }],
  "National Tertiary Education Union (NTEU)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  NTEU: [{ tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core }],
  "Independent Education Union of Australia (IEU)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  IEU: [{ tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core }],
  "Australasian Meat Industry Employees Union (AMIEU)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  AMIEU: [{ tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core }],
  "National Union of Workers (NUW)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  NUW: [{ tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core }],
  "United Voice": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  "Maritime Union of Australia (MUA)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  MUA: [{ tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core }],
  "Australian Nursing and Midwifery Federation (ANMF)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  ANMF: [{ tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core }],
  "Australian Rail Tram and Bus Industry Union (RTBU)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  RTBU: [{ tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core }],
  "Finance Sector Union (FSU)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  FSU: [{ tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core }],
  "Communication Workers Union of Australia (CEPU)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  "Public Service Association (PSA)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  PSA: [{ tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core }],
  "United Firefighters Union of Australia (UFUA)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  UFUA: [{ tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core }],
  "Mining and Energy Union (MEU)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  MEU: [{ tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core }],
  "Queensland Council of Unions (QCU)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  QCU: [{ tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core }],
  "Victorian Trades Hall Council": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  "Progressive Left Unions and Subbranches (PLUS)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "First Australians Capital Ltd": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Keep Them Honest Pty Ltd": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Trimtab Foundation Pty Ltd": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "LB Conservation Pty Ltd ATF LB Conservation Trust": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Fairground Investments Pty Ltd ATF Fairground Trust": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.RenewablesCleantech,
      role: AttributionRole.partial,
    },
  ],
  "Holmes a Court, Simon": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.RenewablesCleantech,
      role: AttributionRole.partial,
    },
  ],
  "LET Australia Ltd": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Sporting Shooters Association of Australia (Queensland) Inc": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Shooters Union Qld Pty Ltd": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Day, Bob": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.partial,
    },
  ],
  "Malcolm Turnbull": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Palmer, Clive Frederick": [
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
};
