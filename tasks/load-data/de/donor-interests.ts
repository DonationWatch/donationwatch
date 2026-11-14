import type { DonorInterestAttribution } from "@/types/interests";

import { AttributionRole, PolicyInterestTag } from "@/types/interests";

/**
 * Curated mapping of major German political donors (corporations, employer/industry
 * associations, financial/investment vehicles, and civic/political advocacy groups)
 * to standardized international PolicyInterestTags.
 */
export const GERMAN_DONOR_INTERESTS_BY_NAME: Record<
  string,
  DonorInterestAttribution[]
> = {
  // ==========================================
  // Domain 1: Energy & Resources
  // ==========================================
  "Johannes Schuetze Energy Import AG": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
    { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.partial },
  ],
  "Johannes Schuetze Holding AG": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
  ],
  "UNITI Kraftstoff GmbH": [
    { tag: PolicyInterestTag.FossilFuels, role: AttributionRole.core },
  ],
  "Deutsche Windtechnik AG": [
    { tag: PolicyInterestTag.RenewablesCleantech, role: AttributionRole.core },
  ],
  "Viessmann Generations Group GmbH+Co.KG": [
    { tag: PolicyInterestTag.RenewablesCleantech, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.partial,
    },
  ],
  "Frank Asbeck": [
    { tag: PolicyInterestTag.RenewablesCleantech, role: AttributionRole.core },
  ],
  "Weiland Stallbau GmbH & Co. KG": [
    { tag: PolicyInterestTag.AgricultureForestry, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.partial,
    },
  ],
  "Pollmeier Massivholz GmbH & Co. KG": [
    { tag: PolicyInterestTag.AgricultureForestry, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.partial,
    },
  ],
  "Ralf Pollmeier": [
    { tag: PolicyInterestTag.AgricultureForestry, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.partial,
    },
  ],

  // ==========================================
  // Domain 2: Built Environment
  // ==========================================
  "Christoph Alexander Kahl": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "Gröner Family Office GmbH": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Christoph Gröner": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Klaus Groth": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Mähren AG": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Bauwert AG": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "ANH Hausbesitz GmbH & Co KG": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "VHB Grundstücksverwaltung und Beteiligung GmbH & Co. KG": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "SPG & Co. Berlin Projektentwicklungsgesellschaft mbH": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "Bode Immobilien GmbH + Co. KG": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
  ],
  "neoshare Holding GmbH": [
    { tag: PolicyInterestTag.PropertyDevelopment, role: AttributionRole.core },
    { tag: PolicyInterestTag.CryptoFintech, role: AttributionRole.partial },
  ],
  "Martin Herrenknecht": [
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.partial,
    },
  ],
  "Carl Rudolf Thies Knauf": [
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.partial,
    },
  ],
  "Nikolaus Knauf": [
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.partial,
    },
  ],
  "Dietmar Bücher": [
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.PropertyDevelopment,
      role: AttributionRole.partial,
    },
  ],
  "Dietmar Bücher Schlüsselfertiges Bauen": [
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.PropertyDevelopment,
      role: AttributionRole.partial,
    },
  ],
  "Hagedorn Management GmbH": [
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.core,
    },
  ],
  "Thomas Hagedorn Holding GmbH": [
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.core,
    },
  ],
  "HC Hagemann GmbH & Co. KG": [
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.core,
    },
  ],
  "Amand Beteiligungs GmbH & Co.KG": [
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.core,
    },
  ],
  "Max Aicher": [
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.partial,
    },
  ],
  "Sixt GmbH & Co. Autovermietung KG": [
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.TechTelecomPlatforms,
      role: AttributionRole.partial,
    },
  ],
  "Klaus-Michael Kühne": [
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.core },
  ],
  "GLS Germany GmbH + Co OHG": [
    { tag: PolicyInterestTag.AviationTransport, role: AttributionRole.core },
  ],

  // ==========================================
  // Domain 3: Finance & Advisory
  // ==========================================
  "Berenberg Bank": [
    { tag: PolicyInterestTag.BankingLending, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "Deutsche Vermögensberatung AG": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Allianz SE": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Flossbach von Storch AG": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Dr. Bert Flossbach": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Kurt von Storch": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Jochen Wermuth": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.RenewablesCleantech,
      role: AttributionRole.partial,
    },
  ],
  "Aquila Capital Holding GmbH": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.RenewablesCleantech,
      role: AttributionRole.partial,
    },
  ],
  "Droege Group AG": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.partial,
    },
  ],
  "R&W Industriebeteiligungen GmbH": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.partial,
    },
  ],
  "Athos KG": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.partial },
  ],
  "Dr. Klaus Hommels": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.TechTelecomPlatforms,
      role: AttributionRole.partial,
    },
  ],
  "Johannes Peter Huth": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "FKH Beteiligungs SE": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Themis Beteiligungs AG": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "STS Beteiligungs GmbH": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "SolWo Holding GmbH": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Peter Jungen Holding GmbH": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Göpel Vermögensverwaltung": [
    { tag: PolicyInterestTag.WealthSuperInsurance, role: AttributionRole.core },
  ],
  "Christ&Company Consulting GmbH": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "Harald Christ": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "Carsten Berrar": [
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.core,
    },
  ],
  "Bitpanda GmbH": [
    { tag: PolicyInterestTag.CryptoFintech, role: AttributionRole.core },
  ],
  "Jutta Steiner": [
    { tag: PolicyInterestTag.CryptoFintech, role: AttributionRole.core },
  ],
  "Moritz Schmidt": [
    { tag: PolicyInterestTag.CryptoFintech, role: AttributionRole.core },
  ],

  // ==========================================
  // Domain 4: Regulated Consumer
  // ==========================================
  "Dr. Arend Oetker": [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
    { tag: PolicyInterestTag.AlcoholBeverages, role: AttributionRole.partial },
  ],
  "Dr. August Oetker KG": [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
    { tag: PolicyInterestTag.AlcoholBeverages, role: AttributionRole.partial },
  ],
  "Geschwister Oetker Beteiligungen KG": [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
    { tag: PolicyInterestTag.AlcoholBeverages, role: AttributionRole.partial },
  ],
  "August Storck KG": [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
  ],
  "Heristo AG": [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
  ],
  "Global Foods Trading GmbH": [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
  ],
  "Sachsenmilch Anlagen Holding GmbH": [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
  ],
  "Saalemühle Alsleben GmbH": [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.AgricultureForestry,
      role: AttributionRole.partial,
    },
  ],
  "TEDI GMBH & Co. KG": [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
  ],
  "Woolworth GmbH": [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
  ],
  "Torsten Toeller": [
    { tag: PolicyInterestTag.FoodSupermarkets, role: AttributionRole.core },
  ],
  "Prof. Dr. Max Schlereth c/o Hotel „Das Viktualienmarkt“": [
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.PropertyDevelopment,
      role: AttributionRole.partial,
    },
  ],
  "HRS GmbH": [
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.TechTelecomPlatforms,
      role: AttributionRole.partial,
    },
  ],
  "Michels Hotels Norderney-Sylt GmbH & Co.KG": [
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
    { tag: PolicyInterestTag.PrivateHealthCare, role: AttributionRole.partial },
  ],
  "COMERON Hotel Einkaufs- und Beratungsgesellschaft mbH": [
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
  ],
  "Johannes Reck c/o GetYourGuide": [
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.TechTelecomPlatforms,
      role: AttributionRole.partial,
    },
  ],
  "Tao Tao c/o GetYourGuide": [
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.TechTelecomPlatforms,
      role: AttributionRole.partial,
    },
  ],
  "Klaus Laepple": [
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
  ],
  "MMI Leisure & Capital Management GmbH": [
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "Ingo Horst Wilhelm Hillen": [
    { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],

  // ==========================================
  // Domain 5: Health, Tech & Industry
  // ==========================================
  "Prof. Dr. Hans-Joachim Langmann": [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
  ],
  "Patrick Anton Walther Schwarz-Schütte": [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "Dr. Theiss Naturwaren GmbH": [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
  ],
  "Prof. Dr. Winfried Alexander Stöcker": [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
    { tag: PolicyInterestTag.PrivateHealthCare, role: AttributionRole.partial },
  ],
  "Futrue GmbH": [
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.core },
  ],
  "Dr. Lutz Helmig": [
    { tag: PolicyInterestTag.PrivateHealthCare, role: AttributionRole.core },
  ],
  "Schön Klinik SE": [
    { tag: PolicyInterestTag.PrivateHealthCare, role: AttributionRole.core },
  ],
  "Bavaria Klinik Freyung Verwaltungs- und Beteiligungsgesellschaft mbH": [
    { tag: PolicyInterestTag.PrivateHealthCare, role: AttributionRole.core },
  ],
  "Ulrich Horst Marseille": [
    { tag: PolicyInterestTag.PrivateHealthCare, role: AttributionRole.core },
  ],
  "Prof. Hans Georg Näder": [
    { tag: PolicyInterestTag.PrivateHealthCare, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.partial,
    },
  ],
  "Stephan Schambach": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
  ],
  "Thomas Stanger": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
  ],
  "Ralph Dommermuth": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
  ],
  "Steven Schuurman": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
  ],
  "Frank Gotthardt c/o GT3 Software und Beteiligung GmbH": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
    { tag: PolicyInterestTag.PrivateHealthCare, role: AttributionRole.partial },
  ],
  "Dr. Brigitte Gotthardt c/o GT3 Software und Beteiligung GmbH": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
    { tag: PolicyInterestTag.PrivateHealthCare, role: AttributionRole.partial },
  ],
  "Georg Nemetschek": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.partial,
    },
  ],
  "Prof. Georg Nemetschek": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.ConstructionInfrastructure,
      role: AttributionRole.partial,
    },
  ],
  "Hanno Renner": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
  ],
  "Verena Pausder": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
  ],
  "ESC Ingenieursgesellschaft für Softwareentwicklung mbH": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
  ],
  "agido GmbH": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
  ],
  "REUTAX AG": [
    { tag: PolicyInterestTag.TechTelecomPlatforms, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.ConsultingAccountingLegal,
      role: AttributionRole.partial,
    },
  ],
  "Dr. Georg Jakob Kofler": [
    { tag: PolicyInterestTag.MediaBroadcasting, role: AttributionRole.core },
    {
      tag: PolicyInterestTag.TechTelecomPlatforms,
      role: AttributionRole.partial,
    },
  ],
  "Media Force GmbH": [
    { tag: PolicyInterestTag.MediaBroadcasting, role: AttributionRole.core },
  ],
  "Klartext GmbH Grafik Messe Event": [
    { tag: PolicyInterestTag.MediaBroadcasting, role: AttributionRole.core },
  ],
  "vbm - Verband der Bayerischen Metall- und Elektro-Industrie e.V.": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Südwestmetall – Verband der Metall- und Elektroindustrie Baden-Württemberg e.V.":
    [
      {
        tag: PolicyInterestTag.ManufacturingAutomotive,
        role: AttributionRole.core,
      },
    ],
  "METALL NRW - Verband der Metall- und Elektro-Industrie Nordrhein-Westfalen e.V.":
    [
      {
        tag: PolicyInterestTag.ManufacturingAutomotive,
        role: AttributionRole.core,
      },
    ],
  "Verband der Metall- und Elektro-­Industrie Nordrhein-Westfalen e.V.": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  Gesamtmetall: [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Märkischer Arbeitgeberverband e.V.": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Daimler AG": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Bayerische Motoren Werke AG": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Stefan Quandt": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Susanne Klatten": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Johanna Quandt": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Gabriele Quandt": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Daniela Porsche": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Evonik Industries AG": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "VCI - Verband der Chemischen Industrie e.V.": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
    { tag: PolicyInterestTag.PharmaBiotech, role: AttributionRole.partial },
  ],
  "TRUMPF SE + Co. KG": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Andreas Lapp": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Philip Harting": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Philip Harting Familienstiftung": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "VÖLKEL GmbH": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Coroplast Fritz Müller": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Adolf Würth GmbH & Co. KG": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Firma Marquardt GmbH": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "ProMinent GmbH": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Hans-Peter Stihl": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Dieter Albert Richard Morszeck": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Verband der Nordwestdeutschen Textil- und Bekleidungsindustrie e.V.": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Arnd Franz": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Ulrich Humbaur": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Martin Alexander Walter Schoeller": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Vakuum-Härtetechnik Schwer GmbH & Co. KG": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Bugovics Industries GmbH": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Gerhard Dingler": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Dr. Wolfgang Reitzle": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
  ],
  "Kajo Neukirchen GmbH": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],
  "Dr. Ralph Neukirchen": [
    {
      tag: PolicyInterestTag.ManufacturingAutomotive,
      role: AttributionRole.core,
    },
    {
      tag: PolicyInterestTag.WealthSuperInsurance,
      role: AttributionRole.partial,
    },
  ],

  // ==========================================
  // Domain 6: Labor & Advocacy
  // ==========================================
  "Sydslesvigudvalget/ Kulturministeriet, Kulturstyrelsen": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "BSW - Für Vernunft und Gerechtigkeit e.V.": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Campact e.V.": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "WerteUnion Förderverein e.V.": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Verein zur Pflege nationaler Politik e.V.": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Verein Wirtschaft für Demokratie e.V. i.G.": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "JoinPolitics Fund I GmbH Co. KG": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Dr. Jürgen Todenhöfer": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Dr. Gerhard Frey": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
    { tag: PolicyInterestTag.MediaBroadcasting, role: AttributionRole.partial },
  ],
  "Christian Lindner": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Hubert Aiwanger": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
  "Martin Horn": [
    {
      tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
      role: AttributionRole.core,
    },
  ],
};
