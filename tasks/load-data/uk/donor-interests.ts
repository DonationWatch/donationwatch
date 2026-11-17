import type { DonorInterestAttribution } from "@/types/interests";

import { AttributionRole, PolicyInterestTag } from "@/types/interests";

/**
 * Curated mapping of major United Kingdom political donors (trade unions,
 * corporations, financial/investment firms, property developers, and political
 * advocacy groups) to standardized international PolicyInterestTags.
 *
 * Public parliamentary/electoral funding bodies (House of Commons, House of Lords,
 * Electoral Commission, Scottish Parliament, Northern Ireland Assembly) are
 * intentionally excluded so they remain separate from private sector interests.
 */
export const UK_DONOR_INTERESTS_BY_NAME: Record<
  string,
  DonorInterestAttribution[]
> = {
  // ==========================================
  // Domain 1: Energy & Resources
  // ==========================================
  "Ian Roper Taylor": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
  ],
  "Alasdair J D Locke": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
  ],
  "Sir Michael L Davis": [
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
  ],
  "Lord Michael S Farmer": [
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "Michael S Farmer": [
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "Ecotricity Ltd": [
    { tag: PolicyInterestTag.RenewablesCleantech, role: AttributionRole.core },
  ],
  "Dale Vince": [
    { tag: PolicyInterestTag.RenewablesCleantech, role: AttributionRole.core },
  ],

  // ==========================================
  // Domain 2: Built Environment
  // ==========================================
  "Countywide Developments Ltd": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "J.S. Bloor (Services) Ltd": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.partial,
    },
  ],
  "Bridgemere UK PLC": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.partial,
    },
  ],
  "Highstone Group Ltd": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Jersey House (Developments) Ltd": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Nicholas A C Candy": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "WESTCOMBE DEVELOPMENTS Ltd": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "WESTCOMBE HOMES Ltd": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Graham H Edwards": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Richard D Harpin": [
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "David Ord Ltd": [
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.partial,
    },
  ],
  "Brian Souter": [
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.core },
  ],
  "John Griffin": [
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.core },
  ],
  "HEATHROW AIRPORT HOLDINGS Ltd": [
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.core },
  ],
  "Heathrow Airport Ltd": [
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.core },
  ],

  // ==========================================
  // Domain 3: Finance & Advisory
  // ==========================================
  "Lord James Roger Lupton": [
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "Malik Karim": [
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.partial,
    },
  ],
  "IPGL Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.partial },
  ],
  "Quadrature Capital Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Martin Taylor": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Andrew E Law": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "David Rowland": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.partial },
  ],
  "Sir Michael Hintze": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "John C Armitage": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Christopher Rokos": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Alan Eldad Howard": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "David W Harding": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Yan Huo": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Lord Stanley Fink": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Oluwole O Kolade": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Nigel Doughty": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Brompton Capital Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Growth Financial Services Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Flowidea Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Rock Services Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Peter Wood": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Access Industries (UK) Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
    { tag: PolicyInterestTag.MediaBroadcasting, role: AttributionRole.partial },
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.partial },
  ],
  "Jeremy J Hosking": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.partial,
    },
  ],
  "PricewaterhouseCoopers Ltd (PwC)": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "Huntswood Associates Ltd": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "Ben Peter Delo": [
    { tag: PolicyInterestTag.CryptoFintech, role: AttributionRole.core },
  ],
  "Christopher Harborne": [
    { tag: PolicyInterestTag.CryptoFintech, role: AttributionRole.core },
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.partial },
  ],
  "Peter Andrew Cruddas": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
    { tag: PolicyInterestTag.CryptoFintech, role: AttributionRole.partial },
  ],

  // ==========================================
  // Domain 4: Regulated Consumer
  // ==========================================
  "Derek Webb": [
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.core },
  ],
  "Lord David Sainsbury": [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
  ],
  "Lord John Sainsbury": [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
  ],
  "Co-operative Group Ltd": [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
  ],
  "The Co-operative Group Ltd": [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
  ],
  "Central England Co-operative": [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
  ],
  "Sun Mark Ltd": [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
  ],
  "Ministry of Sound Ltd": [
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
    { tag: PolicyInterestTag.MediaBroadcasting, role: AttributionRole.partial },
  ],
  "Michael D Gooley": [
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
  ],
  "John E Gore": [
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
    { tag: PolicyInterestTag.MediaBroadcasting, role: AttributionRole.partial },
  ],
  "Flamingo Land": [
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
  ],
  "Gordon Stewart Gibb": [
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
  ],

  // ==========================================
  // Domain 5: Health, Tech & Industry
  // ==========================================
  "Ferring Pharmaceuticals Ltd": [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
  ],
  "THE PHOENIX PARTNERSHIP (LEEDS) LTD": [
    { tag: PolicyInterestTag.PrivateHealthCare, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.TechTelecomPlatforms,
      role: AttributionRole.partial,
    },
  ],
  "Francis X Hester": [
    { tag: PolicyInterestTag.PrivateHealthCare, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.TechTelecomPlatforms,
      role: AttributionRole.partial,
    },
  ],
  "Lycamobile UK Ltd": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
  ],
  "Jeremy Elliott San": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
  ],
  "David P Ross": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "Northern & Shell Media Group Ltd": [
    { tag: PolicyInterestTag.MediaBroadcasting, role: AttributionRole.core },
  ],
  "Ehud Sheleg": [
    { tag: PolicyInterestTag.MediaBroadcasting, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "JC Bamford Excavators Ltd": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.partial,
    },
  ],
  "JCB Research": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.partial,
    },
  ],
  "J.C.B. Services": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.partial,
    },
  ],
  "Mark J C Bamford": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.partial,
    },
  ],
  "Gary Lubner": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Mohamed Younes Mansour Lotfy Mansour": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "Malcolm S Healey": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.partial },
  ],
  "Amit Lohia": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "John Mills": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Christopher John Rea": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Lakshmi Mittal": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.partial },
  ],

  // ==========================================
  // Domain 6: Labor & Advocacy
  // ==========================================
  "Unite the Union": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  UNISON: [{ tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core }],
  GMB: [{ tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core }],
  "Union of Shop, Distributive and Allied Workers (USDAW)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  "Communication Workers Union (CWU)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  "Communication Workers Union": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  "Community (trade union)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  "Union of Construction, Allied Trades and Technicians (UCATT)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  "Transport Salaried Staffs' Association (TSSA)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  "Associated Society of Locomotive Engineers and Firemen (ASLEF)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  "Fire Brigades Union (FBU)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  "National Conservative Draws Society": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Joseph Rowntree Reform Trust Ltd": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Labour Together Ltd": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Corporate Policy Unit": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "The Spring Lunch": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Scottish Unionist Association Trust": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Christine Weir": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Colin Weir": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],

  // ==========================================
  // Expanded Coverage (Energy, Built Env, Finance, Consumer, Health/Tech/Industry, Labor/Advocacy)
  // ==========================================

  // Energy & Resources
  "Ayman Asfari": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
  ],
  "Alexander Temerko": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.RenewablesCleantech,
      role: AttributionRole.partial,
    },
  ],

  // Built Environment
  "CC Property Company Ltd": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Broadland Properties Ltd": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Thakeham Homes Ltd": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.partial,
    },
  ],
  "I M Properties Plc": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Canary Wharf Group PLC": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Leopold Noe": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Andrew Rosenfeld": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Sir David Garrard": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Edwin D Healey": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Michael I Freeman": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "David J Rowland": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "Lord David E D Brownlow": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "James Adam Reuben": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "Matthew A Oakeshott": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "Roger G Orf": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "Javad Marandi": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.FoodSupermarkets,
      role: AttributionRole.partial,
    },
  ],
  "William Haughey": [
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.core,
    },
  ],
  "Unatrac Ltd": [
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.partial,
    },
  ],
  "Lord Michael D Glendonbrook": [
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.core },
  ],
  "Michael Bishop": [
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.core },
  ],

  // Finance & Advisory
  "Bloomberg Tradebook Europe Ltd": [
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.MediaBroadcasting,
      role: AttributionRole.partial,
    },
    {
      tag: PolicyInterestTag.TechTelecomPlatforms,
      role: AttributionRole.partial,
    },
  ],
  "Alexander A Fraser": [
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "Howard Paul Shore": [
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "Britannia Financial Group Ltd": [
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "William H Salomon": [
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "David L Mayhew": [
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.core },
  ],
  "Roger Nagioff": [
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "Peter Cruddas": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
    { tag: PolicyInterestTag.CryptoFintech, role: AttributionRole.partial },
  ],
  "Dr Peter Andrew Cruddas": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
    { tag: PolicyInterestTag.CryptoFintech, role: AttributionRole.partial },
  ],
  "Peter K Hargreaves": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Investors in Private Capital Ltd": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Lubov Chernukhin": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Jonathan Wood": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "David Tilles": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Paul A Beecroft": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Stuart Roden": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Stanley Fink": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Mark Coombs": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "John A S Nash": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Paul M Ruddock": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Lord Michael Anthony Ashcroft": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.partial,
    },
  ],
  "Stuart Wheeler": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.partial,
    },
  ],
  "ADAM MANAGEMENT HOLDINGS LTD": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
    { tag: PolicyInterestTag.CryptoFintech, role: AttributionRole.partial },
    {
      tag: PolicyInterestTag.PropertyDevelopment,
      role: AttributionRole.partial,
    },
  ],
  "Sudhir Choudhrie": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
    { tag: PolicyInterestTag.PrivateHealthCare, role: AttributionRole.partial },
  ],
  "Henry Keswick": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.PropertyDevelopment,
      role: AttributionRole.partial,
    },
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.partial },
  ],
  "KPMG LLP": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],

  // Regulated Consumer
  "Derek J Webb": [
    { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.core },
  ],
  "Midcounties Co-operative Ltd": [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
  ],
  "Bestway Wholesale Ltd": [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
  ],
  "Bestway Cash & Carry Ltd": [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
  ],
  "Michael Lewis": [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.PropertyDevelopment,
      role: AttributionRole.partial,
    },
  ],
  "Richard Caring": [
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
  ],
  "Trailfinders Ltd": [
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
  ],
  "Dinesh Dhamija": [
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.TechTelecomPlatforms,
      role: AttributionRole.partial,
    },
  ],

  // Health, Tech & Industry
  "David John Grainger": [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "Professor Christopher Barry Wood": [
    { tag: PolicyInterestTag.PrivateHealthCare, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.TechTelecomPlatforms,
      role: AttributionRole.partial,
    },
  ],
  "Professor Christopher Wood": [
    { tag: PolicyInterestTag.PrivateHealthCare, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.TechTelecomPlatforms,
      role: AttributionRole.partial,
    },
  ],
  "Justinian J Ash": [
    { tag: PolicyInterestTag.PrivateHealthCare, role: AttributionRole.core },
  ],
  "Bassim Haidar": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
    { tag: PolicyInterestTag.CryptoFintech, role: AttributionRole.partial },
  ],
  "Rocktel Services Ltd": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
  ],
  "John Gore": [
    { tag: PolicyInterestTag.MediaBroadcasting, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.HospitalityTourism,
      role: AttributionRole.partial,
    },
  ],
  "International Motors Ltd": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.PropertyDevelopment,
      role: AttributionRole.partial,
    },
  ],
  "IM Group Ltd": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.PropertyDevelopment,
      role: AttributionRole.partial,
    },
  ],
  "JCB Sales Ltd": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.partial,
    },
  ],
  "Peak Scientific Holdings Ltd": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Christopher J Rea": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Balmoral Group Holdings Ltd": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.partial },
  ],
  "Allamhouse Ltd": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "Lord David Alliance": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],

  // Labor & Advocacy
  "Musicians' Union (MU)": [
    { tag: PolicyInterestTag.TradeUnions, role: AttributionRole.core },
  ],
  "Leave Means Leave Ltd": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Britain Means Business Ltd": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Association of Conservative Clubs": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Methuen Liberal Trust Fund": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "United & Cecil Club": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Co-operative Party": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "HEREFORD AND COUNTY LIBERAL CLUB COMPANY Ltd": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Manchester Labour Group": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Barnes and Richmond Labour Club and Institute": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Carlton Club Political Committee": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "MOU Operations Ltd": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Francesca Perrin": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Fiona Mactaggart": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
};
