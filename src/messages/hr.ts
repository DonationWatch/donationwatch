import { DonorType } from "../utils/types";

const Hr = {
  copyright: "Autorsko pravo",
  charts_license: "Grafovi licencirani prema {license} uz navođenje autorstva",
  data_error: "Pogreška pri učitavanju podataka",
  description:
    "DonationWatch pruža jasan uvid u donatore i stranke, olakšavajući razumijevanje političkog financiranja objašnjavajući složene podatke na jednostavan način",
  title: "Donacije stranaka {country}",
  sum: "Suma",
  donation_count: "Broj donacija",
  average: "Prosjek",
  donations_by_party: "Donacije po strankama",
  donations_per_year: "Donacije po godinama",
  party_donations: "Donacije stranaka",
  more: "Više",
  loading: "Sadržaj se učitava",
  data_since: "Od {year}",
  view_party: "Pogledajte stranicu stranke {party}",
  faq: "Često postavljana pitanja",
  sidebar: {
    toggle: "Ukljuci/isključi bočnu traku",
    donations: "Donacije",
    all_countries: "Sve zemlje",
    tools: "Alati",
    show_all: "Prikaži sve ({num})",
    show_less: "Prikaži manje",
  },
  search: {
    filter: "Pretraživanje...",
    filter_description: "Pretražite stranke, godine ili donatore",
    parties: "Stranke",
    years: "Godine",
    legislative_years: "Zakonodavne godine",
    empty: "Nema rezultata",
    donors: "Donatori",
  },
  page_title: {
    years: {
      description:
        "U {year}. godini {parties} stranaka u {country} primilo je ukupno {sum} iz {count} donacija iznad {minAmount}. Istražite detaljne prikaze po stranci, donatoru i trendovima u političkom financiranju.",
      overview: "Pregled donacija političkim strankama u {country} za {year}",
      changes:
        "Nedavne promjene u donacijama političkim strankama u {country} za {year}",
      donors: "Najveći donatori političkim strankama u {country} za {year}",
      timeline:
        "Vremenska crta donacija političkim strankama u {country} za {year}",
      origin: "Geografski pregled donacija strankama u {country} za {year}",
    },
    party: {
      donors: "Najveći donatori {party} {country}",
      changes: "Nedavne promjene u donacijama {party} {country}",
      timeline: "Vremenska crta donacija stranke {party} {country}",
      origin: "Geografski pregled donacija stranke {party} {country}",
      description:
        "Od {year}. godine, {party} je primila ukupno {count} donacija većih od {minimumAmount}, u ukupnom iznosu od {sum}. Istražite detaljne informacije o glavnim donatorima i trendovima donacija za {party} u {country}.",
    },
    donor: {
      overview: "Donacije od {donor} u {country}",
      description:
        "{donor} je ukupno donirao {sum} kroz {count} donacija iznad {minAmount} od {minYear}. Ovi doprinosi su raspodijeljeni na {parties} različitih stranaka. Istražite detaljne uvide u obrasce donacija i primatelje donacija ovog donatora u zemlji {country}.",
    },
  },
  chart: {
    save_as_image: "Spremi kao sliku",
    toggle_fullscreen: "Prebaci na puni zaslon",
    reset_zoom: "Resetiraj zum",
  },
  over_min_public_amount: "preko {amount}",
  over_threshold: "samo stranke s ≥ {count} donacija ili ≥ {sum}",
  prelim_data: "preliminarni podaci od {year}. godine",
  excludes_year_only_donations: "isključuje donacije s godinom kao datumom",
  common: {
    date: "Datum",
    party: "Stranka",
    donor: "Donator",
    amount: "Iznos",
    anonymizedDonor: "Anonimizirani donator",
    redactedDonor: "Redigirani donator",
  },
  sort: {
    asc: "Sortiraj uzlazno",
    desc: "Sortiraj silazno",
    clear: "Poništi sortiranje",
  },
  footer: {
    sources: "Izvori",
    build: "Stanje na dan {date}",
    build_since: "Od {date}, od {year}",
    published_by: "Kako je objavio {source}",
  },
  header: {
    home: "Početna stranica",
    language_selection: "Odabir jezika",
    country_selection: "Odabir države",
  },
  actions: {
    close: "Zatvori",
    play: "Reproduciraj",
    pause: "Pauziraj",
    restart: "Ponovno pokreni",
  },
  donor_dialog: {
    title: "Informacije o donatoru",
    summary: "Sažetak",
  },
  donation_dialog: {
    title: "Detalji o donaciji",
    donor: "Donator",
    country: "Država",
    state: "Pokrajina",
    receiver: "Primatelj",
    donation_amount: "Iznos donacije",
    date: "Datum",
  },
  root: {
    title: "Praćenje donacija političkim strankama otvorenog koda",
    subtitle:
      "Pratite i istražite političke donacije u više zemalja. Saznajte tko financira političke stranke i kako novac teče diljem svijeta.",
    stats: {
      countries: "Obuhvaćene zemlje",
      parties: "Političke stranke",
      donations: "Pojedinačne donacije",
      currencies: "Praćene valute",
    },
    countries: {
      title: "Istražite političke donacije po zemlji",
      subtitle:
        "Odaberite zemlju kako biste pristupili detaljnim zapisima o donacijama, podacima o financiranju stranaka i informacijama o donatorima.",
    },
    why: {
      title: "Zašto je transparentnost političkih donacija važna",
      p0: "Demokracija ovisi o informiranim građanima. Time što podatke o političkim donacijama činimo dostupnima i lakima za istraživanje, pomažemo ljudima razumjeti financijske odnose koji oblikuju njihov politički krajolik. Transparentnost u političkom financiranju gradi povjerenje, jača odgovornost i osnažuje birače da donose informirane odluke.",
    },
    open_source: {
      title: "Otvoreni kod",
      p0: "DonationWatch je otvorenog koda. Možeš pregledati kod, prijaviti probleme ili doprinijeti na {github}.",
    },
  },
  home: {
    most_recent: "Najnovije donacije",
    hero: {
      subtitle: "Praćenje donacija političkim strankama za {country}",
      subtitle_no_country: "Praćenje donacija političkim strankama",
    },
    biggest_donations: {
      text: "Od {minYear} godine najveća objavljena pojedinačna donacija u {country} dosegla je {amount} od {donor} za {party} u {year} godini. Slijede {others}.",
      list: "{amount} od {donor} za {receiver}",
    },
    last_period: "Najnovija godina:",
    previous_period: "Donacije iz prethodne godine.",
    what: {
      title: "Što je ovo?",
      summary:
        "Donacije strankama važan su dio politike. One su važan pokazatelj političke podrške.\n\nMi pokušavamo ove podatke predstaviti jasno i razumljivo.",
      threshold:
        "Zbog velikog broja manjih političkih stranaka pratimo donacije samo za stranke koje zadovoljavaju određeni prag. Trenutni prag postavljen je na {count} donacija ili ukupni iznos od {sum} doprinosa toj stranci, bez obzira na veličinu pojedinačnih donacija.",
      source: {
        austria:
          "Podaci koji se ovdje koriste dolaze iz austrijskog Revizorskog suda i uključuju sve donacije strankama koje su tamo dokumentirane od 2012. godine.\n" +
          "\n" +
          "Molimo imajte na umu: Prije 8. srpnja 2019., političke stranke morale su prijaviti pojedinačne donacije veće od 51.000 eura (do 2018. preko 50.000 eura) ACA-u. Od srpnja 2019. granica za prijavu je 2.500 eura.\n" +
          "\n" +
          "Podaci stranaka obično se ažuriraju tromjesečno.",
        germany:
          "Podaci koji se ovdje koriste dolaze iz njemačkog Bundestaga i uključuju sve donacije strankama preko 50.000 eura dokumentirane tamo od 2010. godine i preko 35.000 eura od 5. ožujka 2024.",
        switzerland:
          "Podaci koji se ovdje koriste dolaze iz švicarske Savezne financijske kontrole i uključuju sve političke donacije dokumentirane tamo od 2023. godine.",
        netherlands:
          "Informacije prikazane ovdje preuzete su od Vlade Nizozemske i uključuju sve političke donacije zabilježene od 2022. godine koje premašuju 1.000 €, kako je navedeno u godišnjem izvješću „Overzicht van giften aan politieke partijen en hun neveninstellingen“.\n\nZa tekuću godinu uključene su samo donacije koje prelaze 10.000 €, na temelju skupa podataka „Overzicht substantiële giften aan politieke partijen“.\n\nNapomena: Neke donacije nemaju precizan datum i stoga nisu uključene u vremenske serije ili druge vizualizacije temeljene na datumu.\n\nDonacije prijavljene za SP i GL mogu izgledati relativno visoke jer obje stranke zahtijevaju od svojih zastupnika i dužnosnika da značajan dio svojih plaća uplate stranci.",
        europeanunion:
          "Podaci predstavljeni ovdje potječu od Tijela za europske političke stranke i europske političke zaklade, obuhvaćajući sve dokumentirane donacije strankama i zakladama od 2018. godine. Zbog važnosti europskih političkih zaklada, pratimo i prikazujemo njihove donacije slično kao i donacije europskim političkim strankama.\n" +
          "\n" +
          "Budući da službeni podaci ne uključuju datume, nisu dostupne vremenske serije ili slični vizualni prikazi.\n" +
          "\n" +
          "Imajte na umu da su u razdoblju prije europskih izbora 2024. (od 6. prosinca 2023. do 10. lipnja 2024.) vrijedili posebni zahtjevi za izvještavanje o donacijama, s tjednim izvješćima i pravovremenom objavom od strane tijela.\n" +
          "Od 10. lipnja 2024. samo se donacije preko 12.000 eura moraju odmah prijaviti. Ostale donacije bit će dostupne tek nakon predaje godišnjih financijskih izvještaja.",
        estonia:
          "Podaci koji se ovdje koriste dolaze iz estonskog Odbora za nadzor financiranja stranaka i uključuju sve političke donacije dokumentirane tamo od 2014. godine koje prelaze 1 euro.\n" +
          "\n" +
          "Političke stranke u Estoniji dužne su izvještavati o svojim prihodima, uključujući primljene donacije, na tromjesečnoj osnovi.\n" +
          "Podaci na web stranici odbora ažuriraju se sukladno tome tromjesečno.",
        czechrepublic:
          "Podaci korišteni ovdje potječu iz Ureda za nadzor nad upravljanjem političkih stranaka i političkih pokreta i uključuju sve političke donacije koje su tamo dokumentirane od 2018. godine i koje prelaze 25 CZK.\n" +
          "\n" +
          "Ovaj opseg također obuhvaća sve doprinose strankama ili političkim pokretima koji su ili primili više od 100 pojedinačnih donacija ili premašili ukupni iznos donacija od 1 milijun CZK, bez obzira na veličinu pojedinačnih doprinosa. Podaci se ažuriraju jednom godišnje.\n" +
          "Otkrivanje vrste donatora temelji se na identifikaciji donatora kao pojedinca ako su prisutna polja firstName i lastName.",
        latvia:
          "Podaci koji se ovdje koriste dolaze iz Ureda za sprječavanje i borbu protiv korupcije i uključuju sve političke donacije dokumentirane tamo od 2015. godine, koje prelaze 1 euro.",
        australia:
          'Ovdje korišteni podaci dolaze od Australian Electoral Commission (AEC), i to konkretno iz skupa podataka "Donations Made Details" koji AEC objavljuje. Uključuje sve političke donacije ondje evidentirane od 2014., veće od €1.\n' +
          "\n" +
          "Vrijedi napomenuti da skup podataka AEC-a može sadržavati neke tipografske pogreške, što može dovesti do toga da određene donacije ne budu obuhvaćene ili da zbog nedosljednosti pri unosu podataka ne budu ispravno dodijeljene određenoj stranci. Uz to, godišnje objave AEC-a izlaze 1. veljače svake godine, ali podaci ne pružaju potpunu sliku svih doprinosa zbog praga za objavu od $15,000.\n" +
          "\n" +
          "Vrste donatora klasificiraju se usporedbom naziva donatora. Svi uobičajeni sindikati ručno se mapiraju na vrstu donatora 'Sindikat'. Tvrtke se otkrivaju provjerom prisutnosti određenih korporativnih oznaka u nazivu donatora: 'Pty' (Proprietary), 'Ltd' na kraju naziva, 'Corporation' ili 'Corp'.",
        unitedkingdom:
          "Podaci koji se ovdje koriste dolaze iz Izborne komisije i uključuju sve političke donacije koje su tamo dokumentirane od 2010. godine i prelaze 1.000 funti.\n" +
          "\n" +
          "Podaci o donacijama ažuriraju se tromjesečno.",
        serbia:
          'Podaci koji se ovdje koriste ne dolaze od vlade, već od neprofitne organizacije "Centar za istraživačko novinarstvo Srbije" (CINS), koja je ljubazno agregirala podatke o donacijama Agencije za borbu protiv korupcije Srbije.\n' +
          "\n" +
          "Ovi podaci uključuju sve političke donacije dokumentirane tamo od 2015. godine.\n" +
          "\n" +
          "Budući da skup podataka ne pruža specifične informacije o datumu za pojedinačne donacije, nažalost nije moguće prikazati vremenske crte ili druge vizualizacije temeljene na vremenu.",
        croatia:
          "Podaci koji se ovdje koriste potječu od Državnog izbornog povjerenstva Republike Hrvatske (DIP) i obuhvaćaju sve političke donacije novčane vrijednosti veće od 1 €, dokumentirane od 2019. godine.\nSkup podataka koristi samo posljednji objavljeni dokument o donacijama za svaku izvještajnu godinu (kako navodi izbori) kako bi se izbjegli duplikati iz ranijih verzija izvješća za istu godinu.\nSve donacije prikazane su u eurima, dok temeljni skup podataka koristi kune do 2024. godine. Donacije izvorno u kunama pretvaraju se u eure koristeći približne tečajeve za svako polugodište od 2019. do 2024.: H1 (0.1340, 0.1335, 0.1332, 0.1329, 0.1326) i H2 (0.1341, 0.1338, 0.1334, 0.1327, 0.1328).",
        canada:
          "Podaci korišteni ovdje dolaze od Elections Canada i temelje se na skupu podataka „contributions as submitted“. Uključuju sve političke donacije novčane vrijednosti veće od 500 €, dokumentirane od 2015. godine. Uključeni su svi unosi koji su dio izvješća „Statement of Contributions Received“ iz izbornog događaja „Annual“ za „Registered parties“.",
        georgia:
          "Informacije prikazane ovdje preuzete su iz Ureda za borbu protiv korupcije (ანტიკორუფციული ბიურო﻿) Gruzije i uključuju sve političke donacije zabilježene od 2011. godine koje prelaze 1 GEL. Skup podataka uključuje samo doprinose klasificirane kao tip #10 (Novčane donacije) ili tip #16 (Novčane donacije pravnih osoba).",
        norway:
          "Ovdje korišteni podaci potječu iz službenih publikacija o financiranju stranaka koje objavljuju Statistics Norway (SSB) i Partifinansiering.no. Prikazani ukupni iznosi agregirani su iz više prijavljenih primateljskih entiteta (kao što su središnje, regionalne, lokalne i omladinske jedinice) u jedan ukupni iznos po stranci, pri čemu je temeljno mapiranje primatelja i dalje dostupno radi transparentnosti.\n\nNorveški skup podataka osvježava se u godišnjem ciklusu ažuriranja, odražavajući dinamiku temeljnih objava.",
      },
      source_link: "Izvor podataka",
    },
    list: {
      subtitle: "Zakonodavna razdoblja",
      title: "Prošla zakonodavna razdoblja",
      summary:
        "Naš Pregled zakonodavnih razdoblja objedinjuje sve donacije tijekom cijelog zakonodavnog mandata. Kliknite na karticu za navigaciju do odgovarajućeg zakonodavnog razdoblja.",
    },
    years: {
      title: "Godišnji pregled donacija strankama",
      subtitle: "Agregirane sume kroz godine",
      more: "Pogledajte sve preostale godine",
      summary:
        "Istražite naš godišnji pregled donacija strankama, koji sažima sve doprinose za svaku godinu. Kliknite na karticu za navigaciju do detaljnog godišnjeg pregleda.",
    },
    parties: {
      title: "Donacije strankama",
      subtitle: "Detalji o pojedinačnim strankama",
      more: "Pogledajte sve preostale stranke",
      summary:
        "Istražite naš pregled donacija strankama, koji objedinjuje sve doprinose za svaku stranku. Kliknite na karticu za pristup detaljima o donacijama.",
    },
    donors: {
      title: "Donacije donatora",
      subtitle: "Detalji o pojedinačnim donatorima",
      summary:
        "Otkrijte naš pregled donatora, koji prikazuje najznačajnije financijske doprinositelje od {minYear}. Kliknite na donatora za pregled detaljnih informacija o njihovim doprinosima.",
    },
    stacked_years: "Iznos donacija po godini",
    stacked_years_subtitle:
      "Zbrojeni iznos objavljenih doprinosa u {country}, po godinama od {years}.",
  },
  years: {
    title: "Donacije strankama",
    subtitle:
      "Kumulativni zbroj objavljenih donacija svakoj stranci u {country}, {years}.",
    goto_year: "Idi na godinu {year}",
    no_data: {
      title: "Nema dostupnih podataka",
      summary:
        "Žao nam je, ali još nemamo podatke o donacijama za {year}. godinu.",
      last_year: "Alternativno, pogledajte podatke iz {year}. godine.",
    },
  },
  overview: {
    title: "Pregled",
    detail: {
      title: "Vodeće političke stranke i njihove ukupne donacije",
      summary:
        "Ovaj popis prikazuje vodeće političke stranke i njihove kumulativne donacije unutar određenog intervala, poredane silazno prema zbroju donacija",
      summary2:
        "U godinama {years}, ukupno {partyCount} stranaka primilo je ukupno {donationSum} kroz {donationCount} donacija koje premašuju {minimumAmount}.",
      most_donations:
        "{party} je primila najviše donacija s ukupno {count} doprinosa, u iznosu od {sum}.",
      highest_sum: "Pet stranaka s najvećim ukupnim donacijama su {parties}.",
    },
    scatter: {
      title: "Raspodjela donacija",
      subtitle:
        "Pojedinačne donacije svakoj stranci prema iznosu i učestalosti u {country} od {years}.",
      summary:
        "Pregled raspodjele donacija strankama pruža sažetu analizu raspodjele donacija među različitim političkim strankama. Kroz vizualizaciju točkastog dijagrama, svaka točka predstavlja stranku, s x-osi koja označava iznose donacija, a veličina točke odražava učestalost donacija.",
      span: "Stranka {biggestSpanParty} zabilježila je najveću razliku u donacijama, s razlikom od {biggestSpanAmount} između najmanje i najveće donacije.",
    },
    pie: {
      title: "Raspodjela donacija strankama",
      subtitle:
        "Ukupno objavljene donacije svakoj stranci, {country}, {years}.",
    },
  },
  changes: {
    title: "Promjene",
    description:
      "Pregledajte detaljnu tablicu donacija političkim strankama u {country} iz {year}, samo doprinosi iznad {minAmount}, sortirano po datumu transakcije, s podacima o donatoru i iznosu.",
    detail: {
      title: "Donacije strankama prema datumu transakcije",
      summary:
        "Ova stranica prikazuje popis donacija strankama sortiranih prema datumu transakcije, s najnovijim donacijama na vrhu. Pruža informacije o iznosu koji je primila svaka stranka i odgovarajućim donatorima.",
    },
  },
  donors: {
    title: "Donatori",
    description:
      "Pogledajte potpuni popis donatora političkim strankama u {country} za {year}. Saznajte tko je dao najviše i koliko je svatko pridonio.",
    detail: {
      title: "Doprinosi donatora političkim strankama",
      subtitle:
        "Ukupni objavljeni doprinosi pojedinačnih donatora svakoj političkoj stranci u {country}, {years}.",
      summary:
        "Treemap vizualizira donacije strankama u jasno strukturiranom prikazu. Gornja razina prikazuje pojedinačne donatore, koji su predstavljeni pravokutnicima čija je veličina proporcionalna iznosu njihovih donacija.",
      summary2:
        "Ispod svakog donatora nalaze se daljnji pravokutnici koji predstavljaju odgovarajuće stranke primatelje. Ovaj hijerarhijski raspored pruža brz pregled raspodjele donacija i na prvi pogled pokazuje koliko je primatelja svaki donator podržao.",
      unique_donors:
        "Broj različitih donatora u {years} iznosi {count} donatora.",
      biggest_donor: "Najviša ukupna donacija od {amount} došla je od {donor}.",
      most_donations:
        "S {count} donacija (ukupni iznos: {sum}), {donor} je na vrhu liste najčešćih pojedinačnih donatora.",
      most_unique_parties:
        "{donor} je dao donacije ukupno {count} različitih stranaka (ukupni iznos: {sum}), pokazujući najveću raznolikost među primateljima donacija.",
      top_3: "U razdoblju {years} najvećih {amount} donatora su: {donors}.",
    },
    list: {
      title: "Najbolji pojedinačni donatori prema ukupnim doprinosima",
      p0: "Ovaj odjeljak prikazuje rangiran popis svih pojedinačnih donatora unutar odabranih godina, sortiran prema kumulativnom zbroju njihovih objavljenih donacija. Na taj način ističu se donatori koji su najviše doprinijeli.",
    },
    sankey: {
      title: "Sankey dijagram",
    },
    histogram: {
      title: "Raspodjela donatora prema broju jedinstvenih primatelja",
      subtitle:
        "Broj jedinstvenih političkih stranaka koje su primile objavljene donacije od pojedinačnih donatora u zemlji {country}, {years}.",
      p0: "Ovaj grafikon pruža pregled načina na koji pojedinačni donatori raspoređuju svoje doprinose među političkim strankama, pokazujući imaju li tendenciju usmjeravati svoju podršku jednoj stranci ili je tijekom vremena raspodijeliti na više stranaka.",
      p1: "U {years}. godini najveći broj različitih stranaka koje je podupirao jedan donator bio je {max}. Samo je {donors} donator dao prilog za {max} stranaka. U prosjeku je svaki donator podupirao {mean} stranaka (medijan: {median}).",
      p2: "Od {totalDonors} donatora, {singlePartyDonors} je doniralo samo jednoj stranci, što čini {percentage} svih donatora.",
      tooltip: "{donors} donatora • {parties} jedinstvenih stranaka",
      item: "{donors} donatora doniralo je za {parties} stranaka",
    },
  },
  timeline: {
    title: "Vremenska crta",
    description:
      "Pogledajte vremensku crtu svih donacija političkim strankama u {country} za {years}, s mjesečnim ukupnim iznosima i trendovima kroz godine.",
    detail: {
      title: "Vremenska crta donacija političkim strankama",
      summary:
        "Pogledajte interaktivni linijski grafikon ispod kako biste pratili povijest donacija svake političke stranke tijekom vremena. X-os predstavlja datume, dok y-os prikazuje iznos doniranog novca. Svaka politička stranka predstavljena je posebnom linijom koja raste sa svakom donacijom.",
    },
    days: "U zemlji {country} su tijekom {years} zabilježene donacije na {n} različitih dana.",
  },
  per_year_party: {
    title: "Donacije za {party} po godini",
    subtitle:
      "Godišnji zbroj objavljenih donacija za {party} u {country}, {years}.",
  },
  per_month: {
    title: "Donacije po mjesecima",
    subtitle:
      "Mjesečni zbroj objavljenih donacija svakoj stranci u {country}, {years}.",
    description:
      "Ovaj složeni stupčasti grafikon prikazuje mjesečne podatke o donacijama za više političkih stranaka. X-os prikazuje mjesece, y-os predstavlja zbroj donacija, a svaki stupac je segmentiran bojom kako bi prikazao doprinose pojedinačnih stranaka, omogućujući laku usporedbu donacija strankama unutar i između mjeseci.",
    highest_sum:
      "{month} je imao najviše ukupne donacije, s kombiniranim brojem od {count} donacija u iznosu od {sum}.",
    most_months:
      "{party} je primila donacije u {count} mjeseci, što je najviše mjeseci s prilozima međusvim strankama.",
    month_most_donations:
      "Mjesec s najviše donacija bio je {month}, koji je primio ukupno {count} pojedinačnih donacija.",
  },
  party: {
    donors: {
      title: "Donatori za {party}",
      subtitle:
        "Ukupni objavljeni doprinosi pojedinačnih donatora stranci {party} u {country}.",
      summary:
        "Ova stranica prikazuje sve službeno objavljene donacije iznad {minSum} za {party} od {minYear}, grupirane po donatorima kako bi se prikazali ukupni doprinosi kroz vrijeme. Sve brojke su temeljene na službenim objavama objavljenima od strane {source}, prikazane i kao treemap za vizualnu usporedbu i kao proširivi popis temeljnih transakcija.",
    },
    donor_types: {
      title: "Vrste donatora",
      treemap: {
        title: "Vrste donatora za {party}",
        description:
          "Ukupno objavljene donacije {party} u {country} po vrsti donatora.",
      },
      p0: "Ova karta stabla grupira prijavljene političke donacije po vrsti donatora (na primjer, pojedinci, tvrtke i javni fondovi) i veličinu svakog pravokutnika određuje prema ukupnom iznosu u odabranom razdoblju i opsegu.",
      p1: "Veći okviri označavaju veće iznose, a imena prikazana unutar svakog okvira predstavljaju najveće donatore unutar njihove kategorije. Ovaj prikaz uključuje {count} različitih vrsta donatora za {party}.",
      p2: "U nastavku je popis sektora rangiranih prema ukupnim donacijama, od najvećih prema najmanjima:",
    },
    qa: {
      sum: {
        q: "Koliko je {party} primila u donacijama?",
        a: "{party} je primila ukupno {sum} u donacijama iz {count} dokumentiranih donacija.",
      },
      top_donors: {
        q: "Tko su najveći donatori {party}?",
        a: "Najveći donatori {party} su: {donors}.",
      },
      largest_singular: {
        q: "Koja je bila najveća pojedinačna donacija za {party}?",
        a: "Najveća pojedinačna donacija bila je {amount} od {donor} na datum {date}.",
      },
      biggest_overall: {
        q: "Tko je najveći ukupni donator {party}?",
        a: "Najveći ukupni donator {party} je {donor} s ukupnim donacijama od {sum}.",
      },
      frequent_donor: {
        q: "Tko je napravio najviše donacija za {party}?",
        a: "{donor} je napravio najviše donacija za {party} s {count} odvojenih donacija ukupno {sum}.",
      },
    },
    overview: {
      title: "Pregled donacija {party}",
    },
    changes: {
      detail: {
        title: "Donacije {party} prema datumu transakcije",
        summary:
          "Ova stranica prikazuje popis donacija {party} sortiranih prema datumu transakcije, s najnovijim doprinosima navedenim na vrhu. Nudi detalje o iznosu koji je primila {party} i odgovarajućim donatorima.",
      },
    },
    timeline: {
      chart_title: "Donacije {party}",
      subtitle:
        "Kumulativni zbroj objavljenih donacija stranci {party} u {country}.",
      detail: {
        title: "Vremenska crta donacija {party}",
        summary:
          "Istražite interaktivni linijski graf kako biste pratili povijest donacija za {party} kroz vrijeme. X-os predstavlja datume, dok Y-os prikazuje iznos doniranog novca. {party} je prikazana zasebnom linijom koja raste sa svakom donacijom.",
        per_year:
          "Ukupan iznos donacija koje je {party} primila razlikuje se po godinama. U nastavku je povijesni pregled godišnjih ukupnih iznosa financiranja koje je stranka prijavila. Ovaj popis prati zbroj svih prijavljivih doprinosa i financijske potpore za svaku pojedinu godinu:",
      },
    },
  },
  origin: {
    title: "Podrijetlo",
    description:
      "Pogledajte odakle dolaze donacije političkim strankama u {country} za {years}—prikaz po županijama i međunarodnim doprinosima.",
    detail: {
      title: "Pregled podrijetla donacija",
      description:
        "Pogledajte transparentno podrijetlo političkih donacija za {party} u {country}: raščlamba po državama i stranim izvorima.",
      summary:
        "Istražite jasan pregled geografskog podrijetla donacija. Otkrijte koje države ili zemlje izvan {country} doprinose podršci. Pratite transparentnost raspodjele donacija kako biste stekli uvid u geografski krajolik doprinosa.",
      country: {
        austria:
          "U Austriji se podrijetlo donacija bilježi tek od 2023. godine. Iz tog razloga, sve starije donacije ne mogu se dodijeliti pojedinim saveznim državama.",
      },
      sum: "Za godinu {years}, donacije političkim strankama u {country} ukupno su iznosile {sumCountry} iz domaćih izvora. Doprinosi iz inozemnih izvora iznosili su {sumOthers}.",
    },
    type: {
      map: "Karta",
    },
    party: {
      subtitle:
        "Ukupno objavljene donacije za {party} prema državi podrijetla u {country}.",
    },
    country: {
      title: "Donacije iz {country}",
      subtitle:
        "Ukupno objavljene donacije prema državi podrijetla u {country}, {years}.",
      summary:
        "Između godina {from} i {until}, zabilježene su donacije iz {stateCount} različitih saveznih država. Država s najvišim iznosom donacija je {highestState} s {highestSum}. Većina donacija, točnije {largesDonationCountNum}, došla je iz {largesDonationCountState}.",
    },
    elsewhere: {
      title: "Donacije izvan {country}",
      summary:
        "Između godina {from} i {until}, zabilježene su donacije iz {countryCount} različitih zemalja. Zemlja s najvišim iznosom donacija je {highestCountry} s {highestSum}. Većina donacija, točnije {largesDonationCountNum}, došla je iz {largesDonationCountState}.",
    },
  },
  donor: {
    title: "Donacije od donatora",
    subtitle: "Ukupni doprinosi i primatelji",
    active_period: "Aktivno razdoblje",
    type: "Vrsta donatora",
    summary:
      "{donor} je dao ukupno {sum} u obliku {count} pojedinačnih donacija. Prosječna veličina donacije je {avg}. Donacije su raspoređene na {parties} različitih stranaka.",
    oldest:
      "Prva donacija nakon {minYear} dana je {date} u iznosu od {amount} stranci {party}.",
    newest:
      "Najnovija donacija dana je {date}, s {amount} upućenih stranci {party}.",
    most_donations: "Najčešće donacije dane su strankama {list}.",
    most_donations_item: "{party} ({count})",
    highest_most_donation:
      "Godinu {biggestYear} karakterizirao je najviši ukupni iznos donacija od {biggestSum}, dok je najviše pojedinačnih donacija ({mostCount}) dano u {mostYear}.",
    biggest:
      "Najveća pojedinačna donacija od {amount} otišla je stranci {party} dana {date}.",
    tree_map: "Donacije od {name}",
    tree_map_subtitle: "Ukupno objavljene donacije svakoj stranci u {country}.",
    biggest_amounts:
      "Donacije su uglavnom bile usmjerene prema odabranoj skupini stranaka. Dolje je prikaz primatelja prema iznosu i postotku ukupnog doniranog iznosa:",
    table:
      "Ovaj odjeljak pruža sveobuhvatan pregled svih pojedinačnih donacija koje je napravio {donor}. Možete sortirati tablicu po datumu, stranci ili iznosu kako biste lako istražili kako su donacije raspoređene tijekom vremena i između primatelja. Ovaj detaljan pregled omogućuje transparentno praćenje svakog doprinosa i nudi dublji uvid u obrasce davanja donatora.",
    timeline: {
      title: "Akumulacija donacija kroz vrijeme",
      p0: "Ovaj odjeljak prikazuje kako su se donacije od {donor} od {year} različitim političkim strankama mijenjale kroz vrijeme. Grafikon prikazuje ukupno donirani iznos, s istaknutim udjelom svake stranke, tako da je lako vidjeti kada i kamo je podrška usmjerena.",
      p1: "Pratite linije kako biste uočili obrasce, nagle poraste ili promjene u doniranju. Ovaj pregled nudi transparentan uvid u to kako su doprinosi jednog donatora raspoređeni kroz politički krajolik.",
      years:
        "Donacije su se mijenjale tijekom godina. Slijedi prikaz ukupnih iznosa donacija po godinama, kao i postotak koji svaka godina doprinosi ukupnim donacijama ovog donatora.",
      chart_subtitle:
        "Kumulativne donacije od {donor} političkim strankama u {country}, prikazane prema iznosu i datumu od {minYear}.",
    },

    anonymized: {
      title: "Zapis anonimiziran",
      description:
        "Osobni identitet povezan s ovom donacijom uklonjen je u skladu s važećim GDPR zahtjevom. Iznos donacije i dalje je uključen u ukupne izračune financiranja kako bi se održala financijska transparentnost.",
    },

    redacted: {
      title: "Zapis redigiran",
      description:
        "Identitet donatora redigirala je nadležna institucija prije objave ovih podataka. Iznos donacije i dalje je uključen u izračune ukupnog financiranja kako bi se očuvala financijska transparentnost.",
    },
  },
  countries: {
    "??": "Nije navedeno",
    DE: "Njemačka",
    DK: "Danska",
    CH: "Švicarska",
    TH: "Tajland",
    AT: "Austrija",
    UK: "Ujedinjeno Kraljevstvo",
    NL: "Nizozemska",
    EU: "Europska unija",
    LV: "Latvija",
    ES: "Španija",
    FI: "Finska",
    HR: "Hrvatska",
    BE: "Belgija",
    LU: "Luksemburg",
    SI: "Slovenija",
    EE: "Estonija",
    FR: "Francuska",
    IE: "Irska",
    IT: "Italija",
    PL: "Poljska",
    RO: "Rumunija",
    CY: "Kipar",
    MT: "Malta",
    PT: "Portugal",
    LT: "Litvanija",
    HU: "Mađarska",
    CZ: "Češka Republika",
    SG: "Singapur",
    MC: "Monako",
    SE: "Švedska",

    AD: "Andora",
    IM: "Otok Man",
    NO: "Norveška",
    LI: "Lihtenštajn",
    MK: "Makedonija",
    AL: "Albanija",
    MD: "Moldova",
    SM: "San Marino",
    FO: "Farski Otoci",
    BA: "Bosna i Hercegovina",
    ME: "Crna Gora",
    BG: "Bugarska",
    BY: "Bjelorusija",
    GR: "Grčka",
    IS: "Island",
    SK: "Slovačka",
    UA: "Ukrajina",
    GB: "Ujedinjeno Kraljevstvo",
    RS: "Srbija",
    AU: "Australija",
    ZA: "Južnoafrička Republika",
    US: "Sjedinjene Američke Države",
    CA: "Kanada",
    GE: "Gruzija",
    NZ: "Novi Zeland",
    VE: "Venezuela",
  },
  ref_countries: {
    DE: "Njemačka",
    DK: "Danska",
    CH: "Švicarska",
    TH: "Tajland",
    AT: "Austrija",
    UK: "Ujedinjeno Kraljevstvo",
    NL: "Nizozemska",
    EU: "Europska unija",
    LV: "Latvija",
    ES: "Španija",
    FI: "Finska",
    HR: "Hrvatska",
    BE: "Belgija",
    LU: "Luksemburg",
    SI: "Slovenija",
    EE: "Estonija",
    FR: "Francuska",
    IE: "Irska",
    IT: "Italija",
    PL: "Poljska",
    RO: "Rumunija",
    CY: "Kipar",
    CZ: "Češka Republika",
    AU: "Australija",
    RS: "Srbija",
    CA: "Kanada",
    GE: "Gruzija",
    NO: "Norveška",
  },
  state: {
    germany: {
      BW: "Baden-Württemberg",
      BY: "Bavarska",
      BE: "Berlin",
      BB: "Brandenburg",
      HB: "Bremen",
      HH: "Hamburg",
      HE: "Heska",
      MV: "Mecklenburg-Zapadna Pomeranija",
      NI: "Donja Saksonija",
      NW: "Sjeverna Rajna-Vestfalija",
      RP: "Rajna-Palatinat",
      SL: "Saar",
      SN: "Saska",
      ST: "Saska-Anhalt",
      SH: "Schleswig-Holštein",
      TH: "Tiringija",
    },
    austria: {
      "1": "Burgenland",
      "2": "Koruška",
      "3": "Donja Austrija",
      "4": "Gornja Austrija",
      "5": "Salzburg",
      "6": "Štajerska",
      "7": "Tirol",
      "8": "Vorarlberg",
      "9": "Beč",
    },
    canada: {
      ON: "Ontario",
      QC: "Québec",
      NS: "Nova Škotska",
      NB: "Novi Brunswick",
      MB: "Manitoba",
      BC: "Britanska Kolumbija",
      PE: "Otok princa Edwarda",
      SK: "Saskatchewan",
      AB: "Alberta",
      NL: "Newfoundland i Labrador",
      NT: "Sjeverozapadni teritoriji",
      YT: "Yukon",
      NU: "Nunavut",
    },
  },
  about: {
    title: "O nama",
    description: {
      p0: "DonationWatch je nastao iz frustracije zbog nedostatka lako čitljivih podataka na službenoj stranici njemačkog Bundestaga.",
      p1: "Naš cilj je poboljšati ovu situaciju korištenjem javno dostupnih podataka i njihovim učinkovitijim predstavljanjem.",
      p2: "Primijetili smo da zemlje poput Austrije, Švicarske i Nizozemske objavljuju svoje političke donacije u raznim strukturiranim formatima. Kako bismo stvorili ujedinjeno sučelje koje pojednostavljuje pristup tim informacijama, uključili smo te zemlje u naš projekt. Više zemalja bit će dodano dok budemo pronalazili i obrađivali relevantne podatke.",
      p3: "Ako imate bilo kakve prijedloge ili povratne informacije, slobodno",
      mail: "kontaktirajte nas",
    },
    source:
      "Sve vizualizirane informacije dolaze isključivo iz javno dostupnih vladinih izvora, ne uključujući prethodno neobjavljene podatke ili privatne evidencije. Transparentnost je naš temelj",
  },
  imprint: {
    title: "Impressum",
  },
  privacy: {
    title: "Politika privatnosti",
    last_updated: "Posljednje ažuriranje: {date}",
    effective_date: "Datum stupanja na snagu: {date}",
    data: {
      title: "1. Prikupljanje podataka",
      p: "Ne prikupljamo nikakve osobne podatke od posjetitelja naše web stranice. To uključuje:",
      li0: "Nema obrazaca za registraciju",
      li1: "Nema prijava za newsletter",
      li2: "Nema korisničkih računa",
      li3: "Nema kolačića za svrhe praćenja",
    },
    cf: {
      title: "2. Cloudflare usluge",
      link: "Pogledajte Cloudflareovu politiku privatnosti",
      p: "Koristimo dvije Cloudflare usluge:",
      workers: {
        summary:
          "Cloudflare Workers: Serverless platforma za isporuku sadržaja (bez obrade korisničkih podataka)",
      },
      analytics: {
        summary:
          "Cloudflare Web Analytics: Analitika fokusirana na privatnost koja:",
        li0: "Ne koristi kolačiće",
        li1: "Prikuplja samo agregirane metrike",
      },
    },
    logs: {
      title: "3. Automatski zapisi poslužitelja",
      p: "Naš pružatelj hostinga može prikupljati:",
      li0: "IP adrese (anonimizirane)",
      li1: "Vremenske oznake zahtjeva",
      li2: "Vrste preglednika/uređaja",
      retention: "Ovi podaci se automatski brišu unutar 7 dana.",
    },
    contact: {
      title: "Kontakt",
      p: "Za pitanja o privatnosti:",
    },
  },
  fun: {
    link: "Zanimljivosti",
    title: "Zanimljivosti o javnim podacima",
    p0: "Ova stranica prikazuje zanimljive nalaze iz našeg rada s javno dostupnim vladinim podacima. Ova zapažanja nisu kritike, već manje posebnosti koje se mogu pojaviti u bilo kojem velikom skupu podataka.",
    p1: "Iako prijavljujemo probleme kada je to prikladno, ne smatramo ih hitnim pitanjima koja vladine institucije trebaju rješavati. Prema našem iskustvu, ove organizacije su prijemčive i otvorene za povratne informacije.",
    reported_fixed: "Ovo je prijavljeno {owner} i oni su to ispravili.",
    reported_wontfix:
      "Ovo je prijavljeno {owner} i oni to ne mogu promijeniti.",
    reported: "Ovo je prijavljeno {owner}.",
  },
  transparency: {
    title: "Transparentnost",
    p0: "Nastojimo pružiti jasne i dosljedne informacije o donatorima političkih stranaka. Da bismo to postigli, automatski normaliziramo određena imena donatora kako bismo osigurali ujednačenost u našoj bazi podataka. Ovaj pristup nam omogućuje održavanje točnosti uz istovremeno uzimanje u obzir neslaganja u načinu na koji imena mogu biti zabilježena.",
    p1: "Radi transparentnosti sastavili smo popis normaliziranih imena zajedno s njihovim varijacijama koje smo pronašli u našim zapisima o donacijama. U nastavku ćete pronaći svako normalizirano ime uz njegove varijacije. Ovaj popis pomaže objasniti zašto moguće vidite imena donatora koja nisu u potpunosti ista kao u našim izvornim dokumentima.",
    section: {
      filtered_donors: "Filtrirani donatori",
      filtered_receivers: "Filtrirani primatelji",
      aggregated: "Agregirani donatori",
    },
    filtered_donors: {
      p0: "Kako bismo točno prikazali stvarne izvore političkih donacija, filtriramo određene transakcije koje su zapravo državna davanja, a ne stvarne donacije. Budući da ih naši izvorni skupovi podataka ne označavaju izričito, oslanjamo se na skup pravila filtriranja temeljenih na regularnim izrazima (regexp) kako bismo takve zapise automatski prepoznali i uklonili. U nastavku možete pregledati potpuni popis primijenjenih regexp pravila filtriranja.",
      p1: "U nastavku je popis donatora čiji su doprinosi filtrirani prema našim kriterijima i pravilima filtriranja.",
    },
    filtered_receivers: {
      p0: "Kako bismo osigurali da prikazujemo samo smislenе podatke o primateljima, filtriramo i određene primatelje ili stranke koje se smatraju nerelevantnima ili neoperativnima za potrebe praćenja donatora. Budući da naši skupovi podataka ne označavaju uvijek te primatelje izričito, primjenjujemo skup pravila temeljenih na regexp-u kako bismo ih automatski isključili.",
      p1: "U nastavku možete pregledati potpuni popis primijenjenih regexp pravila filtriranja.",
    },
    receivers: {
      title: "Agregirani primatelji",
      p0: "U zemlji {country} donacije se mogu prijavljivati različitim organizacijskim jedinicama unutar stranke. Radi dosljednosti objedinjujemo povezane entitete primatelja u jedan ukupni iznos na razini stranke. Popis u nastavku dokumentira koji su entiteti primatelja agregirani u svaku stranku.",
    },
  },
  related: {
    donors: "Slični donatori",
  },
  similar_donors: {
    title: "Mreža sličnih donatora",
    description: "Istražite širu mrežu donacija povezanu s ovim donatorom.",
    summary:
      "U povezanoj mreži donacija nalazi se {count} jedinstvenih donatora.",
    list_title: "Pregled raspodjele po strankama",
  },

  detect_country: {
    title: "Čini se da ste u državi {country}.",
    description: "Dodirnite za pregled političkih donacija u {country}.",
    action: "Pogledaj donacije za {country}",
  },

  donor_type: {
    [DonorType.PublicFund]: "Javni fond",
    [DonorType.Individual]: "Pojedinac",
    [DonorType.Company]: "Tvrtka",
    [DonorType.Other]: "Ostalo",
    [DonorType.TradeUnion]: "Sindikata",
    [DonorType.UnincorporatedAssociation]: "Neinkorporirana udruga",
    [DonorType.RegisteredPoliticalParty]: "Registrirana politička stranka",
    [DonorType.Trust]: "Povjerenje",
    [DonorType.FriendlySociety]: "Dobrotvorno društvo",
    [DonorType.LimitedLiabilityPartnership]:
      "Partnersko društvo s ograničenom odgovornošću",
    [DonorType.BuildingSociety]: "Stambena štedionica",
    [DonorType.NonProfitLegalEntity]: "Neprofitna pravna osoba",
    [DonorType.AnonymizedDonor]: "Anonimizirani donator",
  } satisfies Record<DonorType, string>,

  other_countries: {
    title: "Druge zemlje",
  },

  thanks:
    "Zahvaljujemo organizacijama poput {external} na pružanju vrijednih informacija o mehanizmima političkih donacija.",

  export: {
    title: "Izvoz podataka",
    p0: "Preuzmite cjeloviti skup podataka o političkim donacijama za {country} koji se koristi na ovoj stranici. Izvoz uključuje normalizirana imena donatora, iznose, datume i stranke primateljice.",
    p1: "Važno: Ovo nisu sirovi podaci iz {source}. Ovaj skup podataka sadrži samo donacije koje je naš tim normalizirao i filtrirao. Molimo pogledajte naš odjeljak {transparency} za metodologiju.",
    license: "Licenca: {license}",
    download: "Preuzmi {format}",
    includes_donations: "Uključeno donacija: {num}",
  },
  bar_chart_race: {
    title: "Utrka stupčastog grafikona",
    description:
      "Vizualizirajte akumulaciju donacija kroz vrijeme. Odaberite raspon godina kako biste vidjeli kako se financiranje stranaka dinamično mijenja.",
    from: "Od",
    to: "Do",
    download_video: "Preuzmi video",
    rendering: "Renderiranje... {percentage}",
    no_data: "Nema dostupnih podataka za odabrani raspon.",
    note: "Napomena: Ova se animacija renderira na strani klijenta u vašem pregledniku i na nekim uređajima može biti zahtjevna za resurse. Preuzimanje videozapisa automatski će reproducirati cijelu animaciju.",
    individual_years: "Pojedinačne godine",
    animation_duration: "Trajanje animacije",
    duration_s: "{seconds}s",
    group_by: {
      label: "Grupiraj prema",
      receiver: "Stranka",
      donor: "Donator",
    },
  },
};

export default Hr;
