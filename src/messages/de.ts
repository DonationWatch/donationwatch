import { DonorType } from "../utils/types";

const De = {
  copyright: "Urheberrecht",
  charts_license: "Diagramme lizenziert {license} mit Namensnennung",
  data_error: "Daten konnten nicht geladen werden",
  description:
    "DonationWatch gibt klare Einblicke in Geldgeber und Parteien erleichtern das Verständnis politischer Finanzierung, indem komplexe Daten einfach erklärt werden.",
  title: "Parteispenden {country}",
  sum: "Summe",
  donation_count: "Spendenanzahl",
  average: "Durchschnitt",
  donations_by_party: "Spenden nach Partei",
  donations_per_year: "Spenden pro Jahr",
  party_donations: "Parteispenden",
  more: "Mehr",
  loading: "Inhalt wird geladen",
  data_since: "Seit {year}",
  view_party: "Parteiseite der {party} ansehen",
  faq: "Häufig gestellte Fragen",
  sidebar: {
    toggle: "Seitenleiste umschalten",
    donations: "Spenden",
    all_countries: "Alle Länder",
    tools: "Werkzeuge",
    show_all: "Alle anzeigen ({num})",
    show_less: "Weniger anzeigen",
  },
  search: {
    filter: "Suche...",
    filter_description: "Suche nach Parteien, Jahren oder Spendern",
    parties: "Parteien",
    years: "Jahre",
    legislative_years: "Legislative Jahre",
    empty: "Keine Ergebnisse gefunden",
    donors: "Spender",
  },
  page_title: {
    years: {
      description:
        "Im Jahr {year} erhielten {parties} Parteien in {country} insgesamt {sum} aus {count} Spenden über {minAmount}. Entdecken Sie detaillierte Aufschlüsselungen nach Partei, Spender und Trends in der Parteienfinanzierung.",
      overview:
        "Übersicht über politische Parteispenden in {country} für {year}",
      changes:
        "Aktuelle Änderungen bei politischen Parteispenden in {country} für {year}",
      donors: "Top-Spender an politische Parteien in {country} für {year}",
      timeline:
        "Zeitstrahl der politischen Parteispenden in {country} für {year}",
      origin:
        "Geografische Übersicht der Parteispenden in {country} für {year}",
    },
    party: {
      donors: "Top-Spender der {party} {country}",
      changes: "Aktuelle Änderungen der {party}-Spenden {country}",
      timeline: "Zeitstrahl der {party}-Parteispenden {country}",
      origin: "Geografische Übersicht der {party}-Parteispenden {country}",
      description:
        "Seit {year} hat die {party} insgesamt {count} Spenden über {minimumAmount} erhalten, was einer Gesamtsumme von {sum} entspricht. Entdecken Sie detaillierte Informationen über Großspender und Spendentendenzen an die {party} in {country}.",
    },
    donor: {
      overview: "Spenden von {donor} in {country}",
      description:
        "{donor} hat insgesamt {sum} in {count} Spenden über jeweils mindestens {minAmount} seit {minYear} gespendet. Diese Beiträge wurden auf {parties} verschiedene Parteien verteilt. Entdecken Sie detaillierte Einblicke in die Spendengewohnheiten und Empfängerparteien dieses Spenders in {country}.",
    },
  },
  chart: {
    save_as_image: "Als Bild speichern",
    toggle_fullscreen: "Vollbildmodus umschalten",
    reset_zoom: "Zoom zurücksetzen",
  },
  over_min_public_amount: "über {amount}",
  over_threshold: "nur Parteien mit ≥ {count} Spenden oder ≥ {sum}",
  prelim_data: "vorläufige Daten seit {year}",
  excludes_year_only_donations: "schließt Spenden mit Jahr als Datum aus",
  common: {
    date: "Datum",
    party: "Partei",
    donor: "Spender",
    amount: "Betrag",
    anonymizedDonor: "Anonymisierter Spender",
    redactedDonor: "Geschwärzter Spender",
  },
  sort: {
    asc: "Sortiere aufsteigend",
    desc: "Sortiere absteigend",
    clear: "Sortierung aufheben",
  },
  footer: {
    sources: "Quellen",
    build: "Stand {date}",
    build_since: "Ab {date}, seit {year}",
    published_by: "Wie veröffentlicht von {source}",
  },
  header: {
    home: "Startseite",
    language_selection: "Sprachauswahl",
    country_selection: "Länderauswahl",
  },
  actions: {
    close: "Schließen",
    play: "Abspielen",
    pause: "Pause",
    restart: "Neu starten",
  },
  donor_dialog: {
    title: "Angaben zum Spender",
    summary: "Zusammenfassung",
  },
  donation_dialog: {
    title: "Details zur Spende",
    donor: "Spender",
    country: "Land",
    state: "Bundesland",
    receiver: "Empfänger",
    donation_amount: "Spendenbetrag",
    date: "Datum",
  },
  root: {
    title: "Open-Source-Tracker für Parteispenden",
    subtitle:
      "Verfolge und erkunde politische Spenden in mehreren Ländern. Verstehe, wer politische Parteien finanziert und wie Geld weltweit fließt.",
    stats: {
      countries: "Abgedeckte Länder",
      parties: "Politische Parteien",
      donations: "Einzelspenden",
      currencies: "Erfasste Währungen",
    },
    countries: {
      title: "Politische Spenden nach Land erkunden",
      subtitle:
        "Wähle ein Land aus, um auf detaillierte Spendeneinträge, Daten zur Parteienfinanzierung und Informationen zu Spendern zuzugreifen.",
    },
    why: {
      title: "Warum Transparenz bei politischen Spenden wichtig ist",
      p0: "Demokratie lebt von informierten Bürgerinnen und Bürgern. Indem wir Daten zu politischen Spenden zugänglich und leicht erkundbar machen, helfen wir Menschen, die finanziellen Beziehungen zu verstehen, die ihre politische Landschaft prägen. Transparenz in der politischen Finanzierung schafft Vertrauen, stärkt die Rechenschaftspflicht und befähigt Wählerinnen und Wähler, informierte Entscheidungen zu treffen.",
    },
    open_source: {
      title: "Open Source",
      p0: "DonationWatch ist Open Source. Du kannst den Code ansehen, Probleme melden oder auf {github} beitragen.",
    },
  },
  home: {
    most_recent: "Aktuellste Spenden",
    hero: {
      subtitle: "Parteispenden-Tracker für {country}",
      subtitle_no_country: "Parteispenden-Tracker",
    },
    biggest_donations: {
      text: "Seit {minYear} belief sich die größte offengelegte Einzelspende in {country} auf {amount} von {donor} an {party} im Jahr {year}. Darauf folgen {others}.",
      list: "{amount} von {donor} an {receiver}",
    },
    last_period: "Letztes Jahr:",
    previous_period: "Spenden aus dem vergangenen Jahr.",
    what: {
      title: "Was ist das?",
      summary:
        "Parteispenden sind ein wichtiger Bestandteil der Politik. Sie sind ein wichtiger Indikator für die politische Unterstützung.\n\nWir versuchen diese Daten übersichtlich und verständlich darzustellen.",
      threshold:
        'Aufgrund der hohen Anzahl kleinerer politischer Parteien erfassen wir nur Spenden für Parteien, die eine bestimmte Schwelle erreichen. Die aktuelle Schwelle liegt bei {count} Spenden oder einem Gesamtbetrag von {sum} an Beiträgen für diese Partei, unabhängig von der Höhe einzelner Spenden."',
      source: {
        austria:
          "Die hier verwendeten Daten stammen vom Rechnungshof Österreich und umfassen sämtliche dort seit 2012 dokumentierten Parteispenden.\n\nBitte beachten Sie: Vor dem 8. Juli 2019 mussten politische Parteien Einzelspenden über 51.000 Euro (bis 2018 über 50.000 Euro) dem Rechnungshof melden. Seit Juli 2019 liegt die Meldegrenze bei 2.500 Euro.\n\nDie Daten der Parteien werden normalerweise quartalsweise aktualisiert.",
        germany:
          "Die hier verwendeten Daten stammen vom Deutschen Bundestag und umfassen sämtliche dort seit 2010 dokumentierten Parteispenden über 50.000 € und seit dem 5. März 2024 über 35.000 €.",
        switzerland:
          "Die hier verwendeten Daten stammen von der Eidgenössischen Finanzkontrolle und umfassen sämtliche dort seit 2023 dokumentierten Parteispenden.",
        netherlands:
          "Die hier dargestellten Informationen stammen von der Regierung der Niederlande und umfassen alle seit 2022 registrierten politischen Spenden, die 1.000 € übersteigen, wie im jährlichen Bericht „Overzicht van giften aan politieke partijen en hun neveninstellingen“ angegeben.\n\nFür das laufende Jahr sind nur Spenden über 10.000 € enthalten, basierend auf dem Datensatz „Overzicht substantiële giften aan politieke partijen“.\n\nBitte beachten Sie: Einige Spenden enthalten keine genauen Datumsangaben und sind daher nicht in Zeitreihen oder anderen datumsbasierten Visualisierungen enthalten.\n\nDie für SP und GL gemeldeten Spenden können relativ hoch erscheinen, da beide Parteien von ihren Abgeordneten und Funktionären verlangen, einen erheblichen Teil ihres Gehalts an die Partei abzuführen.",
        europeanunion:
          "Die hier präsentierten Daten stammen von der Behörde für europäische politische Parteien und europäische politische Stiftungen und umfassen alle dokumentierten Partei- und Stiftungsspenden seit 2018. Aufgrund der Bedeutung der europäischen politischen Stiftungen werden deren Spenden ähnlich wie die der europäischen politischen Parteien erfasst und dargestellt.\n" +
          "\n" +
          "Da die offiziellen Daten keine Daten enthalten, sind keine Zeitreihen oder ähnliche visuelle Darstellungen verfügbar.\n" +
          "\n" +
          "Zu beachten ist, dass im Vorfeld der Europawahl 2024 (vom 6. Dezember 2023 bis 10. Juni 2024) besondere Meldepflichten für Spenden galten, mit wöchentlichen Meldungen und zeitnaher Veröffentlichung durch die Behörde.\n" +
          "Ab dem 10. Juni 2024 müssen nur noch Spenden über 12.000 Euro sofort gemeldet werden. Andere Spenden werden erst nach Vorlage des Jahresabschlusses zur Verfügung stehen.",
        estonia:
          "Die hier verwendeten Daten stammen vom estnischen Ausschuss für die Überwachung der Parteienfinanzierung und umfassen alle dort seit 2014 dokumentierten politischen Spenden, die 1 Euro übersteigen.\n\nPolitische Parteien in Estland sind verpflichtet, ihre Einnahmen, einschließlich erhaltener Spenden, vierteljährlich zu melden.\n" +
          "Die Daten auf der Website des Ausschusses werden dementsprechend quartalsweise aktualisiert.",
        czechrepublic:
          "Die hier verwendeten Daten stammen vom Amt für die Kontrolle der Verwaltung politischer Parteien und politischer Bewegungen und umfassen alle dort seit 2018 dokumentierten politischen Spenden, die 25 CZK übersteigen.\n" +
          "\n" +
          "Dieser Umfang schließt auch alle Beiträge an Parteien oder politische Bewegungen ein, die entweder mehr als 100 einzelne Spenden erhalten haben oder insgesamt mehr als 1 Million CZK an Spendenbeträgen überschritten haben, unabhängig von der Größe der einzelnen Beiträge. Die Daten werden jährlich aktualisiert.\n" +
          "Die Erkennung des Spendertyps basiert darauf, einen Spender als Einzelperson zu identifizieren, wenn sowohl die Felder firstName als auch lastName vorhanden sind.",
        latvia:
          "Die hier verwendeten Daten stammen vom Amt für Korruptionsprävention und -bekämpfung und umfassen alle dort seit 2015 dokumentierten politischen Spenden, die 1 Euro übersteigen.",
        australia:
          "Die hier verwendeten Daten stammen von der Australian Electoral Commission (AEC), insbesondere aus dem von der AEC veröffentlichten Datensatz „Donations Made Details“. Er umfasst alle dort dokumentierten politischen Spenden seit 2014, die €1 übersteigen.\n" +
          "\n" +
          "Hinweis: Der AEC-Datensatz kann einige Tippfehler enthalten, was dazu führen kann, dass bestimmte Spenden nicht erfasst werden oder aufgrund von Inkonsistenzen bei der Dateneingabe nicht korrekt einer bestimmten Partei zugeordnet werden. Außerdem werden die jährlichen Offenlegungen der AEC jeweils am 1. Februar veröffentlicht, aber die Daten liefern kein vollständiges Bild aller Zuwendungen, da die Offenlegungsschwelle bei $15.000 liegt.\n" +
          "\n" +
          "Spenderarten werden durch Abgleich von Spendernamen klassifiziert. Alle gängigen Gewerkschaften werden manuell dem Spender-Typ „Gewerkschaft“ zugeordnet. Unternehmen werden erkannt, indem im Spendernamen nach bestimmten Unternehmenskennzeichen gesucht wird: „Pty“ (Proprietary), „Ltd“ am Ende des Namens, „Corporation“ oder „Corp“.",
        unitedkingdom:
          "Die hier verwendeten Daten stammen von der Electoral Commission und umfassen alle politischen Spenden, die dort seit 2010 dokumentiert wurden und 1.000 £ übersteigen.\n\nDie Spendendaten werden quartalweise aktualisiert.",
        serbia:
          'Die hier verwendeten Daten stammen nicht von der Regierung, sondern von der gemeinnützigen Organisation "Center for Investigative Journalism of Serbia" ("Centar za istraživačko novinarstvo Srbije" - CINS), die dankenswerterweise die Spendendaten der Serbian Anti-Corruption Agency aggregiert hat.\n\nDiese Daten umfassen alle dort dokumentierten politischen Spenden seit 2015.\n\nDa der Datensatz keine spezifischen Datumsinformationen für die einzelnen Spenden bereitstellt, können leider keine Zeitleisten oder andere zeitbasierte Visualisierungen dargestellt werden.',
        croatia:
          "Die hier verwendeten Daten stammen von der Staatlichen Wahlkommission der Republik Kroatien (DIP) und umfassen alle politischen Spenden mit einem Geldwert von mehr als 1 €, die seit 2019 dokumentiert sind.\nDer Datensatz verwendet pro Berichtsjahr ausschließlich das zuletzt veröffentlichte Spenden-Dokument (wie von izbori angegeben), um Duplikate aus früheren Versionen desselben Jahresberichts zu vermeiden.\nAlle Spenden werden in Euro angezeigt, während der zugrunde liegende Datensatz bis 2024 Kuna verwendet. Spenden, die ursprünglich in Kuna getätigt wurden, werden anhand ungefährer Wechselkurse für jedes Halbjahr von 2019 bis 2024 in Euro umgerechnet: H1 (0.1340, 0.1335, 0.1332, 0.1329, 0.1326) und H2 (0.1341, 0.1338, 0.1334, 0.1327, 0.1328).",
        canada:
          "Die hier verwendeten Daten stammen von Elections Canada und basieren auf dem Datensatz „contributions as submitted“. Er umfasst alle politischen Spenden mit einem Geldwert von über 500 €, die seit 2015 dokumentiert wurden. Alle Einträge, die Teil des Berichts „Statement of Contributions Received“ aus der Wahlveranstaltung „Annual“ an „Registered parties“ sind, sind enthalten.",
        georgia:
          "Die hier präsentierten Informationen stammen vom Antikorruptionsbüro (ანტიკორუფციული ბიურო﻿) Georgiens und umfassen alle seit 2011 registrierten politischen Spenden, die 1 GEL übersteigen. Der Datensatz umfasst nur Beiträge, die als Typ #10 (Geldspenden) oder Typ #16 (Geldspenden juristischer Personen) klassifiziert sind.",
        norway:
          "Die hier verwendeten Daten stammen aus den offiziellen Veröffentlichungen zur Parteienfinanzierung von Statistics Norway (SSB) und Partifinansiering.no. Die ausgewiesenen Summen werden aus mehreren gemeldeten Empfängereinheiten (z. B. zentralen, regionalen, lokalen und Jugendorganisationen) zu einem einzigen Gesamtwert pro Partei aggregiert, wobei die zugrunde liegende Zuordnung der Empfänger zur Transparenz weiterhin verfügbar bleibt.\n\nDer Norwegen-Datensatz wird in einem jährlichen Aktualisierungszyklus erneuert und spiegelt damit den Rhythmus der zugrunde liegenden Offenlegungen wider.",
      },
      source_link: "Datenquelle",
    },
    list: {
      subtitle: "Legislaturperioden",
      title: "Zurückliegende Legislaturperioden",
      summary:
        "Unsere Legislaturperiodenübersicht bietet eine Gesamtübersicht aller Spenden während eines Legislaturzeitraums. Klicke auf eine Karte, um die Details einer bestimmten Legislaturperiode einzusehen.",
    },
    years: {
      title: "Jährliche Parteispendenübersicht",
      subtitle: "Aggregierte Summen im Jahresverlauf",
      more: "Alle übrigen Jahre anzeigen",
      summary:
        "Unsere jährliche Parteispendenübersicht bietet eine Zusammenfassung aller Spenden für jedes Jahr. Klicke auf eine Karte, um zur detaillierten Jahresübersicht zu gelangen",
    },
    parties: {
      title: "Parteispenden",
      subtitle: "Details zu einzelnen Parteien",
      more: "Alle übrigen Parteien anzeigen",
      summary:
        "Unsere Parteispendenübersicht präsentiert eine kumulierte Darstellung aller Spenden für jede Partei. Klicke auf eine Karte, um detaillierte Informationen zu den Spenden zu erhalten.",
    },
    donors: {
      title: "Spenderinnen und Spender",
      subtitle: "Details zu einzelnen Spendern",
      summary:
        "Entdecken Sie unsere Spenderübersicht, die die bedeutendsten finanziellen Beiträge seit {minYear} zeigt. Klicken Sie auf einen Spender, um detaillierte Informationen zu dessen Beiträgen zu sehen.",
    },
    stacked_years: "Spendenhöhe pro Jahr",
    stacked_years_subtitle:
      "Aggregierte Summe der veröffentlichten Beiträge in {country}, nach Jahr ab {years}.",
  },
  years: {
    title: "Parteispenden",
    subtitle:
      "Kumulierte Summe der veröffentlichten Spenden an jede Partei in {country}, {years}.",
    goto_year: "Zu {year} springen",
    no_data: {
      title: "Keine Daten verfügbar",
      summary:
        "Es tut uns leid, aber wir haben noch keine Spendendaten für {year}.",
      last_year: "Alternativ können Sie die Daten von {year} ansehen.",
    },
  },
  overview: {
    title: "Übersicht",
    detail: {
      title: "Top politische Parteien und ihre Gesamtspenden",
      summary:
        "Diese Liste präsentiert die wichtigsten politischen Parteien und ihre kumulierten Spenden innerhalb eines bestimmten Zeitraums, geordnet nach der Höhe der Spendenbeiträge.",
      summary2:
        "In den Jahren {years} erhielten insgesamt {partyCount} Parteien durch {donationCount} Spenden über {minimumAmount} eine Gesamtsumme von {donationSum}.",
      most_donations:
        "Die {party} erhielt die meisten Spenden mit insgesamt {count} Zuwendungen und einer Gesamtsumme von {sum}.",
      highest_sum:
        "Die 5 Parteien mit den höchsten Gesamtsummen an Spenden sind {parties}.",
    },
    scatter: {
      title: "Spendenverteilung",
      subtitle:
        "Einzelne Spenden an jede Partei nach Betrag und Häufigkeit in {country} von {years}.",
      summary:
        "Die Übersicht über die Parteispendenverteilung bietet eine knappe Analyse der Spendenverteilung zwischen verschiedenen politischen Parteien. Jeder Punkt steht für eine Partei, wobei die x-Achse die Spendenbeträge und die Streuungsgröße die Spendenhäufigkeit angibt.",
      span: "Bei der Partei {biggestSpanParty} wurde die größte Spendenspanne verzeichnet, mit einem Unterschied von {biggestSpanAmount} zwischen der kleinsten und größten Spende.",
    },
    pie: {
      title: "Parteispendenverteilung",
      subtitle:
        "Gesamtsumme der veröffentlichten Spenden an jede Partei, {country}, {years}.",
    },
  },
  changes: {
    title: "Änderungen",
    description:
      "Entdecken Sie eine detaillierte Tabelle der Parteispenden in {country} aus dem Jahr {year}, nur Beiträge über {minAmount}, sortiert nach Transaktionsdatum, mit Angaben zu Spender und Betrag.",
    detail: {
      title: "Parteispenden nach Transaktionsdatum",
      summary:
        "Auf dieser Seite werden Parteispenden nach dem Transaktionsdatum sortiert angezeigt, wobei die neuesten Spenden oben aufgeführt sind. Es werden Informationen darüber bereitgestellt, wie viel Geld jede Partei von welchem Spender erhalten hat.",
    },
  },
  donors: {
    title: "Spender",
    description:
      "Sehen Sie die vollständige Liste der Spender im Jahr {year} an politische Parteien in {country}. Finden Sie heraus, wer am meisten gespendet hat und wie viel jeder beigetragen hat.",
    detail: {
      title: "Beiträge von Spendern an politische Parteien",
      subtitle:
        "Gesamtsumme der veröffentlichten Beiträge von Einzelspendern an jede Partei in {country}, {years}.",
      summary:
        "Die Treemap visualisiert die Parteispenden in einer klar strukturierten Darstellung. Auf der obersten Ebene sind die einzelnen Spender abgebildet, die durch Rechtecke repräsentiert werden, deren Größe proportional zur Höhe ihrer Spenden ist.",
      summary2:
        "Unterhalb jedes Spenders befinden sich weitere Rechtecke, die die jeweiligen Empfängerparteien darstellen. Diese hierarchische Anordnung ermöglicht einen schnellen Überblick über die Verteilung der Spenden und zeigt auf einen Blick, wie viele Empfänger jeder Spender unterstützt hat.",
      unique_donors:
        "Die Anzahl der unterschiedlichen Geldgeber in {years} beläuft sich auf {count} Spender.",
      biggest_donor:
        "Die höchste Gesamtspendensumme von {amount} stammt von {donor}.",
      most_donations:
        "Mit {count} Zuwendungen (Gesamtsumme: {sum}) führt der {donor} die Liste der häufigsten Einzelspender an.",
      most_unique_parties:
        "An insgesamt {count} verschiedene Parteien richtete {donor} seine Spenden (Gesamtsumme: {sum}) und zeigt damit die größte Vielfalt bei den Spendenempfängern.",
      top_3: "In {years} sind die größten {amount} Spender: {donors}.",
    },
    list: {
      title: "Top Einzelspender nach Gesamtbetrag",
      p0: "Dieser Abschnitt zeigt eine Rangliste aller Einzelspender innerhalb der ausgewählten Jahre, sortiert nach der kumulierten Summe ihrer veröffentlichten Spenden. Dadurch werden die Spender hervorgehoben, die am meisten beigetragen haben.",
    },
    sankey: {
      title: "Sankey-Diagramm",
    },
    histogram: {
      title: "Verteilung der Spender nach Anzahl der einzigartigen Empfänger",
      subtitle:
        "Anzahl der einzigartigen politischen Parteien, die veröffentlichte Spenden von einzelnen Spendern in {country}, {years} erhalten haben.",
      p0: "Dieses Diagramm gibt einen Überblick darüber, wie einzelne Spender ihre Beiträge unter politischen Parteien aufteilen und zeigt, ob Spender dazu neigen, ihre Unterstützung auf eine einzige Partei zu konzentrieren oder sie im Laufe der Zeit auf mehrere Parteien zu verteilen.",
      p1: "Im Jahr {years} lag die höchste Anzahl unterschiedlicher Parteien, die von einem einzelnen Spender unterstützt wurden, bei {max}. Nur {donors} Spender unterstützte {max} Parteien. Im Durchschnitt unterstützte jeder Spender {mean} Parteien (Median: {median}).",
      p2: "Von {totalDonors} Spendern haben {singlePartyDonors} nur an eine Partei gespendet, das entspricht {percentage} der Spender.",
      tooltip: "{donors} Spender • {parties} eindeutige Parteien",
      item: "{donors} Spender haben an {parties} Parteien gespendet",
    },
  },
  timeline: {
    title: "Entwicklung",
    description:
      "Sehen Sie sich eine Zeitleiste aller Parteispenden in {country} für {years} an, mit monatlichen Gesamtsummen und Trends über die Jahre hinweg.",
    detail: {
      title: "Zeitverlauf der Parteispenden",
      summary:
        "Betrachten Sie das interaktive Liniendiagramm unten, um die Spendengeschichte jeder politischen Partei im Laufe der Zeit nachzuverfolgen. Die x-Achse repräsentiert die Datumsangaben, während die y-Achse den Betrag der Spenden anzeigt. Jede politische Partei wird durch eine separate Linie dargestellt, die mit jeder Spende wächst.",
    },
    days: "In {country} wurden in {years} an {n} verschiedenen Tagen Spenden erfasst.",
  },
  per_year_party: {
    title: "Spenden an {party} pro Jahr",
    subtitle:
      "Jährliche Summe der veröffentlichten Spenden an {party} in {country}, {years}.",
  },
  per_month: {
    title: "Spenden pro Monat",
    subtitle:
      "Monatliche Summe der veröffentlichten Spenden an jede Partei in {country}, {years}.",
    description:
      "Dieses gestapelte Balkendiagramm veranschaulicht die monatlichen Spendendaten für mehrere politische Parteien. Die x-Achse zeigt die Monate, die y-Achse stellt die Spendensummen dar, und jeder Balken ist farblich unterteilt, um die einzelnen Parteispenden anzuzeigen, was einen einfachen Vergleich der Parteispenden innerhalb und zwischen den Monaten ermöglicht.",
    highest_sum:
      "Die höchste Spendensumme wurde im {month} mit insgesamt {count} Spenden in Höhe von {sum} erreicht.",
    most_months:
      "{party} hat in {count} Monaten Spenden erhalten – das sind die meisten Monate mit Beiträgen unter allen Parteien",
    month_most_donations:
      "Der Monat mit der höchsten Spendenzahl war der {month}, in dem insgesamt {count} Einzelspenden eingingen.",
  },
  party: {
    donors: {
      title: "Spender für {party}",
      subtitle:
        "Gesamtsumme der veröffentlichten Beiträge von Einzelspendern an die {party} in {country}.",
      summary:
        "Diese Seite zeigt alle offiziell gemeldeten Spenden über {minSum} an {party} seit {minYear}, gruppiert nach Spendern, um die Gesamtbeiträge über die Zeit zu zeigen. Alle Zahlen basieren auf offiziellen Veröffentlichungen der {source} und werden sowohl als Treemap für den visuellen Vergleich als auch als erweiterbare Liste der zugrundeliegenden Transaktionen dargestellt.",
    },
    donor_types: {
      title: "Spendentypen",
      treemap: {
        title: "Spendentypen für {party}",
        description:
          "Gesamt veröffentlichte Beiträge an {party} in {country} nach Spendentyp.",
      },
      p0: "Diese Baumkarte gruppiert gemeldete politische Spenden nach Spendentyp (zum Beispiel Einzelpersonen, Unternehmen und öffentliche Mittel) und skaliert jedes Rechteck entsprechend der Gesamtsumme im ausgewählten Zeitraum und Umfang.",
      p1: "Größere Kästchen zeigen höhere Summen an, und die in jedem Kästchen angezeigten Namen sind die größten Beitragszahler innerhalb ihres Spendentypus. Diese Ansicht umfasst {count} verschiedene Spendentypen für {party}.",
      p2: "Unten steht eine Liste, in der die Sektoren nach ihren Gesamtspenden von hoch nach niedrig sortiert sind:",
    },
    qa: {
      sum: {
        q: "Wie viel hat {party} an Spenden erhalten?",
        a: "{party} hat insgesamt {sum} an Spenden aus {count} dokumentierten Spenden erhalten.",
      },
      top_donors: {
        q: "Wer sind die größten Spender von {party}?",
        a: "Die größten Spender von {party} sind: {donors}.",
      },
      largest_singular: {
        q: "Was war die größte Einzelspende an {party}?",
        a: "Die größte Einzelspende war {amount} von {donor} am {date}.",
      },
      biggest_overall: {
        q: "Wer ist der größte Gesamtspender von {party}?",
        a: "Der größte Gesamtspender von {party} ist {donor} mit Gesamtspenden von {sum}.",
      },
      frequent_donor: {
        q: "Wer hat die meisten Spenden an {party} gemacht?",
        a: "{donor} hat die meisten Spenden an {party} gemacht mit {count} separaten Spenden in Höhe von insgesamt {sum}.",
      },
    },
    overview: {
      title: "Spendenübersicht {party}",
    },
    changes: {
      detail: {
        title: "{party}-Spenden nach Transaktionsdatum",
        summary:
          "Diese Seite zeigt eine Liste von {party}-Spenden, die nach dem Transaktionsdatum sortiert sind, wobei die neuesten Spenden oben erscheinen. Sie bietet Informationen über den Betrag, den jede Spende für die {party} bedeutet, und die entsprechenden Spender.",
      },
    },
    timeline: {
      chart_title: "{party} Parteispenden",
      subtitle:
        "Kumulierte Summe der veröffentlichten Spenden an die {party} in {country}.",
      detail: {
        title: "Zeitverlauf der {party}-Spenden",
        summary:
          "Erkunde das interaktive Liniendiagramm, um die Spendenhistorie von {party} im Zeitverlauf nachzuverfolgen. Die x-Achse stellt die Daten dar, während die y-Achse den gespendeten Geldbetrag zeigt. {party} wird durch eine eigene Linie dargestellt, die mit jeder Spende weiter ansteigt.",
        per_year:
          "Der Gesamtbetrag der von {party} erhaltenen Spenden variiert je nach Jahr. Unten findest du eine historische Übersicht der jährlichen Finanzierungssummen, die von der Partei angegeben wurden. Diese Liste erfasst die Summe aller meldepflichtigen Zuwendungen und finanziellen Unterstützungen für jedes einzelne Jahr:",
      },
    },
  },
  origin: {
    title: "Herkunft",
    description:
      "Sehen Sie, woher die Parteispenden in {country} für {years} stammen – Aufschlüsselung nach Bundesland und internationalen Beiträgen.",
    detail: {
      title: "Spendenherkunft im Überblick",
      description:
        "See transparent origins of political donations to {party} in {country}: breakdown by state and foreign sources.",
      summary:
        "Erhalten Sie einen klaren Überblick über die geografische Herkunft von Spenden. Erfahren Sie, aus welchen Bundesländern oder Ländern außerhalb {country} die Unterstützung kommt. Verfolgen Sie transparent, wie Spenden geografisch verteilt sind.",
      country: {
        austria:
          "In Österreich wird Spendenherkunft erst ab 2023 erfasst. Alle älteren Spenden können aus diesem Grund nicht einzelnen Bundesländern zugeordnet werden.",
      },
      sum: "Im Jahr {years} beliefen sich die Parteispenden in {country} aus inländischen Quellen auf insgesamt {sumCountry}. Beiträge aus ausländischen Quellen betrugen {sumOthers}.",
    },
    type: {
      map: "Karte",
    },
    party: {
      subtitle:
        "Gesamtsumme der veröffentlichten Spenden an {party} nach Herkunftsland in {country}.",
    },
    country: {
      title: "Spenden aus {country}",
      subtitle:
        "Gesamtsumme der veröffentlichten Spenden nach Herkunftsland in {country}, {years}.",
      summary:
        "In den Jahren {from} bis {until} wurden Spenden aus {stateCount} verschiedenen Bundesländern erfasst. Das Bundesland mit der höchsten Spendensumme ist {highestState} mit {highestSum}. Die meisten Spenden, nämlich {largesDonationCountNum}, kamen aus {largesDonationCountState}.",
    },
    elsewhere: {
      title: "Spenden aus dem Ausland",
      summary:
        "In den Jahren {from} bis {until} wurden Spenden aus {countryCount} verschiedenen anderen Ländern erfasst. Das Land mit der höchsten Spendensumme ist {highestCountry} mit {highestSum}. Die meisten Spenden, nämlich {largesDonationCountNum}, kamen aus {largesDonationCountState}.",
    },
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
      "7": "Tirol",
      "8": "Vorarlberg",
      "9": "Wien",
    },
    canada: {
      ON: "Ontario",
      QC: "Québec",
      NS: "Neuschottland",
      NB: "Neubraunschweig",
      MB: "Manitoba",
      BC: "Britisch-Kolumbien",
      PE: "Prinz-Edward-Insel",
      SK: "Saskatchewan",
      AB: "Alberta",
      NL: "Neufundland und Labrador",
      NT: "Nordwest-Territorien",
      YT: "Yukon",
      NU: "Nunavut",
    },
  },
  donor: {
    title: "Spenden des Spenders",
    subtitle: "Beiträge und Empfänger insgesamt",
    active_period: "Aktiver Zeitraum",
    type: "Spendentyp",
    summary:
      "{donor} hat insgesamt {sum} in Form von {count} Einzelspenden geleistet. Die durchschnittliche Spendengröße beträgt {avg}. Die Spenden wurden an {parties} verschiedene Parteien verteilt.",
    oldest:
      "Die erste Spende nach {minYear} erfolgte am {date} mit einem Betrag von {amount} an die {party}.",
    newest:
      "Die jüngste Spende wurde am {date} getätigt, wobei {amount} an die {party} gingen.",
    most_donations: "Am häufigsten wurden Spenden an {list} überwiesen.",
    most_donations_item: "{party} ({count})",
    highest_most_donation:
      "Das Jahr {biggestYear} zeichnete sich durch die höchste Gesamtspendensumme von {biggestSum} aus, während im Jahr {mostYear} die meisten Einzelspenden ({mostCount}) getätigt wurden.",
    biggest:
      "Die größte Einzelspende in Höhe von {amount} ging am {date} an die {party}.",
    tree_map: "Spenden von {name}",
    tree_map_subtitle:
      "Gesamtsumme der veröffentlichten Spenden an jede Partei in {country}.",
    biggest_amounts:
      "Die Spenden wurden hauptsächlich an eine ausgewählte Gruppe von Parteien gerichtet. Nachfolgend finden Sie eine Aufschlüsselung der Empfänger nach Betrag und Prozentsatz der Gesamtsumme:",
    table:
      "Dieser Abschnitt bietet einen umfassenden Überblick über alle einzelnen Spenden, die von {donor} getätigt wurden. Sie können die Tabelle nach Datum, Partei oder Betrag sortieren, um leicht zu erkunden, wie die Spenden im Laufe der Zeit und über die Empfänger verteilt wurden. Diese detaillierte Ansicht ermöglicht eine transparente Nachverfolgung jeder Zuwendung und bietet tiefere Einblicke in die Spendenmuster des Spenders.",

    timeline: {
      title: "Spendenentwicklung im Zeitverlauf",
      p0: "Dieser Abschnitt zeigt, wie sich die Spenden von {donor} seit {year} an verschiedene politische Parteien im Laufe der Zeit verändert haben. Das Diagramm visualisiert die insgesamt gespendete Summe, wobei der Anteil jeder Partei hervorgehoben wird, sodass leicht erkennbar ist, wann und wohin die Unterstützung ging.",
      p1: "Folgen Sie den Linien, um Muster, Spitzen oder Veränderungen im Spendenverhalten zu erkennen. Dieser Überblick bietet einen transparenten Einblick, wie die Beiträge eines Spenders auf das politische Spektrum verteilt sind.",
      years:
        "Die Spenden haben sich im Laufe der Jahre verändert. Folgend sehen Sie die Gesamtsummen der Spenden nach Jahr sowie den prozentualen Anteil jedes Jahres an den Gesamtdonationen dieses Spenders.",
      chart_subtitle:
        "Kumulative Spenden von {donor} an politische Parteien in {country}, angezeigt nach Betrag und Datum seit {minYear}.",
    },

    anonymized: {
      title: "Eintrag anonymisiert",
      description:
        "Die mit dieser Spende verknüpfte persönliche Identität wurde in Übereinstimmung mit einem gültigen DSGVO-Antrag entfernt. Der Spendenbetrag bleibt in die Gesamtberechnungen der Finanzierung einbezogen, um finanzielle Transparenz zu gewährleisten.",
    },

    redacted: {
      title: "Datensatz geschwärzt",
      description:
        "Die Identität der Spenderin bzw. des Spenders wurde von der veröffentlichenden Behörde vor der Veröffentlichung dieser Daten geschwärzt. Der Spendenbetrag bleibt in den Berechnungen der Gesamtfinanzierung enthalten, um die finanzielle Transparenz zu wahren.",
    },
  },
  countries: {
    "??": "Nicht angegeben",
    DE: "Deutschland",
    DK: "Dänemark",
    CH: "Schweiz",
    TH: "Thailand",
    AT: "Österreich",
    UK: "Großbritannien",
    NL: "Niederlande",
    EU: "Europäische Union",
    LV: "Lettland",
    ES: "Spanien",
    FI: "Finnland",
    HR: "Kroatien",
    BE: "Belgien",
    LU: "Luxemburg",
    SI: "Slowenien",
    EE: "Estland",
    FR: "Frankreich",
    IE: "Irland",
    IT: "Italien",
    PL: "Polen",
    RO: "Rumänien",
    CY: "Zypern",
    MT: "Malta",
    PT: "Portugal",
    LT: "Litauen",
    HU: "Ungarn",
    CZ: "Tschechien",
    SG: "Singapur",
    MC: "Monaco",
    SE: "Schweden",

    AD: "Andorra",
    IM: "Isle of Man",
    NO: "Norwegen",
    LI: "Liechtenstein",
    MK: "Mazedonien",
    AL: "Albanien",
    MD: "Moldawien",
    SM: "San Marino",
    FO: "Färöer Inseln",
    BA: "Bosnien und Herzegowina",
    ME: "Montenegro",
    BG: "Bulgarien",
    BY: "Belarus",
    GR: "Griechenland",
    IS: "Island",
    SK: "Slowakei",
    UA: "Ukraine",
    GB: "Vereinigtes Königreich",
    RS: "Serbien",
    AU: "Australien",
    ZA: "Südafrika",
    US: "Vereinigte Staaten",
    CA: "Kanada",
    GE: "Georgien",
    NZ: "Neuseeland",
    VE: "Venezuela",
  },
  ref_countries: {
    DE: "Deutschland",
    DK: "Dänemark",
    CH: "der Schweiz",
    TH: "Thailand",
    AT: "Österreich",
    UK: "Großbritannien",
    NL: "den Niederlanden",
    EU: "der Europäischen Union",
    LV: "Lettland",
    ES: "Spanien",
    FI: "Finnland",
    HR: "Kroatien",
    BE: "Belgien",
    LU: "Luxemburg",
    SI: "Slowenien",
    EE: "Estland",
    FR: "Frankreich",
    IE: "Irland",
    IT: "Italien",
    PL: "Polen",
    RO: "Rumänien",
    CY: "Zypern",
    CZ: "Tschechien",
    AU: "Australien",
    RS: "Serbien",
    CA: "Kanada",
    GE: "Georgien",
    NO: "Norwegen",
  },
  about: {
    title: "Über uns",
    description: {
      p0: "DonationWatch entstand aus der mangelnden Lesbarkeit von Daten auf der offiziellen Website des Deutschen Bundestags.",
      p1: "Unser Ziel ist es, dies zu verbessern, indem wir nur öffentlich verfügbare Daten verwenden und sie effektiver präsentieren.",
      p2: "Wir haben bemerkt, dass Länder wie Österreich, die Schweiz und die Niederlande Parteispenden unterschiedlich strukturiert veröffentlichen. Um ein einheitliches Interface zu schaffen, das den Zugang zu diesen Daten vereinfacht, haben wir diese Länder in unser Projekt einbezogen. Weitere Länder werden folgen, sobald wir die entsprechenden Daten finden und aufbereiten können.",
      p3: "Wenn Sie Anregungen oder Feedback haben, zögern Sie bitte nicht, uns",
      mail: "zu kontaktieren",
    },
    source:
      "Alle visualisierten Informationen stammen ausschließlich aus öffentlich zugänglichen Regierungsquellen und enthalten keine bisher unveröffentlichten Daten oder privaten Aufzeichnungen. Transparenz ist unsere Grundlage.",
  },
  imprint: {
    title: "Impressum",
  },
  privacy: {
    title: "Datenschutz",
    last_updated: "Zuletzt aktualisiert: {date}",
    effective_date: "Inkrafttreten: {date}",
    data: {
      title: "1. Datenerfassung",
      p: "Wir erfassen keine personenbezogenen Daten von Besuchern unserer Website. Dies umfasst:",
      li0: "Keine Registrierungsformulare",
      li1: "Keine Newsletter-Anmeldungen",
      li2: "Keine Benutzerkonten",
      li3: "Keine Cookies zu Tracking-Zwecken",
    },
    cf: {
      title: "2. Cloudflare-Dienste",
      link: "Cloudflare-Datenschutzrichtlinie anzeigen",
      p: "Wir nutzen zwei Cloudflare-Dienste:",
      workers: {
        summary:
          "Cloudflare Workers: Serverlose Plattform zur Inhaltsauslieferung (keine Verarbeitung von Nutzerdaten)",
      },
      analytics: {
        summary:
          "Cloudflare Web Analytics: Datenschutzorientierte Analysen, die:",
        li0: "Keine Cookies verwenden",
        li1: "Nur aggregierte Metriken erfassen",
      },
    },
    logs: {
      title: "3. Automatische Serverprotokolle",
      p: "Unser Hosting-Anbieter kann erfassen:",
      li0: "IP-Adressen (anonymisiert)",
      li1: "Anfragezeitstempel",
      li2: "Browserversionen/Gerätetypen",
      retention:
        "Diese Daten werden automatisch innerhalb von 7 Tagen gelöscht.",
    },
    contact: {
      title: "Kontakt",
      p: "Bei Datenschutzfragen:",
    },
  },
  fun: {
    link: "Wissenswertes",
    title: "Wissenswertes über öffentliche Daten",
    p0: "Diese Seite präsentiert interessante Entdeckungen aus unserer Arbeit mit öffentlich zugänglichen Regierungsdaten. Diese Beobachtungen sind keine Kritik, sondern eher kleine Besonderheiten, die in jedem großen Datensatz vorkommen können.",
    p1: "Obwohl wir gegebenenfalls Probleme melden, betrachten wir sie nicht als dringende Angelegenheiten, die von Regierungsinstitutionen behoben werden müssen. Unserer Erfahrung nach sind diese Organisationen aufgeschlossen und offen für Feedback.",
    reported_fixed:
      "Dies wurde dem {owner} gemeldet und von diesem korrigiert.",
    reported_wontfix:
      "Dies wurde der {owner} gemeldet und sie können es nicht ändern.",
    reported: "Dies wurde dem {owner} gemeldet.",
  },
  transparency: {
    title: "Transparenz",
    p0: "Wir bemühen uns, klare und konsistente Informationen über die Spender politischer Parteien bereitzustellen. Um dies zu erreichen, normalisieren wir automatisch bestimmte Spendernamen, um die Einheitlichkeit unserer Datenbank zu gewährleisten. Dieser Ansatz ermöglicht es uns, die Genauigkeit beizubehalten und gleichzeitig Diskrepanzen bei der Erfassung von Namen zu berücksichtigen.",
    p1: "Im Interesse der Transparenz haben wir eine Liste normalisierter Namen sowie deren Variationen aus unseren Spendendaten erstellt. Unten finden Sie jeden normalisierten Namen zusammen mit seinen Variationen. Diese Liste hilft zu erklären, warum Sie möglicherweise Spendernamen sehen, die nicht exakt so in unseren Quelldokumenten erscheinen.",
    section: {
      filtered_donors: "Gefilterte Spender",
      filtered_receivers: "Gefilterte Empfänger",
      aggregated: "Aggregierte Spender",
    },
    filtered_donors: {
      p0: "Um die tatsächlichen Quellen politischer Spenden korrekt abzubilden, filtern wir bestimmte Transaktionen heraus, bei denen es sich in Wirklichkeit um staatliche Zuwendungen und nicht um echte Spenden handelt. Da unsere Quelldatensätze diese nicht ausdrücklich kennzeichnen, stützen wir uns auf eine Reihe von Filterregeln auf Basis regulärer Ausdrücke (RegExp), um solche Einträge automatisch zu identifizieren und zu entfernen. Unten können Sie die vollständige Liste der angewandten RegExp-Filterregeln einsehen.",
      p1: "Unten finden Sie eine Liste der Spender, deren Beiträge gemäß unseren Kriterien und Filterregeln herausgefiltert wurden.",
    },
    filtered_receivers: {
      p0: "Um sicherzustellen, dass wir nur aussagekräftige Empfängerdaten darstellen, filtern wir auch bestimmte Empfänger oder Parteien heraus, die für die Spendernachverfolgung als irrelevant oder nicht operativ gelten. Da unsere Datensätze diese Empfänger nicht immer ausdrücklich kennzeichnen, wenden wir eine Reihe von RegExp-basierten Regeln an, um sie automatisch auszuschließen.",
      p1: "Unten können Sie die vollständige Liste der angewandten RegExp-Filterregeln einsehen.",
    },
    receivers: {
      title: "Aggregierte Empfänger",
      p0: "In {country} können Spenden an verschiedene organisatorische Einheiten innerhalb einer Partei gemeldet werden. Für Konsistenz konsolidieren wir zusammengehörige Empfängerentitäten zu einer Gesamtsumme auf Parteiebene. Die folgende Liste dokumentiert, welche Empfängerentitäten in jeder Partei aggregiert werden.",
    },
  },
  related: {
    donors: "Ähnliche Spender",
  },
  similar_donors: {
    title: "Netzwerk ähnlicher Spender",
    description:
      "Erkunden Sie das erweiterte Spendernetzwerk, das mit diesem Spender verbunden ist.",
    summary:
      "Im zugehörigen Spendernetzwerk gibt es {count} einzigartige Spender.",
    list_title: "Übersicht der Parteienverteilung",
  },

  detect_country: {
    title: "Es sieht so aus, als ob Sie in {country} sind.",
    description: "Tippen Sie, um politische Spenden in {country} zu erkunden.",
    action: "Spenden für {country} ansehen",
  },

  donor_type: {
    [DonorType.PublicFund]: "Öffentlicher Fonds",
    [DonorType.Individual]: "Einzelperson",
    [DonorType.Company]: "Unternehmen",
    [DonorType.Other]: "Sonstige",
    [DonorType.TradeUnion]: "Gewerkschaft",
    [DonorType.UnincorporatedAssociation]: "Nicht eingetragener Verein",
    [DonorType.RegisteredPoliticalParty]: "Registrierte politische Partei",
    [DonorType.Trust]: "Stiftung",
    [DonorType.FriendlySociety]: "Hilfsgesellschaft",
    [DonorType.LimitedLiabilityPartnership]:
      "Partnerschaft mit beschränkter Haftung",
    [DonorType.BuildingSociety]: "Bausparkasse",
    [DonorType.NonProfitLegalEntity]: "Gemeinnützige juristische Person",
    [DonorType.AnonymizedDonor]: "Anonymisierter Spender",
  } satisfies Record<DonorType, string>,

  other_countries: {
    title: "Andere Länder",
  },

  thanks:
    "Dank an Organisationen wie {external} für die Bereitstellung wertvoller Informationen über politische Spendenmechanismen.",

  export: {
    title: "Datenexport",
    p0: "Erhalten Sie den vollständigen Datensatz politischer Spenden für {country}, der auf dieser Website verwendet wird. Der Export enthält normalisierte Spendernamen, Beträge, Daten und Empfängerparteien.",
    p1: "Wichtig: Dies sind nicht die Rohdaten aus {source}. Dieser Datensatz enthält nur Spenden, die von unserem Team normalisiert und gefiltert wurden. Bitte lesen Sie unseren Abschnitt {transparency} zur Methodik.",
    license: "Lizenz: {license}",
    download: "{format} herunterladen",
    includes_donations: "{num} Spenden enthalten",
  },
  bar_chart_race: {
    title: "Balkendiagramm-Rennen",
    description:
      "Visualisiere die Entwicklung der Spendensummen im Zeitverlauf. Wähle einen Jahresbereich, um zu sehen, wie sich die Parteienfinanzierung dynamisch verändert.",
    from: "Von",
    to: "Bis",
    download_video: "Video herunterladen",
    rendering: "Rendering... {percentage}",
    no_data: "Für den ausgewählten Zeitraum sind keine Daten verfügbar.",
    note: "Bitte beachten Sie: Diese Animation wird clientseitig in Ihrem Browser gerendert und kann auf manchen Geräten ressourcenintensiv sein. Beim Herunterladen des Videos wird die vollständige Animation automatisch abgespielt.",
    individual_years: "Einzelne Jahre",
    animation_duration: "Animationsdauer",
    duration_s: "{seconds}s",
    group_by: {
      label: "Gruppieren nach",
      receiver: "Partei",
      donor: "Spender",
    },
  },
};

export default De;
