import { DonorType } from "../utils/types";

const No = {
  copyright: "Opphavsrett",
  charts_license: "Diagrammer lisensiert {license} med kreditering",
  data_error: "Feil ved lasting av data",
  description:
    "DonationWatch gir tydelig innsikt i givere og partier, og gjør det enklere å forstå politisk finansiering ved å forklare komplekse data på en enkel måte",
  title: "Partidonasjoner {country}",
  sum: "Sum",
  donation_count: "Antall donasjoner",
  average: "Gjennomsnitt",
  donations_by_party: "Donasjoner per parti",
  donations_per_year: "Donasjoner per år",
  party_donations: "Partidonasjoner",
  more: "Mer",
  loading: "Innhold lastes",
  data_since: "Siden {year}",
  view_party: "Vis partisiden for {party}",
  faq: "Ofte stilte spørsmål",
  sidebar: {
    toggle: "Vis/skjul sidepanel",
    donations: "Donasjoner",
    all_countries: "Alle land",
    tools: "Verktøy",
    show_all: "Vis alle ({num})",
    show_less: "Vis færre",
  },
  search: {
    filter: "Søk...",
    filter_description: "Søk etter partier, år eller givere",
    parties: "Partier",
    years: "År",
    legislative_years: "Lovgivningsperioder",
    empty: "Ingen resultater",
    donors: "Givere",
  },
  page_title: {
    years: {
      description:
        "I {year} mottok {parties} partier i {country} totalt {sum} fra {count} donasjoner over {minAmount}. Utforsk detaljerte oppdelinger per parti og giver, samt trender i politisk finansiering.",
      overview:
        "Oversikt over politiske partidonasjoner i {country} for {year}",
      changes:
        "Siste endringer i politiske partidonasjoner i {country} for {year}",
      donors: "Toppgivere til politiske partier i {country} for {year}",
      timeline:
        "Tidslinje for politiske partidonasjoner i {country} for {year}",
      origin: "Geografisk oversikt over partidonasjoner i {country} for {year}",
    },
    party: {
      donors: "Toppgivere til {party} i {country}",
      changes: "Siste endringer i donasjoner til {party} i {country}",
      timeline: "Tidslinje for donasjoner til {party} i {country}",
      origin: "Geografisk oversikt over donasjoner til {party} i {country}",
      description:
        "Siden {year} har {party} mottatt totalt {count} donasjoner over {minimumAmount}, som til sammen utgjør {sum}. Utforsk detaljert informasjon om de største giverne og donasjonstrender til {party} i {country}.",
    },
    donor: {
      overview: "Donasjoner fra {donor} i {country}",
      description:
        "{donor} har donert totalt {sum} fordelt på {count} donasjoner over {minAmount} siden {minYear}. Bidragene ble fordelt på {parties} ulike partier. Utforsk detaljerte innsikter i donasjonsmønstre og mottakerpartier for denne giveren i {country}.",
    },
  },
  chart: {
    save_as_image: "Lagre som bilde",
    toggle_fullscreen: "Bytt fullskjerm",
    reset_zoom: "Tilbakestill zoom",
  },
  over_min_public_amount: "over {amount}",
  over_threshold: "kun partier ≥ {count} donasjoner eller ≥ {sum}",
  prelim_data: "foreløpige data siden {year}",
  excludes_year_only_donations: "utelater donasjoner med år som dato",
  common: {
    date: "Dato",
    party: "Parti",
    donor: "Giver",
    amount: "Beløp",
    anonymizedDonor: "Anonymisert donor",
    redactedDonor: "Sensurert giver",
  },
  sort: {
    asc: "Sorter stigende",
    desc: "Sorter synkende",
    clear: "Fjern sortering",
  },
  footer: {
    sources: "Kilder",
    build: "Per {date}",
    build_since: "Per {date}, siden {year}",
    published_by: "Som publisert av {source}",
  },
  header: {
    home: "Hjem",
    language_selection: "Språkvalg",
    country_selection: "Landvalg",
  },
  actions: {
    close: "Lukk",
    play: "Spill av",
    pause: "Pause",
    restart: "Start på nytt",
  },
  donor_dialog: {
    title: "Giverinformasjon",
    summary: "Sammendrag",
  },
  donation_dialog: {
    title: "Donasjonsdetaljer",
    donor: "Giver",
    country: "Land",
    state: "Delstat/region",
    receiver: "Mottaker",
    donation_amount: "Donasjonsbeløp",
    date: "Dato",
  },
  root: {
    title: "Åpen kildekode-sporer for donasjoner til politiske partier",
    subtitle:
      "Spor og utforsk politiske donasjoner på tvers av flere land. Forstå hvem som finansierer politiske partier og hvordan penger flyter globalt.",
    stats: {
      countries: "Land dekket",
      parties: "Politiske partier",
      donations: "Enkeltstående donasjoner",
      currencies: "Valutaer som spores",
    },
    countries: {
      title: "Utforsk politiske donasjoner etter land",
      subtitle:
        "Velg et land for å få tilgang til detaljerte donasjonsoppføringer, data om partifinansiering og informasjon om givere.",
    },
    why: {
      title: "Hvorfor åpenhet om politiske donasjoner er viktig",
      p0: "Demokrati er avhengig av informerte borgere. Ved å gjøre data om politiske donasjoner tilgjengelige og enkle å utforske, hjelper vi folk å forstå de økonomiske relasjonene som former deres politiske landskap. Åpenhet i politisk finansiering bygger tillit, styrker ansvarlighet og gjør velgere i stand til å ta informerte beslutninger.",
    },
    open_source: {
      title: "Åpen kildekode",
      p0: "DonationWatch er åpen kildekode. Du kan se gjennom koden, rapportere problemer eller bidra på {github}.",
    },
  },
  home: {
    most_recent: "Nyeste donasjoner",
    hero: {
      subtitle: "Sporing av politiske partidonasjoner for {country}",
      subtitle_no_country: "Sporing av politiske partidonasjoner",
    },
    biggest_donations: {
      text: "Siden {minYear} var den største offentliggjorte enkeltdonasjonen i {country} på {amount} fra {donor} til {party} i {year}. Dette etterfølges av {others}.",
      list: "{amount} fra {donor} til {receiver}",
    },
    last_period: "Siste år:",
    previous_period: "Donasjoner fra forrige år.",
    what: {
      title: "Hva er dette?",
      summary:
        "Partidonasjoner er en viktig del av politikken. De er en viktig indikator på politisk støtte.\n\nVi prøver å presentere disse dataene tydelig og forståelig.",
      threshold:
        "På grunn av det høye antallet små politiske partier sporer vi bare donasjoner for partier som oppfyller en bestemt terskel. Den nåværende terskelen er satt til {count} donasjoner eller totalt {sum} i bidrag til det partiet, uavhengig av størrelsen på enkeltbidragene.",
      source: {
        austria:
          "Dataene som brukes her kommer fra den østerrikske Riksrevisjonen (Austrian Court of Audit) og inkluderer alle partidonasjoner som er dokumentert der siden 2012.\n" +
          "\n" +
          "Merk: Før 8. juli 2019 måtte politiske partier rapportere enkeltbidrag over 51 000 euro (fram til 2018 over 50 000 euro) til ACA. Siden juli 2019 har rapporteringsgrensen vært 2 500 euro.\n" +
          "\n" +
          "Partienes data oppdateres normalt kvartalsvis.",
        germany:
          "Dataene som brukes her kommer fra den tyske Forbundsdagen (Bundestag) og inkluderer alle partidonasjoner over €50 000 dokumentert der siden 2010, samt over €35 000 siden 5. mars 2024.",
        switzerland:
          "Dataene som brukes her kommer fra det sveitsiske føderale finanskontrollorganet og inkluderer alle politiske donasjoner dokumentert der siden 2023.",
        netherlands:
          "Informasjonen som presenteres her er hentet fra Nederlands regjering og inkluderer alle politiske donasjoner registrert siden 2022 som overstiger €1 000, slik de er rapportert i den årlige «Overzicht van giften aan politieke partijen en hun neveninstellingen».\n" +
          "\n" +
          "For inneværende år er bare donasjoner som overstiger €10 000 inkludert, basert på datasettet «Overzicht substantiële giften aan politieke partijen».\n" +
          "\n" +
          "Merk: Noen donasjoner mangler spesifikk datoinformasjon og blir derfor ikke inkludert i tidsserier eller andre datobaserte visualiseringer.\n" +
          "\n" +
          "Donasjoner rapportert for SP og GL kan framstå relativt høye fordi begge partier krever at deres parlamentsmedlemmer og tillitsvalgte bidrar med en betydelig del av lønnen sin til partiet.",
        europeanunion:
          "Dataene som presenteres her er hentet fra Authority for European Political Parties and European Political Foundations, og omfatter alle dokumenterte donasjoner til partier og stiftelser siden 2018. På grunn av betydningen av europeiske politiske stiftelser sporer og viser vi deres donasjoner på samme måte som for europeiske politiske partier.\n" +
          "\n" +
          "Siden de offisielle dataene ikke inneholder datoinformasjon, finnes det ingen tidsserier eller tilsvarende visuelle framstillinger.\n" +
          "\n" +
          "Merk at i forkant av EU-valget i 2024 (fra 6. desember 2023 til 10. juni 2024) gjaldt særskilte rapporteringskrav for donasjoner, med ukentlige rapporter og rask publisering fra myndigheten.\n" +
          "Siden 10. juni 2024 må bare donasjoner over 12 000 euro rapporteres umiddelbart. Andre donasjoner blir først tilgjengelige etter at de årlige regnskapene er levert.",
        estonia:
          "Dataene som brukes her kommer fra Estlands komité for overvåking av partifinansiering og inkluderer alle politiske donasjoner dokumentert der siden 2014 som overstiger 1 euro.\n" +
          "\n" +
          "Politiske partier i Estland er pålagt å rapportere inntekter, inkludert mottatte donasjoner, kvartalsvis.\n" +
          "Dataene på komiteens nettside oppdateres tilsvarende kvartalsvis.",
        czechrepublic:
          "Dataene som brukes her kommer fra kontoret for kontroll av administrasjonen av politiske partier og politiske bevegelser, og inkluderer alle politiske donasjoner dokumentert der siden 2018 som overstiger 25 CZK.\n" +
          "\n" +
          "Dette omfanget inkluderer også alle bidrag til partier eller politiske bevegelser som enten har mottatt mer enn 100 enkeltbidrag eller har passert 1 million CZK i totale donasjonsbeløp, uavhengig av størrelsen på enkeltbidragene. Dataene oppdateres årlig.\n" +
          "Klassifisering av givertype er basert på at en giver identifiseres som en privatperson hvis både firstName- og lastName-feltene er til stede.",
        latvia:
          "Dataene som brukes her kommer fra kontoret for forebygging og bekjempelse av korrupsjon og inkluderer alle politiske donasjoner dokumentert der siden 2015, som overstiger €1.",
        australia:
          'Dataene som brukes her kommer fra Australian Electoral Commission (AEC), og spesielt fra datasettet "Donations Made Details" som AEC publiserer. Det inkluderer alle politiske donasjoner som er dokumentert der siden 2014, over €1.\n' +
          "\n" +
          "Det er verdt å merke seg at AEC-datasettet kan inneholde enkelte skrivefeil, noe som kan føre til at visse donasjoner ikke blir fanget opp eller ikke blir riktig knyttet til et bestemt parti på grunn av inkonsistens i dataregistreringen. I tillegg publiseres AECs årlige offentliggjøringer 1. februar hvert år, men dataene gir ikke et fullstendig bilde av alle bidrag på grunn av terskelen for offentliggjøring på $15,000.\n" +
          "\n" +
          "Donortyper klassifiseres ved å matche donornavn. Alle vanlige fagforeninger mappes manuelt til donortypen 'Fagforening'. Selskaper oppdages ved å sjekke etter spesifikke selskapsidentifikatorer i donornavnet: 'Pty' (Proprietary), 'Ltd' på slutten av navnet, 'Corporation' eller 'Corp'.",
        unitedkingdom:
          "Dataene som brukes her kommer fra Electoral Commission og inkluderer alle politiske donasjoner som er dokumentert der siden 2010 og som overstiger £1 000.\n" +
          "\n" +
          "Donasjonsdataene oppdateres kvartalsvis.",
        serbia:
          "Dataene som brukes her kommer ikke fra myndighetene, men fra den ideelle organisasjonen «Center for Investigative Journalism of Serbia» («Centar za istraživačko novinarstvo Srbije» – CINS), som har aggregert donasjonsdata fra Serbias antikorrupsjonsbyrå.\n" +
          "\n" +
          "Disse dataene inkluderer alle politiske donasjoner dokumentert der siden 2015.\n" +
          "\n" +
          "Siden datasettet ikke gir spesifikk datoinformasjon for enkeltbidrag, er det dessverre ikke mulig å vise tidslinjer eller andre tidsbaserte visualiseringer.",
        croatia:
          "Dataene som brukes her kommer fra Den statlige valgkommisjonen i Republikken Kroatia (DIP) og inkluderer alle politiske donasjoner med en pengeverdi som overstiger 1 €, dokumentert siden 2019.\nDatasettet bruker kun det sist publiserte donasjonsdokumentet for hvert rapporteringsår (slik det er oppgitt av izbori) for å unngå duplikater fra tidligere versjoner av rapporten for samme år.\nAlle donasjoner vises i euro, mens det underliggende datasettet bruker kuna fram til 2024. Donasjoner som opprinnelig er gitt i kuna, konverteres til euro ved hjelp av omtrentlige valutakurser for hvert halvår fra 2019 til 2024: H1 (0.1340, 0.1335, 0.1332, 0.1329, 0.1326) og H2 (0.1341, 0.1338, 0.1334, 0.1327, 0.1328).",
        canada:
          'Dataene som brukes her kommer fra Elections Canada og er basert på datasettet "contributions as submitted". Det inkluderer alle politiske donasjoner med pengeverdi over €500, dokumentert siden 2015. Alle oppføringer som inngår i rapporten "Statement of Contributions Received" fra valgtypen "Annual" til "Registered parties" er inkludert.',
        georgia:
          "Informasjonen som presenteres her er hentet fra Georgias antikorrupsjonsbyrå (ანტიკორუფციული ბიურო﻿) og inkluderer alle politiske donasjoner registrert siden 2011 som overstiger 1 GEL. Datasettet omfatter kun bidrag klassifisert som type #10 (monetære donasjoner) eller type #16 (monetære donasjoner fra juridiske personer).",
        norway:
          "Dataene som brukes her kommer fra de offisielle publikasjonene om partifinansiering fra Statistisk sentralbyrå (SSB) og Partifinansiering.no. Totalene som vises er aggregert fra flere rapporterte mottakerenheter (for eksempel sentrale, regionale, lokale og ungdomsenheter) til én samlet totalsum per parti, mens den underliggende mappingen av mottakere holdes tilgjengelig for åpenhet.\n\nNorgesdatasettet oppdateres årlig, i tråd med publiseringstakten for de underliggende opplysningene.",
      },
      source_link: "Datakilde",
    },
    list: {
      subtitle: "Lovgivningsperioder",
      title: "Tidligere lovgivningsperioder",
      summary:
        "Oversikten over lovgivningsperioder samler alle donasjoner gjennom hele en lovgivningsperiode. Klikk på et kort for å gå til den aktuelle perioden.",
    },
    years: {
      title: "Årlig oversikt over partidonasjoner",
      subtitle: "Aggregerte summer på tvers av år",
      more: "Vis alle resterende år",
      summary:
        "Utforsk vår årlige oversikt over partidonasjoner, som oppsummerer alle bidrag for hvert år. Klikk på et kort for å gå til den detaljerte årsvisningen.",
    },
    parties: {
      title: "Partidonasjoner",
      subtitle: "Detaljer om enkeltpartier",
      more: "Vis alle resterende partier",
      summary:
        "Utforsk vår oversikt over partidonasjoner, som aggregerer alle bidrag per parti. Klikk på et kort for å se donasjonsdetaljene.",
    },
    donors: {
      title: "Giverdonasjoner",
      subtitle: "Detaljer om enkeltgivere",
      summary:
        "Utforsk giveroversikten vår, som viser de mest betydelige økonomiske bidragsyterne siden {minYear}. Klikk på en giver for å se detaljert informasjon om bidragene.",
    },
    stacked_years: "Donasjonsbeløp per år",
    stacked_years_subtitle:
      "Aggregert sum av publiserte bidrag i {country}, per år fra {years}.",
  },
  years: {
    title: "Partidonasjoner",
    subtitle:
      "Akkumulert sum av publiserte donasjoner til hvert parti i {country}, {years}.",
    goto_year: "Gå til år {year}",
    no_data: {
      title: "Ingen data tilgjengelig",
      summary: "Beklager, men det finnes ennå ingen donasjonsdata for {year}.",
      last_year: "Alternativt kan du se dataene fra {year}.",
    },
  },
  overview: {
    title: "Oversikt",
    detail: {
      title: "Topp politiske partier og totale donasjoner",
      summary:
        "Denne listen viser de største politiske partiene og deres samlede donasjoner innenfor et bestemt intervall, sortert synkende etter totalsum.",
      summary2:
        "I årene {years} mottok totalt {partyCount} partier til sammen {donationSum} gjennom {donationCount} donasjoner over {minimumAmount}.",
      most_donations:
        "{party} mottok flest donasjoner med totalt {count} bidrag, som utgjør {sum}.",
      highest_sum:
        "De 5 partiene med høyest totalsum i donasjoner er {parties}.",
    },
    scatter: {
      title: "Donasjonsfordeling",
      subtitle:
        "Enkeltbidrag til hvert parti, etter beløp og frekvens, i {country} fra {years}.",
      summary:
        "Oversikten over donasjonsfordeling gir en kort analyse av hvordan donasjoner er fordelt mellom ulike politiske partier. I et spredningsdiagram representerer hvert punkt et parti, der x-aksen viser donasjonsbeløp og størrelsen på punktet reflekterer donasjonsfrekvens.",
      span: "{biggestSpanParty}-partiet hadde det største spenn i donasjoner, med en forskjell på {biggestSpanAmount} mellom den minste og største donasjonen.",
    },
    pie: {
      title: "Fordeling av partidonasjoner",
      subtitle:
        "Totale publiserte donasjoner til hvert parti, {country}, {years}.",
    },
  },
  changes: {
    title: "Endringer",
    description:
      "Utforsk en detaljert tabell over politiske partidonasjoner i {country} fra {year}, kun bidrag over {minAmount}, sortert etter transaksjonsdato, med giver- og beløpsinformasjon.",
    detail: {
      title: "Partidonasjoner etter transaksjonsdato",
      summary:
        "Denne siden viser en liste over partidonasjoner sortert etter transaksjonsdato, med de nyeste donasjonene øverst. Den gir informasjon om beløpet hvert parti mottok og tilhørende givere.",
    },
  },
  donors: {
    title: "Givere",
    description:
      "Se hele listen over givere i {year} til politiske partier i {country}. Finn ut hvem som ga mest og hvor mye hver bidro med.",
    detail: {
      title: "Giverbidrag til politiske partier",
      subtitle:
        "Totale publiserte bidrag per giver til hvert politisk parti i {country}, {years}.",
      summary:
        "Treemapet visualiserer partidonasjonene på en tydelig strukturert måte. Øverste nivå viser giverne, representert ved rektangler der størrelsen er proporsjonal med donasjonsbeløpet.",
      summary2:
        "Under hver giver vises videre rektangler som representerer de respektive mottakerpartiene. Denne hierarkiske visningen gir en rask oversikt over donasjonsfordelingen og viser med et blikk hvor mange mottakere hver giver har støttet.",
      unique_donors: "Antall ulike givere i {years} utgjør {count} givere.",
      biggest_donor: "Den høyeste totalsummen på {amount} kom fra {donor}.",
      most_donations:
        "Med {count} donasjoner (totalbeløp: {sum}) topper {donor} listen over de mest hyppige giverne.",
      most_unique_parties:
        "{donor} donerte til totalt {count} ulike partier (totalbeløp: {sum}), og viser dermed størst mangfold blant mottakerpartiene.",
      top_3: "I {years} er de {amount} største giverne {donors}.",
    },
    list: {
      title: "Toppgivere etter totale bidrag",
      p0: "Denne seksjonen viser en rangert liste over alle givere i valgte år, sortert etter samlet sum av publiserte donasjoner, og fremhever giverne som har bidratt mest.",
    },
    sankey: {
      title: "Sankey-diagram",
    },
    histogram: {
      title: "Fordeling av givere etter antall unike mottakere",
      subtitle:
        "Antall unike politiske partier som mottok publiserte bidrag fra givere i {country}, {years}.",
      p0: "Dette diagrammet gir en oversikt over hvordan givere fordeler bidragene sine mellom politiske partier, og viser om givere typisk konsentrerer støtten om ett parti eller sprer den på flere over tid.",
      p1: "I {years} var det høyeste antallet ulike partier støttet av én giver {max}. Bare {donors} giver bidro til {max} partier. I snitt støttet hver giver {mean} partier (median: {median}).",
      p2: "Med {singlePartyDonors} av {totalDonors} givere bidro {percentage} av giverne til bare ett parti.",
      tooltip: "{donors} givere • {parties} unike partier",
      item: "{donors} givere donerte til {parties} partier",
    },
  },
  timeline: {
    title: "Tidslinje",
    description:
      "Se en tidslinje over alle politiske partidonasjoner i {country} for {years}, med månedlige totaler og trender på tvers av årene.",
    detail: {
      title: "Tidslinje over politiske partidonasjoner",
      summary:
        "Se det interaktive linjediagrammet nedenfor for å følge donasjonshistorikken for hvert politisk parti over tid. X-aksen viser datoer, mens y-aksen viser donert beløp. Hvert parti er representert med en egen linje som vokser for hver donasjon.",
    },
    days: "I {country} gjennom {years} ble donasjoner registrert på {n} unike dager.",
  },
  per_year_party: {
    title: "Donasjoner til {party} per år",
    subtitle:
      "Årlig sum av publiserte donasjoner til {party} i {country}, {years}.",
  },
  per_month: {
    title: "Donasjoner per måned",
    subtitle:
      "Månedlig sum av publiserte donasjoner til hvert parti i {country}, {years}.",
    description:
      "Dette stablede stolpediagrammet viser månedlige donasjonsdata for flere politiske partier. X-aksen viser måneder, y-aksen viser donasjonssummer, og hver stolpe er delt opp etter farge for å vise bidrag per parti, slik at det blir enkelt å sammenligne partidonasjoner innen og mellom måneder.",
    highest_sum:
      "{month} hadde høyest total donasjonssum, med totalt {count} donasjoner som utgjorde {sum}.",
    most_months:
      "{party} mottok donasjoner i {count} måneder, flest måneder med bidrag blant alle partier.",
    month_most_donations:
      "Måneden med høyest antall donasjoner var {month}, som mottok totalt {count} enkeltbidrag.",
  },
  party: {
    donors: {
      title: "Givere til {party}",
      subtitle: "Totale publiserte bidrag fra givere til {party} i {country}.",
      summary:
        "Denne siden viser alle offisielt offentliggjorte donasjoner over {minSum} til {party} siden {minYear}, gruppert etter giver for å vise totalbidrag over tid. Alle tall er basert på offisielle offentliggjøringer publisert av {source}, vist både som treemap for visuell sammenligning og som en utvidbar liste over de underliggende transaksjonene.",
    },
    donor_types: {
      title: "Givertyper",
      treemap: {
        title: "{party}: givertyper",
        description:
          "Totale publiserte bidrag til {party} i {country} etter givertype.",
      },
      p0: "Dette treemapet grupperer rapporterte politiske donasjoner etter givertype (for eksempel privatpersoner, selskaper og offentlige midler) og skalerer hvert rektangel etter totalt beløp bidratt i valgt periode og omfang.",
      p1: "Større bokser indikerer høyere summer, og navnene som vises i hver boks er de største bidragsyterne innen givertypen. Denne visningen inkluderer {count} ulike givertyper for {party}.",
      p2: "Nedenfor er en liste som rangerer givertyper etter totalbidrag, sortert fra høyest til lavest:",
    },
    qa: {
      sum: {
        q: "Hvor mye har {party} mottatt i donasjoner?",
        a: "{party} har mottatt totalt {sum} fra {count} dokumenterte donasjoner.",
      },
      top_donors: {
        q: "Hvem er de største giverne til {party}?",
        a: "De største giverne til {party} er: {donors}.",
      },
      largest_singular: {
        q: "Hva var den største enkeltdonasjonen til {party}?",
        a: "Den største enkeltdonasjonen var {amount} fra {donor} den {date}.",
      },
      biggest_overall: {
        q: "Hvem er den største giveren totalt til {party}?",
        a: "Den største giveren totalt til {party} er {donor} med donasjoner på til sammen {sum}.",
      },
      frequent_donor: {
        q: "Hvem har gitt flest donasjoner til {party}?",
        a: "{donor} har gitt flest donasjoner til {party} med {count} separate donasjoner som til sammen utgjør {sum}.",
      },
    },
    overview: {
      title: "Donasjonsoversikt {party}",
    },
    changes: {
      detail: {
        title: "{party}-donasjoner etter transaksjonsdato",
        summary:
          "Denne siden viser en liste over {party}-donasjoner sortert etter transaksjonsdato, med de nyeste bidragene øverst. Den gir detaljer om beløpet {party} mottok og de respektive giverne.",
      },
    },
    timeline: {
      chart_title: "{party}-donasjoner",
      subtitle:
        "Akkumulert sum av publiserte donasjoner til {party} i {country}.",
      detail: {
        title: "Tidslinje for {party}-donasjoner",
        summary:
          "Utforsk det interaktive linjediagrammet for å følge donasjonshistorikken til {party} over tid. X-aksen viser datoene, mens Y-aksen viser beløpet som er donert. {party} vises som en egen linje som øker for hver donasjon.",
        per_year:
          "Det totale beløpet i donasjoner mottatt av {party} varierer fra år til år. Nedenfor finner du en historisk oversikt over de årlige finansieringstotalene som partiet har oppgitt. Denne listen følger summen av alle rapporteringspliktige bidrag og økonomisk støtte for hvert enkelt år:",
      },
    },
  },
  origin: {
    title: "Opprinnelse",
    description:
      "Se hvor politiske partidonasjoner i {country} for {years} kommer fra—fordelt på delstat/region og bidrag fra utlandet.",
    detail: {
      title: "Donasjonsopprinnelse på et blikk",
      description:
        "Se tydelig opprinnelse for politiske donasjoner til {party} i {country}: fordelt på delstat/region og utenlandske kilder.",
      summary:
        "Utforsk en tydelig oversikt over den geografiske opprinnelsen til donasjoner. Se hvilke delstater/regioner eller land utenfor {country} som bidrar. Følg åpenheten i donasjonsfordelingen for å få innsikt i det geografiske bildet av bidrag.",
      country: {
        austria:
          "I Østerrike registreres opprinnelse for donasjoner først fra og med 2023. Derfor kan eldre donasjoner ikke tilordnes enkeltforbundsstater.",
      },
      sum: "For året {years} utgjorde politiske partidonasjoner i {country} {sumCountry} fra innenlandske kilder. Bidrag fra utenlandsk opprinnelse utgjorde {sumOthers}.",
    },
    type: {
      map: "Kart",
    },
    party: {
      subtitle:
        "Totale publiserte donasjoner til {party} etter opprinnelsesdelstat/region i {country}.",
    },
    country: {
      title: "Donasjoner fra {country}",
      subtitle:
        "Totale publiserte donasjoner etter opprinnelsesdelstat/region i {country}, {years}.",
      summary:
        "Mellom årene {from} og {until} ble donasjoner registrert fra {stateCount} ulike delstater/regioner. Delstaten/regionen med høyest donasjonsbeløp er {highestState} med {highestSum}. Flest donasjoner, nærmere bestemt {largesDonationCountNum}, kom fra {largesDonationCountState}.",
    },
    elsewhere: {
      title: "Donasjoner fra utenfor {country}",
      summary:
        "Mellom årene {from} og {until} ble donasjoner registrert fra {countryCount} ulike land. Landet med høyest donasjonsbeløp er {highestCountry} med {highestSum}. Flest donasjoner, nærmere bestemt {largesDonationCountNum}, kom fra {largesDonationCountState}.",
    },
  },
  donor: {
    title: "Donasjoner fra giveren",
    subtitle: "Totale bidrag og mottakere",
    active_period: "Aktiv periode",
    type: "Givertype",
    summary:
      "{donor} har gitt totalt {sum} fordelt på {count} enkeltbidrag. Gjennomsnittlig donasjon er {avg}. Donasjonene ble fordelt på {parties} ulike partier.",
    oldest:
      "Den første donasjonen etter {minYear} ble gjort den {date} med beløpet {amount} til {party}.",
    newest:
      "Den nyeste donasjonen ble gjort den {date}, med {amount} til {party}.",
    most_donations: "De mest hyppige donasjonene gikk til {list}.",
    most_donations_item: "{party} ({count})",
    highest_most_donation:
      "Året {biggestYear} hadde høyest total donasjonssum på {biggestSum}, mens flest enkeltbidrag ({mostCount}) ble gjort i {mostYear}.",
    biggest:
      "Den største enkeltdonasjonen på {amount} gikk til {party} den {date}.",
    tree_map: "Donasjoner fra {name}",
    tree_map_subtitle:
      "Totale publiserte donasjoner til hvert parti i {country}.",
    biggest_amounts:
      "Donasjonene var i hovedsak rettet mot en utvalgt gruppe partier. Nedenfor er en oversikt over mottakere etter beløp og andel av totalt donert beløp:",
    table:
      "Denne seksjonen gir en fullstendig oversikt over alle enkeltbidrag gjort av {donor}. Du kan sortere tabellen etter dato, parti eller beløp for enkelt å utforske hvordan donasjonene ble fordelt over tid og mellom mottakere. Denne detaljerte visningen muliggjør transparent sporing av hvert bidrag og gir dypere innsikt i giverens donasjonsmønstre.",

    timeline: {
      title: "Akkumulering av donasjoner over tid",
      p0: "Denne seksjonen viser hvordan donasjoner fra {donor} siden {year} til ulike politiske partier har endret seg over tid. Diagrammet visualiserer total donert sum, med hver parts andel fremhevet, slik at det er enkelt å se når og hvor støtten ble rettet.",
      p1: "Følg linjene for å se mønstre, topper eller skift i donering. Denne oversikten gir et transparent bilde av hvordan én givers bidrag fordeles i det politiske landskapet.",
      years:
        "Donasjonene har variert over årene. Nedenfor vises totale donasjonsbeløp per år, sammen med prosentandelen hvert år utgjør av alle donasjoner fra denne giveren.",
      chart_subtitle:
        "Akkumulerte donasjoner fra {donor} til politiske partier i {country}, vist etter beløp og dato siden {minYear}.",
    },

    anonymized: {
      title: "Registrering anonymisert",
      description:
        "Den personlige identiteten knyttet til denne donasjonen er fjernet i samsvar med en gyldig GDPR-forespørsel. Donasjonsbeløpet forblir inkludert i de samlede beregningene av finansieringen for å opprettholde økonomisk åpenhet.",
    },

    redacted: {
      title: "Oppføring sladdet",
      description:
        "Giverens identitet ble sladdet av den publiserende myndigheten før disse dataene ble offentliggjort. Donasjonsbeløpet er fortsatt inkludert i beregningene av total finansiering for å ivareta finansiell åpenhet.",
    },
  },
  countries: {
    "??": "Ikke spesifisert",
    DE: "Tyskland",
    DK: "Danmark",
    CH: "Sveits",
    TH: "Thailand",
    AT: "Østerrike",
    UK: "Storbritannia",
    NL: "Nederland",
    EU: "Den europeiske union",
    LV: "Latvia",
    ES: "Spania",
    FI: "Finland",
    HR: "Kroatia",
    BE: "Belgia",
    LU: "Luxembourg",
    SI: "Slovenia",
    EE: "Estland",
    FR: "Frankrike",
    IE: "Irland",
    IT: "Italia",
    PL: "Polen",
    RO: "Romania",
    CY: "Kypros",
    MT: "Malta",
    PT: "Portugal",
    LT: "Litauen",
    HU: "Ungarn",
    CZ: "Tsjekkia",
    SG: "Singapore",
    MC: "Monaco",
    SE: "Sverige",

    AD: "Andorra",
    IM: "Isle of Man",
    NO: "Norge",
    LI: "Liechtenstein",
    MK: "Makedonia",
    AL: "Albania",
    MD: "Moldova",
    SM: "San Marino",
    FO: "Færøyene",
    BA: "Bosnia-Hercegovina",
    ME: "Montenegro",
    BG: "Bulgaria",
    BY: "Belarus",
    GR: "Hellas",
    IS: "Island",
    SK: "Slovakia",
    UA: "Ukraina",
    GB: "Storbritannia",
    RS: "Serbia",
    AU: "Australia",
    ZA: "Sør-Afrika",
    US: "USA",
    CA: "Canada",
    GE: "Georgia",
    NZ: "New Zealand",
    VE: "Venezuela",
  },
  ref_countries: {
    DE: "Tyskland",
    DK: "Danmark",
    CH: "Sveits",
    TH: "Thailand",
    AT: "Østerrike",
    UK: "Storbritannia",
    NL: "Nederland",
    EU: "EU",
    LV: "Latvia",
    ES: "Spania",
    FI: "Finland",
    HR: "Kroatia",
    BE: "Belgia",
    LU: "Luxembourg",
    SI: "Slovenia",
    EE: "Estland",
    FR: "Frankrike",
    IE: "Irland",
    IT: "Italia",
    PL: "Polen",
    RO: "Romania",
    CY: "Kypros",
    CZ: "Tsjekkia",
    AU: "Australia",
    RS: "Serbia",
    CA: "Canada",
    GE: "Georgia",
    NO: "Norge",
  },
  state: {
    germany: {
      BW: "Baden-Württemberg",
      BY: "Bayern",
      BE: "Berlin",
      BB: "Brandenburg",
      HB: "Bremen",
      HH: "Hamburg",
      HE: "Hessen",
      MV: "Mecklenburg-Vorpommern",
      NI: "Niedersachsen",
      NW: "Nordrhein-Westfalen",
      RP: "Rheinland-Pfalz",
      SL: "Saarland",
      SN: "Sachsen",
      ST: "Sachsen-Anhalt",
      SH: "Schleswig-Holstein",
      TH: "Thüringen",
    },
    austria: {
      "1": "Burgenland",
      "2": "Kärnten",
      "3": "Niederösterreich",
      "4": "Oberösterreich",
      "5": "Salzburg",
      "6": "Steiermark",
      "7": "Tyrol",
      "8": "Vorarlberg",
      "9": "Wien",
    },
    canada: {
      ON: "Ontario",
      QC: "Québec",
      NS: "Nova Scotia",
      NB: "New Brunswick",
      MB: "Manitoba",
      BC: "British Columbia",
      PE: "Prins Edward Island",
      SK: "Saskatchewan",
      AB: "Alberta",
      NL: "Newfoundland og Labrador",
      NT: "Nordvestterritoriene",
      YT: "Yukon",
      NU: "Nunavut",
    },
  },
  about: {
    title: "Om",
    description: {
      p0: "DonationWatch oppstod av frustrasjon over mangelen på lett lesbare data på den offisielle nettsiden til den tyske Forbundsdagen (Bundestag).",
      p1: "Målet vårt er å forbedre dette ved å bruke offentlig tilgjengelige data og presentere dem på en mer effektiv måte.",
      p2: "Vi la merke til at land som Østerrike, Sveits og Nederland publiserer politiske donasjoner i ulike strukturerte formater. For å skape et enhetlig grensesnitt som forenkler tilgangen til denne informasjonen, har vi inkludert disse landene i prosjektet. Flere land vil bli lagt til etter hvert som relevante data finnes og behandles.",
      p3: "Hvis du har forslag eller tilbakemeldinger, ta gjerne",
      mail: "kontakt med oss",
    },
    source:
      "All visualisert informasjon kommer utelukkende fra offentlig tilgjengelige myndighetskilder, og inkluderer ingen tidligere upubliserte data eller private registre. Åpenhet er fundamentet vårt",
  },
  imprint: {
    title: "Impressum",
  },
  privacy: {
    title: "Personvernerklæring",
    last_updated: "Sist oppdatert: {date}",
    effective_date: "Gjelder fra: {date}",
    data: {
      title: "1. Datainnsamling",
      p: "Vi samler ikke inn personopplysninger fra besøkende på nettsiden vår. Dette inkluderer:",
      li0: "Ingen registreringsskjemaer",
      li1: "Ingen nyhetsbrev-registreringer",
      li2: "Ingen brukerkontoer",
      li3: "Ingen informasjonskapsler (cookies) for sporingsformål",
    },
    cf: {
      title: "2. Cloudflare-tjenester",
      link: "Se Cloudflares personvernerklæring",
      p: "Vi bruker to Cloudflare-tjenester:",
      workers: {
        summary:
          "Cloudflare Workers: Serverløs plattform for innholdslevering (ingen behandling av brukerdata)",
      },
      analytics: {
        summary: "Cloudflare Web Analytics: Personvernfokusert analyse som:",
        li0: "Ikke bruker informasjonskapsler",
        li1: "Kun samler inn aggregerte målinger",
      },
    },
    logs: {
      title: "3. Automatiske serverlogger",
      p: "Vår hostingleverandør kan samle inn:",
      li0: "IP-adresser (anonymisert)",
      li1: "Tidspunkt for forespørsler",
      li2: "Nettleser-/enhetstyper",
      retention: "Disse dataene slettes automatisk innen 7 dager.",
    },
    contact: {
      title: "Kontakt",
      p: "For spørsmål om personvern:",
    },
  },
  fun: {
    link: "Fun facts",
    title: "Morsomme fakta om offentlige data",
    p0: "Denne siden viser interessante funn fra arbeidet vårt med offentlig tilgjengelige myndighetsdata. Disse observasjonene er ikke kritikk, men små særheter som kan forekomme i ethvert stort datasett.",
    p1: "Når det er hensiktsmessig rapporterer vi problemer videre, men vi anser dem ikke som hastesaker for myndighetene. Etter vår erfaring har disse organisasjonene vært mottakelige og åpne for tilbakemeldinger.",
    reported_fixed: "Dette ble rapportert til {owner} og rettet av dem.",
    reported_wontfix:
      "Dette ble rapportert til {owner} og de kan ikke endre det.",
    reported: "Dette ble rapportert til {owner}.",
  },
  transparency: {
    title: "Åpenhet",
    p0: "Vi jobber for å gi tydelig og konsistent informasjon om givere til politiske partier. For å få til dette normaliserer vi automatisk enkelte givernavn for å sikre ensartethet i databasen vår. Denne tilnærmingen gjør at vi kan bevare nøyaktighet samtidig som vi håndterer avvik i hvordan navn kan være registrert.",
    p1: "Av hensyn til åpenhet har vi samlet en liste over normaliserte navn sammen med variantene vi har funnet i donasjonsregistrene. Nedenfor finner du hvert normalisert navn etterfulgt av variantene. Listen forklarer hvorfor du kan se givernavn som ikke samsvarer nøyaktig med kildedokumentene.",
    section: {
      filtered_donors: "Filtrerte givere",
      filtered_receivers: "Filtrerte mottakere",
      aggregated: "Aggregerte givere",
    },
    filtered_donors: {
      p0: "For å gi et mest mulig presist bilde av de reelle kildene til politiske donasjoner, filtrerer vi bort enkelte transaksjoner som i praksis er offentlige bidrag snarere enn reelle donasjoner. Fordi kildedatasett ikke merker disse eksplisitt, bruker vi et sett med filtreringsregler basert på regulære uttrykk (regexp) for automatisk å identifisere og fjerne slike oppføringer. Nedenfor kan du se hele listen over anvendte regexp-filtreringsregler.",
      p1: "Nedenfor finner du en liste over givere der bidragene ble filtrert bort i tråd med våre kriterier og filtreringsregler.",
    },
    filtered_receivers: {
      p0: "For å sikre at vi bare presenterer meningsfulle mottakerdata, filtrerer vi også bort enkelte mottakere eller partier som anses som irrelevante eller ikke-operative for formål knyttet til sporing av givere. Siden datasettene våre ikke alltid merker disse mottakerne eksplisitt, bruker vi et sett med regexp-baserte regler for automatisk å ekskludere dem.",
      p1: "Nedenfor kan du se hele listen over anvendte regexp-filtreringsregler.",
    },
    receivers: {
      title: "Aggregerte mottakere",
      p0: "I {country} kan donasjoner rapporteres til ulike organisatoriske enheter innenfor et parti. For konsistens konsoliderer vi relaterte mottakerenheter til én totalsum på partinivå. Listen nedenfor dokumenterer hvilke mottakerenheter som er aggregert inn i hvert parti.",
    },
  },
  related: {
    donors: "Lignende givere",
  },
  similar_donors: {
    title: "Nettverk av lignende givere",
    description:
      "Utforsk det bredere donasjonsnettverket knyttet til denne giveren.",
    summary:
      "I det relaterte donasjonsnettverket finnes det {count} unike givere.",
    list_title: "Oversikt over fordeling på partier",
  },

  detect_country: {
    title: "Det ser ut til at du er i {country}.",
    description: "Trykk for å utforske politiske donasjoner i {country}.",
    action: "Vis donasjoner for {country}",
  },

  donor_type: {
    [DonorType.PublicFund]: "Offentlige midler",
    [DonorType.Individual]: "Privatperson",
    [DonorType.Company]: "Selskap",
    [DonorType.Other]: "Annet",
    [DonorType.TradeUnion]: "Fagforening",
    [DonorType.UnincorporatedAssociation]: "Uregistrert forening",
    [DonorType.RegisteredPoliticalParty]: "Registrert politisk parti",
    [DonorType.Trust]: "Trust",
    [DonorType.FriendlySociety]: "Gjensidig hjelpeforening",
    [DonorType.LimitedLiabilityPartnership]: "Partnerskap med begrenset ansvar",
    [DonorType.BuildingSociety]: "Boligbyggelag",
    [DonorType.NonProfitLegalEntity]: "Ideell juridisk enhet",
    [DonorType.AnonymizedDonor]: "Anonymisert donor",
  } satisfies Record<DonorType, string>,

  other_countries: {
    title: "Andre land",
  },

  thanks:
    "Takk til organisasjoner som {external} for å tilby verdifull informasjon om mekanismer for politiske donasjoner.",

  export: {
    title: "Dataeksport",
    p0: "Få hele datasettet med politiske donasjoner for {country} som brukes på dette nettstedet. Eksporten inkluderer normaliserte donornavn, beløp, datoer og mottakerpartier.",
    p1: "Viktig: Dette er ikke rådataene fra {source}. Dette datasettet inneholder kun donasjoner som er normalisert og filtrert av teamet vårt. Se delen {transparency} for metodebeskrivelse.",
    license: "Lisens: {license}",
    download: "Last ned {format}",
    includes_donations: "{num} donasjoner inkludert",
  },
  bar_chart_race: {
    title: "Søylediagram-kappløp",
    description:
      "Visualiser akkumuleringen av donasjoner over tid. Velg et årsspenn for å se hvordan partifinansieringen utvikler seg dynamisk.",
    from: "Fra",
    to: "Til",
    download_video: "Last ned video",
    rendering: "Renderer... {percentage}",
    no_data: "Ingen data tilgjengelig for det valgte spennet.",
    note: "Vennligst merk: Denne animasjonen rendres på klientsiden i nettleseren din og kan være ressurskrevende på enkelte enheter. Nedlasting av videoen vil automatisk spille av hele animasjonen.",
    individual_years: "Enkeltår",
    animation_duration: "Animasjonsvarighet",
    duration_s: "{seconds}s",
    group_by: {
      label: "Grupper etter",
      receiver: "Parti",
      donor: "Giver",
    },
  },
};

export default No;
