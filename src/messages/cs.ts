import { DonorType } from "../utils/types";

const Cs = {
  copyright: "Autorská práva",
  charts_license: "Grafy licencovány {license} s uvedením autorství",
  data_error: "Data se nepodařilo načíst",
  description:
    "DonationWatch poskytuje jasný přehled o dárcích a stranách, což usnadňuje pochopení politického financování díky jednoduchému vysvětlení složitých dat.",
  title: "Dary stranám {country}",
  sum: "Součet",
  donation_count: "Počet darů",
  average: "Průměr",
  donations_by_party: "Dary podle strany",
  donations_per_year: "Dary za rok",
  party_donations: "Dary stranám",
  more: "Více",
  loading: "Načítání obsahu",
  data_since: "Od roku {year}",
  view_party: "Zobrazit stránku strany {party}",
  faq: "Často kladené otázky",
  sidebar: {
    toggle: "Přepnout postranní panel",
    donations: "Dary",
    all_countries: "Všechny země",
    tools: "Nástroje",
    show_all: "Zobrazit vše ({num})",
    show_less: "Zobrazit méně",
  },
  search: {
    filter: "Vyhledávání...",
    filter_description: "Vyhledávání stran, let nebo dárců",
    parties: "Strany",
    years: "Roky",
    legislative_years: "Legislativní roky",
    empty: "Nebyly nalezeny žádné výsledky",
    donors: "Dárci",
  },
  page_title: {
    years: {
      description:
        "V roce {year} obdrželo {parties} stran v {country} celkem {sum} z {count} darů nad {minAmount}. Prozkoumejte podrobné rozdělení podle strany, dárce a trendů ve financování politiky.",
      overview:
        "Přehled politických stranových darů v {country} pro rok {year}",
      changes:
        "Nedávné změny v politických stranových darech v {country} pro rok {year}",
      donors: "Největší dárci politickým stranám v {country} pro rok {year}",
      timeline:
        "Časová osa politických stranových darů v {country} pro rok {year}",
      origin: "Geografický přehled darů stran v {country} pro rok {year}",
    },
    party: {
      donors: "Největší dárci strany {party} {country}",
      changes: "Nedávné změny v darech strany {party} {country}",
      timeline: "Časová osa darů strany {party} {country}",
      origin: "Geografický přehled darů strany {party} {country}",
      description:
        "Od roku {year} obdržela {party} celkem {count} darů převyšujících {minimumAmount}, v celkové výši {sum}. Prozkoumejte podrobné informace o hlavních dárcích a trendech darování {party} v {country}.",
    },
    donor: {
      overview: "Dary od {donor} v {country}",
      description:
        "{donor} daroval celkem {sum} v rámci {count} darů nad {minAmount} od roku {minYear}. Tyto příspěvky byly rozděleny mezi {parties} různé strany. Prozkoumejte podrobné informace o vzorcích darování a příjemcích tohoto dárce v zemi {country}.",
    },
  },
  chart: {
    save_as_image: "Uložit jako obrázek",
    toggle_fullscreen: "Přepnutí na celou obrazovku",
    reset_zoom: "Obnovení zoomu",
  },
  over_min_public_amount: "více než {amount}",
  over_threshold: "pouze strany s ≥ {count} dary nebo ≥ {sum}",
  prelim_data: "předběžná data od roku {year}",
  excludes_year_only_donations: "vylučuje dary s rokem jako datem",
  common: {
    date: "Datum",
    party: "Strana",
    donor: "Dárce",
    amount: "Částka",
    anonymizedDonor: "Anonymizovaný dárce",
    redactedDonor: "Redigovaný dárce",
  },
  sort: {
    asc: "Řadit vzestupně",
    desc: "Řadit sestupně",
    clear: "Zrušit řazení",
  },
  footer: {
    sources: "Zdroje",
    build: "Stav {date}",
    build_since: "Od {date}, od roku {year}",
    published_by: "Jak bylo zveřejněno {source}",
  },
  header: {
    home: "Domů",
    language_selection: "Výběr jazyka",
    country_selection: "Výběr země",
  },
  actions: {
    close: "Zavřít",
    play: "Přehrát",
    pause: "Pozastavit",
    restart: "Restartovat",
  },
  donor_dialog: {
    title: "Informace o dárci",
    summary: "Shrnutí",
  },
  donation_dialog: {
    title: "Detaily daru",
    donor: "Dárce",
    country: "Země",
    state: "Stát",
    receiver: "Příjemce",
    donation_amount: "Částka daru",
    date: "Datum",
  },
  root: {
    title: "Open source sledovač darů politickým stranám",
    subtitle:
      "Sledujte a prozkoumejte politické dary napříč více zeměmi. Pochopte, kdo financuje politické strany a jak peníze proudí po celém světě.",
    stats: {
      countries: "Pokryté země",
      parties: "Politické strany",
      donations: "Jednotlivé dary",
      currencies: "Sledované měny",
    },
    countries: {
      title: "Prozkoumejte politické dary podle zemí",
      subtitle:
        "Vyberte zemi a získejte přístup k podrobným záznamům o darech, údajům o financování stran a informacím o dárcích.",
    },
    why: {
      title: "Proč je transparentnost politických darů důležitá",
      p0: "Demokracie závisí na informovaných občanech. Tím, že zpřístupňujeme data o politických darech a umožňujeme je snadno prozkoumávat, pomáháme lidem porozumět finančním vztahům, které utvářejí jejich politické prostředí. Transparentnost ve financování politiky buduje důvěru, posiluje odpovědnost a umožňuje voličům činit informovaná rozhodnutí.",
    },
    open_source: {
      title: "Open Source",
      p0: "DonationWatch je open source. Na {github} si můžete prohlédnout kód, nahlásit problémy nebo přispět.",
    },
  },
  home: {
    most_recent: "Nejnovější dary",
    hero: {
      subtitle: "Sledování darů politických stran v {country}",
      subtitle_no_country: "Sledování darů politických stran",
    },
    biggest_donations: {
      text: "Od roku {minYear} dosáhl největší zveřejněný jednotlivý dar v {country} částky {amount} od {donor} pro {party} v roce {year}. Následují {others}.",
      list: "{amount} od {donor} pro {receiver}",
    },
    last_period: "Nejnovější rok:",
    previous_period: "Dary z předchozího roku.",
    what: {
      title: "Co je to?",
      summary:
        "Dary stranám jsou důležitou součástí politiky. Jsou významným indikátorem politické podpory.\n\nSnažíme se tato data zobrazit přehledně a srozumitelně.",
      threshold:
        "Vzhledem k velkému počtu menších politických stran sledujeme pouze dary pro strany, které splňují specifický práh. Aktuální práh je nastaven na {count} darů nebo celkovou částku {sum} příspěvků pro danou stranu, bez ohledu na velikost jednotlivých darů.",
      source: {
        austria:
          "Zde použité údaje pocházejí z rakouského Účetního dvora a zahrnují všechny stranické dary zdokumentované od roku 2012.\n" +
          "\n" +
          "Upozornění: Před 8. červencem 2019 musely politické strany hlásit rakouskému účetnímu dvoru individuální dary nad 51 000 eur (do roku 2018 nad 50 000 eur). Od července 2019 je limit pro vykazování 2 500 eur.\n" +
          "\n" +
          "Údaje stran se obvykle aktualizují čtvrtletně.",
        germany:
          "Data zde použitá pocházejí od Německého spolkového sněmu a zahrnují všechny stranické dary zaznamenané od roku 2010 nad 50 000 € a od 5. března 2024 nad 35 000 €.",
        switzerland:
          "Data zde použitá pocházejí od Švýcarského federálního kontrolního úřadu a zahrnují všechny stranické dary zaznamenané od roku 2023.",
        netherlands:
          "Zde uvedené informace pocházejí od vlády Nizozemska a zahrnují všechny politické dary zaznamenané od roku 2022, které přesahují 1 000 €, jak je uvedeno ve výroční zprávě „Overzicht van giften aan politieke partijen en hun neveninstellingen“.\n\nPro aktuální rok jsou zahrnuty pouze dary přesahující 10 000 €, na základě datové sady „Overzicht substantiële giften aan politieke partijen“.\n\nUpozornění: Některé dary neobsahují konkrétní údaje o datu a proto nejsou zahrnuty do časových řad nebo jiných vizualizací založených na datech.\n\nDary vykázané pro SP a GL se mohou zdát relativně vysoké, protože obě strany požadují, aby jejich poslanci a administrátoři přispívali významnou část svého platu straně.",
        europeanunion:
          "Zde uvedené údaje pocházejí od Úřadu pro evropské politické strany a evropské politické nadace a zahrnují všechny zdokumentované dary stran a nadací od roku 2018. Vzhledem k významu evropských politických nadací sledujeme a zobrazujeme jejich dary podobně jako dary evropských politických stran.\n" +
          "\n" +
          "Vzhledem k tomu, že oficiální údaje neobsahují data, nejsou k dispozici žádné časové řady ani podobné vizuální znázornění.\n" +
          "\n" +
          "Upozorňujeme, že v období před volbami do Evropského parlamentu v roce 2024 (od 6. prosince 2023 do 10. června 2024) platily zvláštní požadavky na vykazování darů, kdy úřad podával zprávy každý týden a včas je zveřejňoval.\n" +
          "Od 10. června 2024 je třeba neprodleně hlásit pouze dary nad 12 000 eur. Ostatní dary budou k dispozici až po předložení roční účetní závěrky.",
        estonia:
          "Zde použité údaje pocházejí z estonského Výboru pro monitorování financování politických stran a zahrnují všechny politické dary zdokumentované od roku 2014, které přesahují 1 euro.\n" +
          "\n" +
          "Politické strany v Estonsku jsou povinny čtvrtletně vykazovat své příjmy včetně přijatých darů.\n" +
          "Údaje na internetových stránkách výboru jsou odpovídajícím způsobem čtvrtletně aktualizovány.",
        czechrepublic:
          "Použitá data pocházejí z Úřadu pro dohled nad hospodařením politických stran a politických hnutí a zahrnují všechny politické dary, které jsou tam od roku 2018 zdokumentovány a přesahují 25 Kč.\n" +
          "\n" +
          "Tento rozsah také zahrnuje všechny příspěvky stranám nebo politickým hnutím, které buď obdržely více než 100 individuálních darů, nebo překročily celkovou částku darů ve výši 1 milionu Kč, bez ohledu na velikost jednotlivých příspěvků. Data jsou aktualizována jednou ročně.\n" +
          "Určení typu dárce je založeno na identifikaci dárce jako fyzické osoby, pokud jsou vyplněna pole firstName i lastName.",
        latvia:
          "Zde použité údaje pocházejí z Úřadu pro prevenci a boj proti korupci a zahrnují všechny politické dary zdokumentované od roku 2015, které přesahují 1 EUR.",
        australia:
          "Zde použité údaje pocházejí z Australian Electoral Commission (AEC), konkrétně ze souboru „Donations Made Details“, který AEC zveřejňuje. Zahrnuje všechny politické dary v něm evidované od roku 2014, přesahující €1.\n" +
          "\n" +
          "Je dobré upozornit, že dataset AEC může obsahovat některé překlepy, což může vést k tomu, že některé dary nebudou zahrnuty nebo nebudou správně přiřazeny ke konkrétní straně kvůli nekonzistencím při zadávání dat. Roční zveřejnění AEC jsou navíc vydávána každý rok 1. února, ale data neposkytují úplný obraz všech příspěvků kvůli prahu pro zveřejnění ve výši $15,000.\n" +
          "\n" +
          "Typy dárců se klasifikují porovnáním názvů dárců. Všechny běžné odborové svazy jsou ručně mapovány na typ dárce „Odbory“. Společnosti se rozpoznávají kontrolou konkrétních firemních identifikátorů v názvu dárce: „Pty“ (Proprietary), „Ltd“ na konci názvu, „Corporation“ nebo „Corp“.",
        unitedkingdom:
          "Zde použité údaje pocházejí od volební komise a zahrnují všechny politické dary, které byly zdokumentovány od roku 2010 a přesahují 1 000 liber.\n" +
          "\n" +
          "Údaje o darech jsou aktualizovány čtvrtletně.",
        serbia:
          "Údaje zde použité nepocházejí od vlády, ale od neziskové organizace „Centrum pro investigativní žurnalistiku Srbska“ („Centar za istraživačko novinarstvo Srbije“ - CINS), která laskavě shromáždila údaje o darech Srbské protikorupční agentury.\n" +
          "\n" +
          "Tyto údaje zahrnují všechny politické dary zdokumentované tamtéž od roku 2015.\n" +
          "\n" +
          "Vzhledem k tomu, že soubor dat neposkytuje konkrétní informace o datu jednotlivých darů, není bohužel možné zobrazit časové osy ani jiné časové vizualizace.",
        croatia:
          "Zde použitá data pocházejí ze Státní volební komise Chorvatské republiky (DIP) a zahrnují všechny politické dary s peněžní hodnotou přesahující 1 €, které jsou dokumentovány od roku 2019.\nDatová sada používá pro každý vykazovaný rok pouze poslední zveřejněný dokument o darech (podle údajů izbori), aby se předešlo duplicitám z dřívějších verzí zprávy za tentýž rok.\nVšechny dary jsou zobrazeny v eurech, zatímco podkladová datová sada používá do roku 2024 kuny. Dary původně poskytnuté v kunách se převádějí na eura pomocí přibližných směnných kurzů pro každé pololetí období 2019–2024: H1 (0.1340, 0.1335, 0.1332, 0.1329, 0.1326) a H2 (0.1341, 0.1338, 0.1334, 0.1327, 0.1328).",
        canada:
          "Zde použité údaje pocházejí od Elections Canada a jsou založeny na datovém souboru „contributions as submitted“. Zahrnují všechny politické dary s peněžní hodnotou přesahující 500 €, které byly zaznamenány od roku 2015. Zahrnuty jsou všechny položky, které jsou součástí zprávy „Statement of Contributions Received“ z volební události „Annual“ pro „Registered parties“.",
        georgia:
          "Zde uvedené informace pocházejí z Úřadu pro boj s korupcí (ანტიკორუფციული ბიურო﻿) Gruzie a zahrnují všechny politické dary zaznamenané od roku 2011, které přesahují 1 GEL. Datový soubor obsahuje pouze příspěvky klasifikované jako typ #10 (Finanční dary) nebo typ #16 (Finanční dary od právnických osob).",
        norway:
          "Zde použitá data pocházejí z oficiálních publikací o financování politických stran od Statistics Norway (SSB) a Partifinansiering.no. Uvedené součty jsou agregovány z více nahlášených přijímajících subjektů (například centrálních, regionálních, místních a mládežnických jednotek) do jediného celku za každou stranu, přičemž podkladové mapování příjemců zůstává k dispozici pro transparentnost.\n\nDatová sada pro Norsko je aktualizována v ročním cyklu a odráží tak tempo zveřejňování těchto podkladových údajů.",
      },
      source_link: "Zdroj dat",
    },
    list: {
      subtitle: "Legislativní období",
      title: "Předchozí legislativní období",
      summary:
        "Náš přehled legislativních období poskytuje celkový přehled všech darů během legislativního období. Klikněte na kartu pro zobrazení detailů konkrétního legislativního období.",
    },
    years: {
      title: "Roční přehled darů",
      subtitle: "Agregované součty v průběhu roku",
      more: "Zobrazit všechna ostatní léta",
      summary:
        "Náš roční přehled darů poskytuje souhrn všech darů pro každý rok. Klikněte na kartu pro zobrazení detailního přehledu roku.",
    },
    parties: {
      title: "Dary stranám",
      subtitle: "Detaily jednotlivých stran",
      more: "Zobrazit všechny ostatní strany",
      summary:
        "Náš přehled darů představuje kumulativní zobrazení všech darů pro každou stranu. Klikněte na kartu pro zobrazení detailních informací o darech.",
    },
    donors: {
      title: "Dary dárců",
      subtitle: "Podrobnosti o jednotlivých dárcích",
      summary:
        "Objevte náš přehled dárců, který ukazuje nejvýznamnější finanční přispěvatele od roku {minYear}. Kliknutím na dárce zobrazíte podrobné informace o jeho příspěvcích.",
    },
    stacked_years: "Výše příspěvku za rok",
    stacked_years_subtitle:
      "Agregovaný součet zveřejněných příspěvků v {country}, podle roku od {years}.",
  },
  years: {
    title: "Dary stranám",
    subtitle:
      "Kumulativní součet zveřejněných darů každé straně v {country}, {years}.",
    goto_year: "Přejít na {year}",
    no_data: {
      title: "Žádná data k dispozici",
      summary:
        "Je nám líto, ale zatím nemáme žádné údaje o darech pro rok {year}.",
      last_year: "Případně se podívejte na údaje z roku {year}.",
    },
  },
  overview: {
    title: "Přehled",
    detail: {
      title: "Top politické strany a jejich celkové dary",
      summary:
        "Tento seznam představuje hlavní politické strany a jejich kumulované dary v určitém období, seřazené podle výše darů.",
      summary2:
        "V letech {years} obdrželo celkem {partyCount} stran od {donationCount} darů přes {minimumAmount} celkovou částku {donationSum}.",
      most_donations:
        "{party} obdržela nejvíce darů s celkovým počtem {count} příspěvků a celkovou částkou {sum}.",
      highest_sum: "5 stran s nejvyšším celkovým objemem darů jsou {parties}.",
    },
    scatter: {
      title: "Distribuce darů",
      subtitle:
        "Individuální dary každé straně podle částky a četnosti v {country} od {years}.",
      summary:
        "Přehled distribuce darů stran nabízí stručnou analýzu rozložení darů mezi různými politickými stranami. Každý bod představuje stranu, kde osa x ukazuje částky darů a rozptyl udává četnost darů.",
      span: "Největší rozdíl v darech zaznamenala strana {biggestSpanParty}, kde rozdíl mezi nejmenším a největším darem činil {biggestSpanAmount}.",
    },
    pie: {
      title: "Distribuce darů stran",
      subtitle: "Celkové zveřejněné dary každé straně, {country}, {years}.",
    },
  },
  changes: {
    title: "Změny",
    description:
      "Prozkoumejte podrobnou tabulku darů politickým stranám v {country} za rok {year}, pouze příspěvky nad {minAmount}, seřazené podle data transakce, s informacemi o dárci a částce.",
    detail: {
      title: "Dary stranám podle data transakce",
      summary:
        "Na této stránce jsou Dary stranám seřazeny podle data transakce, přičemž nejnovější dary jsou uvedeny nahoře. Jsou zde uvedeny informace o tom, kolik peněz každá strana od jakého dárce obdržela.",
    },
  },
  donors: {
    title: "Dárci",
    description:
      "Zobrazte si úplný seznam dárců za rok {year} politickým stranám v {country}. Zjistěte, kdo daroval nejvíce a kolik každý přispěl.",
    detail: {
      title: "Dary od dárců politickým stranám",
      subtitle:
        "Celkové zveřejněné příspěvky jednotlivých dárců každé politické straně v {country}, {years}.",
      summary:
        "Mapa stromů vizualizuje dary stran v přehledném zobrazení. Na nejvyšší úrovni jsou zobrazeni jednotliví dárci, kteří jsou znázorněni obdélníky, jejichž velikost je úměrná výši jejich darů.",
      summary2:
        "Pod každým dárcem jsou další obdélníky představující příslušné strany, které jsou příjemci daru. Toto hierarchické uspořádání poskytuje rychlý přehled o rozložení darů a na první pohled ukazuje, kolik příjemců jednotliví dárci podpořili.",
      unique_donors: "Počet různých dárců v roce {years} činí {count} dárců.",
      biggest_donor: "Nejvyšší celkový dar ve výši {amount} poskytl {donor}.",
      most_donations:
        "{donor} je s {count} dary (celková částka: {sum}) na prvním místě v žebříčku nejčastějších individuálních dárců.",
      most_unique_parties:
        "{donor} poskytla dary celkem {count} různým stranám (celková částka: {sum}), což ukazuje největší rozmanitost mezi příjemci darů.",
      top_3: "V letech {years} jsou největšími {amount} dárci: {donors}.",
    },
    list: {
      title: "Nejlepší jednotliví dárce podle celkových příspěvků",
      p0: "Tato část představuje seřazený seznam všech jednotlivých dárců v rámci vybraných let, seřazený podle kumulativního součtu jejich publikovaných darů. Tím jsou zvýrazněni dárci, kteří přispěli nejvíce.",
    },
    sankey: {
      title: "Sankeyho diagram",
    },
    histogram: {
      title: "Rozdělení dárců podle počtu jedinečných příjemců",
      subtitle:
        "Počet jedinečných politických stran, které obdržely zveřejněné příspěvky od jednotlivých dárců v {country}, {years}.",
      p0: "Tento graf poskytuje přehled o tom, jak jednotliví dárci rozdělují své příspěvky mezi politické strany, a ukazuje, zda mají tendenci soustředit svou podporu na jednu stranu nebo ji v průběhu času rozdělovat mezi více stran.",
      p1: "V roce {years} byl nejvyšší počet různých stran, které podpořil jeden dárce, {max}. Pouze {donors} dárce přispěl na {max} stran. V průměru každý dárce podpořil {mean} stran (medián: {median}).",
      p2: "Z {totalDonors} dárců přispělo {singlePartyDonors} pouze jedné straně, což představuje {percentage} dárců.",
      tooltip: "{donors} dárců • {parties} jedinečných stran",
      item: "{donors} dárců přispělo na {parties} stran",
    },
  },
  timeline: {
    title: "Vývoj",
    description:
      "Zobrazte časovou osu všech darů politickým stranám v {country} za {years}, s měsíčními součty a trendy v průběhu let.",
    detail: {
      title: "Časový průběh darů stranám",
      summary:
        "Prohlédněte si interaktivní čárový graf níže, abyste sledovali historii darů každé politické strany v průběhu času. Osa x představuje data, zatímco osa y zobrazuje částky darů. Každá politická strana je zobrazena samostatnou čarou, která se zvyšuje s každým darem.",
    },
    days: "V zemi {country} byly během {years} zaznamenány dary ve {n} různých dnech.",
  },
  per_year_party: {
    title: "Dary pro {party} za rok",
    subtitle:
      "Roční součet zveřejněných darů pro {party} v {country}, {years}.",
  },
  per_month: {
    title: "Dary za měsíc",
    subtitle:
      "Měsíční součet zveřejněných darů každé straně v {country}, {years}.",
    description:
      "Tento sloupcový graf znázorňuje údaje o měsíčních darech pro více politických stran. Osa x znázorňuje měsíce, osa y představuje částky darů a každý sloupec je barevně rozdělen, aby zobrazoval příspěvky jednotlivých stran, což umožňuje snadné porovnání darů stran v rámci jednotlivých měsíců i mezi nimi.",
    highest_sum:
      "{month} měl nejvyšší celkový počet darů, a to {count} dary v celkové výši {sum}.",
    most_months:
      "{party} obdržela dary v {count} měsících, což je nejvíce měsíců s příspěvky zevšech stran.",
    month_most_donations:
      "Měsíc s nejvyšším počtem darů byl {month}, kdy bylo získáno celkem {count} individuálních darů.",
  },
  party: {
    donors: {
      title: "Dárci pro {party}",
      subtitle:
        "Celkové zveřejněné příspěvky jednotlivých dárců straně {party} v {country}.",
      summary:
        "Tato stránka prezentuje všechny oficiálně zveřejněné dary nad {minSum} pro {party} od roku {minYear}, seskupené podle dárců pro zobrazení celkových příspěvků v čase. Všechny údaje jsou založeny na oficiálních zveřejněních publikovaných {source}, zobrazené jak jako treemap pro vizuální srovnání, tak jako rozbalitelný seznam podkladových transakcí.",
    },
    donor_types: {
      title: "Typy dárců",
      treemap: {
        title: "Typy dárců pro {party}",
        description:
          "Celkové zveřejněné příspěvky {party} v {country} podle typu dárce.",
      },
      p0: "Tento stromový diagram seskupuje nahlášené politické dary podle typu dárce (například jednotlivci, společnosti a veřejné fondy) a velikost každého obdélníku odpovídá celkové částce v daném období a rozsahu.",
      p1: "Větší boxy označují vyšší částky a jména zobrazená uvnitř představují největší dárce v daném typu. Tento pohled zahrnuje {count} různých typů dárců pro {party}.",
      p2: "Níže je seznam sektorů seřazených podle celkových příspěvků od nejvyšších po nejnižší:",
    },
    qa: {
      sum: {
        q: "Kolik obdržela {party} na darech?",
        a: "{party} obdržela celkem {sum} na darech z {count} zdokumentovaných darů.",
      },
      top_donors: {
        q: "Kdo jsou největší dárci {party}?",
        a: "Největší dárci {party} jsou: {donors}.",
      },
      largest_singular: {
        q: "Jaký byl největší jednotlivý dar pro {party}?",
        a: "Největší jednotlivý dar byl {amount} od {donor} dne {date}.",
      },
      biggest_overall: {
        q: "Kdo je největší celkový dárce {party}?",
        a: "Největší celkový dárce {party} je {donor} s celkovými dary {sum}.",
      },
      frequent_donor: {
        q: "Kdo poskytl nejvíce darů {party}?",
        a: "{donor} poskytl nejvíce darů {party} s {count} samostatnými dary v celkové výši {sum}.",
      },
    },
    overview: {
      title: "Přehled darů {party}",
    },
    changes: {
      detail: {
        title: "Dary {party} podle data transakce",
        summary:
          "Tato stránka zobrazuje seznam darů {party}, které jsou seřazeny podle data transakce, přičemž nejnovější dary jsou uvedeny nahoře. Poskytuje informace o částce, kterou každý dar znamená pro {party}, a odpovídajících dárcích.",
      },
    },
    timeline: {
      chart_title: "Dary {party}",
      subtitle:
        "Kumulativní součet zveřejněných darů straně {party} v {country}.",
      detail: {
        title: "Časový průběh darů {party}",
        summary:
          "Prozkoumejte interaktivní spojnicový graf a sledujte historii darů pro {party} v čase. Osa x představuje data, zatímco osa y ukazuje darovanou částku. {party} je znázorněna samostatnou čárou, která se s každým darem zvyšuje.",
        per_year:
          "Celková výše darů přijatých stranou {party} se liší podle roku. Níže je historický přehled ročních součtů financování uvedených stranou. Tento seznam sleduje součet všech ohlašovatelných příspěvků a finanční podpory pro každý konkrétní rok:",
      },
    },
  },
  origin: {
    title: "Původ",
    description:
      "Podívejte se, odkud pocházejí dary politickým stranám v {country} za {years} – rozdělení podle státu a mezinárodních příspěvků.",
    detail: {
      title: "Přehled původu darů",
      description:
        "Podívejte se na transparentní původ politických darů pro {party} v {country}: rozdělení podle států a zahraničních zdrojů.",
      summary:
        "Získejte přehled o geografickém původu darů. Zjistěte, z kterých spolkových zemí nebo zemí mimo {country} přichází podpora. Sledujte transparentně, jak jsou dary geograficky rozloženy.",
      country: {
        austria:
          "V Rakousku je původ darů zaznamenáván až od roku 2023. Všechny starší dary proto nemohou být přiřazeny jednotlivým spolkovým zemím.",
      },
      sum: "V roce {years} činily dary politickým stranám v {country} z domácích zdrojů celkem {sumCountry}. Příspěvky ze zahraničních zdrojů dosáhly výše {sumOthers}.",
    },
    type: {
      map: "Mapa",
    },
    party: {
      subtitle:
        "Celkové zveřejněné dary straně {party} podle státu původu v {country}.",
    },
    country: {
      title: "Dary z {country}",
      subtitle:
        "Celkové zveřejněné dary podle státu původu v {country}, {years}.",
      summary:
        "V letech {from} až {until} byly zaznamenány dary z {stateCount} různých spolkových zemí. Spolková země s nejvyšší částkou darů je {highestState} s {highestSum}. Nejvíce darů, konkrétně {largesDonationCountNum}, pocházelo z {largesDonationCountState}.",
    },
    elsewhere: {
      title: "Dary ze zahraničí",
      summary:
        "V letech {from} až {until} byly zaznamenány dary z {countryCount} různých jiných zemí. Země s nejvyšší částkou darů je {highestCountry} s {highestSum}. Nejvíce darů, konkrétně {largesDonationCountNum}, pocházelo z {largesDonationCountState}.",
    },
  },
  state: {
    germany: {
      BW: "Bádensko-Württembersko",
      BY: "Bavorsko",
      BE: "Berlín",
      BB: "Braniborsko",
      HB: "Brémy",
      HH: "Hamburk",
      HE: "Hesensko",
      MV: "Meklenbursko-Přední Pomořansko",
      NI: "Dolní Sasko",
      NW: "Severní Porýní-Vestfálsko",
      RP: "Porýní-Falc",
      SL: "Sársko",
      SN: "Sasko",
      ST: "Sasko-Anhaltsko",
      SH: "Šlesvicko-Holštýnsko",
      TH: "Durynsko",
    },
    austria: {
      "1": "Burgenland",
      "2": "Korutany",
      "3": "Dolní Rakousy",
      "4": "Horní Rakousy",
      "5": "Salcbursko",
      "6": "Štýrsko",
      "7": "Tyrolsko",
      "8": "Vorarlbersko",
      "9": "Vídeň",
    },
    canada: {
      ON: "Ontario",
      QC: "Québec",
      NS: "Nové Skotsko",
      NB: "Nový Brunšvik",
      MB: "Manitoba",
      BC: "Britská Kolumbie",
      PE: "Ostrov prince Edwarda",
      SK: "Saskatchewan",
      AB: "Alberta",
      NL: "Newfoundland a Labrador",
      NT: "Severozápadní teritoria",
      YT: "Yukon",
      NU: "Nunavut",
    },
  },
  donor: {
    title: "Dary dárce",
    subtitle: "Celkové příspěvky a příjemci",
    active_period: "Aktivní období",
    type: "Typ dárce",
    summary:
      "{donor} daroval celkem {sum} v {count} jednotlivých darech. Průměrná velikost daru je {avg}. Dary byly rozděleny mezi {parties} různých stran.",
    oldest:
      "První dar po roce {minYear} byl učiněn dne {date} v částce {amount} straně {party}.",
    newest:
      "Nejnovější dar byl učiněn dne {date}, kdy {amount} bylo darováno straně {party}.",
    most_donations: "Nejčastěji byly dary posílány stranám {list}.",
    most_donations_item: "{party} ({count})",
    highest_most_donation:
      "Rok {biggestYear} zaznamenal nejvyšší celkovou částku darů ve výši {biggestSum}, zatímco v roce {mostYear} bylo učiněno nejvíce jednotlivých darů ({mostCount}).",
    biggest:
      "Největší jednotlivý dar ve výši {amount} byl poskytnut dne {date} straně {party}.",
    tree_map: "Dary od {name}",
    tree_map_subtitle: "Celkové zveřejněné dary každé straně v {country}.",
    biggest_amounts:
      "Dary byly primárně směřovány na vybranou skupinu stran. Níže je rozpis příjemců podle částky a procentního podílu na celkových darovaných částkách:",
    table:
      "Tato sekce poskytuje komplexní přehled všech jednotlivých darů poskytnutých {donor}. Tabulku můžete řadit podle data, strany nebo částky, abyste snadno prozkoumali, jak byly dary rozděleny v čase a mezi příjemce. Tento podrobný pohled umožňuje transparentní sledování každého příspěvku a nabízí hlubší vhled do dárcovských vzorců.",
    timeline: {
      title: "Hromadění darů v průběhu času",
      p0: "Tato sekce ukazuje, jak se dary od {donor} od roku {year} různým politickým stranám v průběhu času měnily. Graf znázorňuje celkovou darovanou částku, přičemž podíl jednotlivých stran je zvýrazněn, takže je snadné vidět, kdy a kam byla podpora směřována.",
      p1: "Sledujte čáry a pozorujte vzory, výkyvy nebo změny v darování. Tento přehled nabízí transparentní pohled na to, jak jsou příspěvky jednoho dárce rozloženy v politickém spektru.",
      years:
        "Dary se v průběhu let měnily. Následující ukazuje celkové částky darů podle roku spolu s procentním podílem každého roku na celkových darech tohoto dárce.",
      chart_subtitle:
        "Kumulativní dary od {donor} politickým stranám v {country}, zobrazené podle částky a data od roku {minYear}.",
    },

    anonymized: {
      title: "Záznam anonymizován",
      description:
        "Osobní identita spojená s tímto darem byla odstraněna v souladu s platnou žádostí podle GDPR. Výše daru zůstává zahrnuta do celkových výpočtů financování, aby byla zachována finanční transparentnost.",
    },

    redacted: {
      title: "Záznam redigován",
      description:
        "Identita dárce byla před zveřejněním těchto údajů redigována zveřejňujícím orgánem. Výše daru zůstává zahrnuta ve výpočtech celkového financování, aby byla zachována finanční transparentnost.",
    },
    ubo: "Konečný skutečný vlastník (KSV)",
    ubo_description:
      'Konečný skutečný vlastník (KSV) je osoba, která skutečně táhne za nitky. Jedná se o jednotlivce, kteří v konečném důsledku vlastní nebo kontrolují dárce, typicky držením 25 % nebo více jeho akcií nebo hlasovacích práv. Pokud žádná jednotlivá osoba nesplňuje tuto hranici, může být vrcholný management (například ředitelé) uveden jako "pseudo-KSV" k zajištění odpovědnosti.',
  },
  countries: {
    "??": "Neuvedeno",
    DE: "Německo",
    DK: "Dánsko",
    CH: "Švýcarsko",
    TH: "Thajsko",
    AT: "Rakousko",
    UK: "Velká Británie",
    NL: "Nizozemsko",
    EU: "Evropská unie",
    LV: "Lotyšsko",
    ES: "Španělsko",
    FI: "Finsko",
    HR: "Chorvatsko",
    BE: "Belgie",
    LU: "Lucembursko",
    SI: "Slovinsko",
    EE: "Estonsko",
    FR: "Francie",
    IE: "Irsko",
    IT: "Itálie",
    PL: "Polsko",
    RO: "Rumunsko",
    CY: "Kypr",
    MT: "Malta",
    PT: "Portugalsko",
    LT: "Litva",
    HU: "Maďarsko",
    CZ: "Česko",
    SG: "Singapur",
    MC: "Monako",
    SE: "Švédsko",

    AD: "Andorra",
    IM: "Ostrov Man",
    NO: "Norsko",
    LI: "Lichtenštejnsko",
    MK: "Makedonie",
    AL: "Albánie",
    MD: "Moldavsko",
    SM: "San Marino",
    FO: "Faerské ostrovy",
    BA: "Bosna a Hercegovina",
    ME: "Černá Hora",
    BG: "Bulharsko",
    BY: "Bělorusko",
    GR: "Řecko",
    IS: "Island",
    SK: "Slovensko",
    UA: "Ukrajina",
    GB: "Spojené království",
    RS: "Srbsko",
    AU: "Austrálie",
    ZA: "Jižní Afrika",
    US: "Spojené státy americké",
    CA: "Kanada",
    GE: "Gruzie",
    NZ: "Nový Zéland",
    VE: "Venezuela",
  },
  ref_countries: {
    DE: "Německo",
    DK: "Dánsko",
    CH: "Švýcarsko",
    TH: "Thajsko",
    AT: "Rakousko",
    UK: "Velká Británie",
    NL: "Nizozemsko",
    EU: "Evropská unie",
    LV: "Lotyšsko",
    ES: "Španělsko",
    FI: "Finsko",
    HR: "Chorvatsko",
    BE: "Belgie",
    LU: "Lucembursko",
    SI: "Slovinsko",
    EE: "Estonsko",
    FR: "Francie",
    IE: "Irsko",
    IT: "Itálie",
    PL: "Polsko",
    RO: "Rumunsko",
    CY: "Kypr",
    CZ: "Česko",
    AU: "Austrálie",
    RS: "Srbsko",
    CA: "Kanada",
    GE: "Gruzie",
    NO: "Norsko",
  },
  about: {
    title: "O nás",
    description: {
      p0: "DonationWatch vznikl z nedostatku čitelnosti dat na oficiálních stránkách německého Bundestagu.",
      p1: "Naším cílem je toto zlepšit pomocí veřejně dostupných dat a jejich efektivnější prezentace.",
      p2: "Zaznamenali jsme, že země jako Rakousko, Švýcarsko a Nizozemsko zveřejňují dary politickým stranám různě strukturované. Abychom vytvořili jednotné rozhraní, které usnadňuje přístup k těmto datům, zahrnuli jsme tyto země do našeho projektu. Další země budou následovat, jakmile nalezneme a zpracujeme odpovídající data.",
      p3: "Pokud máte návrhy nebo zpětnou vazbu, neváhejte nás",
      mail: "kontaktovat",
    },
    source:
      "Všechny zobrazené informace pocházejí výhradně z veřejně dostupných vládních zdrojů a neobsahují žádné dříve nezveřejněné údaje nebo soukromé záznamy. Transparentnost je naším základem.",
  },
  imprint: {
    title: "Otisk",
  },
  privacy: {
    title: "Ochrana údajů",
    last_updated: "Naposledy aktualizováno: {date}",
    effective_date: "Datum účinnosti: {date}",
    data: {
      title: "1. Shromažďování údajů",
      p: "Neshromažďujeme žádné osobní údaje návštěvníků našich webových stránek. To zahrnuje:",
      li0: "Žádné registrační formuláře",
      li1: "Žádné přihlášení k newsletteru",
      li2: "Žádné uživatelské účty",
      li3: "Žádné cookies pro sledování",
    },
    cf: {
      title: "2. Služby Cloudflare",
      link: "Zobrazit zásady ochrany osobních údajů Cloudflare",
      p: "Využíváme dvě služby Cloudflare:",
      workers: {
        summary:
          "Cloudflare Workers: Platforma bez serveru pro doručování obsahu (nezpracovává uživatelská data)",
      },
      analytics: {
        summary:
          "Cloudflare Web Analytics: Analytický nástroj se zaměřením na soukromí, který:",
        li0: "Nepoužívá cookies",
        li1: "Shromažďuje pouze agregované metriky",
      },
    },
    logs: {
      title: "3. Automatické serverové protokoly",
      p: "Náš hostingový poskytovatel může shromažďovat:",
      li0: "IP adresy (anonymizované)",
      li1: "Časové značky požadavků",
      li2: "Typy prohlížečů/zařízení",
      retention: "Tato data se automaticky mažou do 7 dnů.",
    },
    contact: {
      title: "Kontakt",
      p: "Pro dotazy týkající se ochrany osobních údajů:",
    },
  },
  fun: {
    link: "Zábavná fakta",
    title: "Zábavná fakta o veřejných datech",
    p0: "Tato stránka ukazuje zajímavé nálezy z naší práce s veřejně dostupnými vládními daty. Tato pozorování nejsou kritikou, ale spíše drobnými zvláštnostmi, které se mohou vyskytnout v jakémkoli velkém souboru dat.",
    p1: "Ačkoli o problémech informujeme, když je to vhodné, nepovažujeme je za naléhavé záležitosti, které by vládní instituce měly řešit. Z naší zkušenosti jsou tyto organizace vstřícné a otevřené zpětné vazbě.",
    reported_fixed: "Tato skutečnost byla nahlášena {owner}, který ji opravil.",
    reported_wontfix:
      "Tato skutečnost byla nahlášena společnosti {owner} a ta ji nemůže změnit.",
    reported: "Tato skutečnost byla nahlášena {owner}.",
  },
  transparency: {
    title: "Transparentnost",
    p0: "Snažíme se poskytovat jasné a konzistentní informace o dárcích politických stran. Za tímto účelem automaticky normalizujeme některá jména dárců, abychom zajistili jednotnost v naší databázi. Tento přístup nám umožňuje zachovat přesnost a zároveň zohlednit rozdíly ve způsobu zápisu jmen.",
    p1: "V zájmu transparentnosti jsme sestavili seznam normalizovaných jmen spolu s jejich variantami, které se vyskytly v našich dárcovských záznamech. Níže najdete každé normalizované jméno následované jeho variantami. Tento seznam vysvětluje, proč můžete vidět jména dárců, která se přesně neshodují s našimi zdrojovými dokumenty.",
    section: {
      filtered_donors: "Filtrovaní dárci",
      filtered_receivers: "Filtrovaní příjemci",
      aggregated: "Agregovaní dárci",
    },
    filtered_donors: {
      p0: "Abychom přesně zachytili skutečné zdroje politických darů, odfiltrujeme některé transakce, které jsou ve skutečnosti státními příspěvky, nikoli skutečnými dary. Protože je naše zdrojové datové sady výslovně neoznačují, opíráme se o sadu filtračních pravidel založených na regulárních výrazech (regexp), která takové záznamy automaticky identifikují a odstraní. Níže si můžete prohlédnout úplný seznam použitých filtračních pravidel regexp.",
      p1: "Níže je uveden seznam dárců, jejichž příspěvky byly podle našich kritérií a filtračních pravidel odfiltrovány.",
    },
    filtered_receivers: {
      p0: "Abychom zajistili, že budeme zobrazovat pouze smysluplná data o příjemcích, filtrujeme také některé příjemce nebo strany, které jsou pro účely sledování dárců považovány za nerelevantní nebo neaktivní. Protože naše datové sady tyto příjemce ne vždy výslovně označují, používáme sadu pravidel založených na regexp k jejich automatickému vyloučení.",
      p1: "Níže si můžete prohlédnout úplný seznam použitých filtračních pravidel regexp.",
    },
    receivers: {
      title: "Agregovaní příjemci",
      p0: "V zemi {country} mohou být dary vykazovány různým organizačním jednotkám v rámci strany. Kvůli konzistenci slučujeme související subjekty příjemců do jednoho celkového součtu na úrovni strany. Níže uvedený seznam dokládá, které subjekty příjemců jsou u jednotlivých stran agregovány.",
    },
  },
  related: {
    donors: "Podobní dárci",
  },
  similar_donors: {
    title: "Síť podobných dárců",
    description: "Prozkoumejte širší síť dárců propojenou s tímto dárcem.",
    summary: "V související síti dárců je {count} jedinečných dárců.",
    list_title: "Přehled rozdělení stran",
  },

  detect_country: {
    title: "Vypadá to, že jste v {country}.",
    description: "Klepněte pro zobrazení politických darů v {country}.",
    action: "Zobrazit dary pro {country}",
  },

  donor_type: {
    [DonorType.PublicFund]: "Veřejný fond",
    [DonorType.Individual]: "Jednotlivec",
    [DonorType.Company]: "Společnost",
    [DonorType.Other]: "Ostatní",
    [DonorType.TradeUnion]: "Odborová organizace",
    [DonorType.UnincorporatedAssociation]: "Neregistrované sdružení",
    [DonorType.RegisteredPoliticalParty]: "Registrovaná politická strana",
    [DonorType.Trust]: "Svěřenský fond",
    [DonorType.FriendlySociety]: "Podpůrná společnost",
    [DonorType.LimitedLiabilityPartnership]: "Partnerství s ručením omezeným",
    [DonorType.BuildingSociety]: "Stavební spořitelna",
    [DonorType.NonProfitLegalEntity]: "Nezisková právnická osoba",
    [DonorType.AnonymizedDonor]: "Anonymizovaný dárce",
  } satisfies Record<DonorType, string>,

  other_countries: {
    title: "Ostatní země",
  },

  thanks:
    "Poděkování organizacím, jako je {external}, za poskytování cenných informací o mechanismech politických darů.",

  export: {
    title: "Export dat",
    p0: "Získejte kompletní datovou sadu politických darů pro {country} používanou na tomto webu. Export zahrnuje normalizovaná jména dárců, částky, data a příjemce (strany).",
    p1: "Důležité: Nejde o surová data ze zdroje {source}. Tato datová sada obsahuje pouze dary, které náš tým normalizoval a vyfiltroval. Pro metodiku si prosím přečtěte naši část {transparency}.",
    license: "Licence: {license}",
    download: "Stáhnout {format}",
    includes_donations: "Zahrnuto darů: {num}",
  },
  bar_chart_race: {
    title: "Závod sloupcového grafu",
    description:
      "Vizualizujte kumulaci darů v čase. Vyberte rozsah let a podívejte se, jak se dynamicky vyvíjí financování stran.",
    from: "Od",
    to: "Do",
    download_video: "Stáhnout video",
    rendering: "Vykreslování... {percentage}",
    no_data: "Pro vybraný rozsah nejsou k dispozici žádná data.",
    note: "Upozornění: Tato animace se vykresluje na straně klienta ve vašem prohlížeči a na některých zařízeních může být náročná na prostředky. Stažení videa automaticky přehraje celou animaci.",
    individual_years: "Jednotlivé roky",
    animation_duration: "Délka animace",
    duration_s: "{seconds}s",
    group_by: {
      label: "Seskupit podle",
      receiver: "Strana",
      donor: "Dárce",
    },
  },
};

export default Cs;
