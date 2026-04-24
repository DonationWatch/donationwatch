import type { Metadata } from "next";
import type { ReactNode } from "react";

import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import type { ConstLocale } from "@/utils/locales";
import type { StrictNamespacedTranslator } from "@/utils/translator";

import { ErrorAlert, InfoAlert, SuccessAlert } from "@/components/alert";
import { Article, ArticleSection } from "@/components/layout/article";
import { NonCountryRootLayout } from "@/components/layout/non-country-root-layout";
import { formatTwoDigitDate } from "@/utils/formatter";
import { LOCALES } from "@/utils/locales";
import { generateAlternates } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";
import { isValidLocale } from "@/utils/validate";

export const dynamicParams = false;

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: PageProps<"/[locale]/fun">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  setRequestLocale(params.locale);

  const tFun = await getTranslations({
    locale: params.locale,
    namespace: "fun",
  });

  return {
    title: `${tFun("title")} | DonationWatch`,
    alternates: generateAlternates("fun"),
  };
}

const FunFact = ({
  locale,
  title,
  text,
  status,
  date,
  children,
  t,
}: {
  locale: ConstLocale;
  title: Record<ConstLocale, string>;
  text: Record<ConstLocale, string>;
  status?: { owner: string; type: "reported" | "fixed" | "wontfix" };
  date: string;
  children?: ReactNode;
  t: StrictNamespacedTranslator<"fun">;
}) => {
  return (
    <ArticleSection title={title[locale]}>
      <div className="space-y-4">
        <h3 className="text-sm">
          {formatTwoDigitDate(locale, new Date(date))}
        </h3>
        <p className="whitespace-pre-wrap">{text[locale]}</p>
        {children ? (
          <pre className="rounded-sm border border-slate-300 p-4 font-mono text-sm whitespace-pre-wrap lg:p-6 dark:border-slate-700">
            {children}
          </pre>
        ) : null}
      </div>
      {status ? (
        status.type === "reported" ? (
          <InfoAlert text={t("reported", { owner: status.owner })} />
        ) : status.type === "wontfix" ? (
          <ErrorAlert
            text={t("reported_wontfix", {
              owner: status.owner,
            })}
          />
        ) : (
          <SuccessAlert
            text={t("reported_fixed", {
              owner: status.owner,
            })}
          />
        )
      ) : null}
    </ArticleSection>
  );
};

export default async function Page(props: PageProps<"/[locale]/fun">) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  setRequestLocale(params.locale);

  const { locale } = params;

  const tFun = await getTranslations({ locale, namespace: "fun" });

  return (
    <NonCountryRootLayout locale={locale}>
      <Article
        className={"max-w-4xl"}
        title={tFun("title")}
        subtitle={
          <>
            <p>{tFun("p0")}</p>
            <p>{tFun("p1")}</p>
          </>
        }
      >
        <FunFact
          locale={locale}
          t={tFun}
          date={"2026-04-21"}
          status={{
            owner: "The National Cyber Security Centre (NCSC)",
            type: "fixed",
          }}
          title={{
            en: "Election Security: The 'Western Britain' Anomaly",
            de: "Wahlsicherheit: Die 'West-Britannien' Anomalie",
            et: "Valimiste turvalisus: 'Lääne-Britannia' anomaalia",
            nl: "Verkiezingsbeveiliging: De 'West-Brittannië' anomalie",
            cs: "Volební bezpečnost: Anomálie 'Západní Británie'",
            lv: "Vēlēšanu drošība: 'Rietumbritānijas' anomālija",
            hr: "Sigurnost izbora: Anomalija 'Zapadne Britanije'",
            no: "Valgsikkerhet: 'Vest-Storbritannia'-anomalien",
            uk: "Безпека виборів: Аномалія 'Західної Британії'",
            fr: "Sécurité électorale : L'anomalie de la 'Bretagne occidentale'",
          }}
          text={{
            en: 'With the 2026 Senedd elections just days away, we detected a suspicious domain (reform-uk-wales[.]com) presenting itself as a regional branch of Reform UK. The site contained Russian metadata describing Wales as "Western Britain." In a display of active evasion, the operators scrubbed the code live while we were investigating. Following our reports, major browsers blacklisted the site as a dangerous phishing threat.\n\nShortly after being flagged, the site operators pivoted, replacing deceptive newsletter forms with a bare CMS login portal—a tactic often used to bypass automated security scanners once a domain is "burned" by public exposure.\n\nAs of April 23, the domain is completely offline. Technical audits confirm that the hosting provider has issued a global REFUSED status for all DNS queries, indicating that the provider administratively terminated the zone, rendering the site unreachable worldwide.',
            de: "Wenige Tage vor den Senedd-Wahlen 2026 entdeckten wir eine verdächtige Domain (reform-uk-wales[.]com), die sich als regionaler Ableger von Reform UK ausgab. Die Website enthielt russische Metadaten, die Wales als „Westbritannien“ beschrieben. In einem Akt aktiver Verschleierung löschten die Betreiber den Code live während unserer Untersuchung. Nach unseren Berichten setzten die gängigen Browser die Website als gefährliche Phishing-Drohung auf die Sperrliste.\n\nKurz nach der Kennzeichnung änderten die Betreiber ihre Taktik und ersetzten täuschende Newsletter-Formulare durch ein einfaches CMS-Anmeldeportal – eine Taktik, die häufig angewendet wird, um automatisierte Sicherheitsscanner zu umgehen, sobald eine Domain durch öffentliche Aufmerksamkeit „verbrannt“ ist.\n\nSeit dem 23. April ist die Domain vollständig offline. Technische Audits bestätigen, dass der Hosting-Provider für alle DNS-Anfragen einen globalen REFUSED-Status ausgegeben hat, was darauf hindeutet, dass der Provider die Zone administrativ beendet hat.",
            et: "Vaid mõned päevad enne 2026. aasta Seneddi valimisi tuvastasime kahtlase domeeni (reform-uk-wales[.]com), mis esitles end Reform UK piirkondliku haruna. Sait sisaldas venekeelseid metaandmeid, mis kirjeldasid Walesi kui „Lääne-Britanniat“. Aktiivse kõrvalehoidmise märgina puhastasid haldajad koodi reaalajas meie uurimise ajal. Pärast meie teateid kandsid peamised veebibrauserid saidi ohtliku kalastusründe ohuna musta nimekirja.\n\nVarsti pärast märgistamist muutsid haldajad taktikat, asendades petlikud uudiskirja vormid tühja CMS-i sisselogimisportaaliga – seda taktikat kasutatakse sageli automatiseeritud turvaskanneritest möödahiilimiseks, kui domeen on avaliku kokkupuute tõttu „põlenud“.\n\n23. aprilli seisuga on domeen täielikult maas. Tehnilised auditid kinnitavad, et majutusteenuse pakkuja on väljastanud kõigile DNS-päringutele globaalse REFUSED-staatuse, mis viitab sellele, et teenusepakkuja lõpetas tsooni administratiivselt.",
            nl: "Met de Senedd-verkiezingen van 2026 in zicht, hebben we een verdacht domein (reform-uk-wales[.]com) gedetecteerd dat zich voordeed als een regionale afdeling van Reform UK. De site bevatte Russische metadata waarin Wales werd beschreven als „West-Brittannië”. Als uiting van actieve ontwijking wisten de beheerders de code live te wissen terwijl wij onderzoek deden. Naar aanleiding van onze meldingen hebben grote browsers de site op de zwarte lijst gezet als een gevaarlijke phishingdreiging.\n\nKort nadat de site was gemarkeerd, veranderden de beheerders van aanpak en vervingen ze misleidende nieuwsbrief-formulieren door een kaal CMS-inlogportaal – een tactiek die vaak wordt gebruikt om automatische beveiligingsscanners te omzeilen zodra een domein „verbrand” is.\n\nSinds 23 april is het domein volledig offline. Technische audits bevestigen dat de hostingprovider een globale REFUSED-status heeft afgegeven voor alle DNS-vragen, wat aangeeft dat de provider de zone administratief heeft beëindigd.",
            cs: "Jen několik dní před volbami do Seneddu v roce 2026 jsme zachytili podezřelou doménu (reform-uk-wales[.]com), která se vydávala za regionální pobočku Reform UK. Web obsahoval ruská metadata popisující Wales jako „Západní Británii“. V rámci aktivního vyhýbání se odhalení provozovatelé během našeho vyšetřování kód živě smazali. Na základě našich zpráv zařadily hlavní prohlížeče web na černou listinu jako nebezpečnou phishingovou hrozbu.\n\nKrátce poté, co byl web označen, změnili provozovatelé taktiku a nahradili klamavé formuláře prostým přihlašovacím portálem CMS – tato taktika se často používá k obcházení automatických bezpečnostních skenerů poté, co byla doména veřejným odhalením „prozrazena“.\n\nK 23. dubnu je doména zcela offline. Technické audity potvrzují, že poskytovatel hostingu vydal pro všechny dotazy DNS globální stav REFUSED, což naznačuje, že poskytovatel administrativně ukončil zónu.",
            lv: "Tikai dažas dienas pirms 2026. gada Seneda vēlēšanām mēs konstatējām aizdomīgu domēnu (reform-uk-wales[.]com), kas uzdevās par Reform UK reģionālo nodaļu. Vietne saturēja krievu valodas metadatus, kas aprakstīja Velsu kā „Rietumbritāniju”. Aktīvas izvairīšanās nolūkā operatori mūsu izmeklēšanas laikā tiešraidē izdzēsa kodu. Pēc mūsu ziņojumiem lielākās pārlūkprogrammas iekļāva vietni melnajā sarakstā kā bīstamu pikšķerēšanas apdraudējumu.\n\nDrīz pēc tam, kad vietne tika atzīmēta, operatori mainīja taktiku, aizstājot maldinošās formas ar vienkāršu CMS pieteikšanās portālu – šī taktika bieži tiek izmantota, lai apietu automatizētos drošības skenerus, kad domēns ir „sadedzināts” publiskas atklāšanas rezultātā.\n\nSākot ar 23. aprīli, domēns ir pilnībā bezsaistē. Tehniskie auditi apstiprina, ka mitināšanas pakalpojumu sniedzējs visiem DNS pieprasījumiem ir piešķīris globālu REFUSED statusu, kas norāda, ka pakalpojumu sniedzējs administratīvi pārtrauca zonu.",
            hr: "Samo nekoliko dana prije izbora za Senedd 2026., otkrili smo sumnjivu domenu (reform-uk-wales[.]com) koja se predstavljala kao regionalni ogranak stranke Reform UK. Stranica je sadržavala ruske metapodatke koji opisuju Wales kao „Zapadnu Britaniju”. U činu aktivnog izbjegavanja, operateri su izbrisali kôd uživo dok smo provodili istragu. Nakon naših prijava, glavni preglednici stavili su web stranicu na crnu listu kao opasnu phishing prijetnju.\n\nUbrzo nakon što je stranica označena, operateri su promijenili taktiku, zamijenivši obmanjujuće obrasce jednostavnim CMS portalom za prijavu – taktika koja se često koristi za zaobilaženje automatskih sigurnosnih skenera nakon što je domena „razotkrivena”.\n\nOd 23. travnja domena je potpuno izvan mreže. Tehničke revizije potvrđuju da je pružatelj usluga udomljavanja izdao globalni status REFUSED za sve DNS upite, što ukazuje na to da je pružatelj administrativno ugasio zonu.",
            no: "Med bare dager igjen til Senedd-valget i 2026, oppdaget vi et mistenkelig domene (reform-uk-wales[.]com) som utga seg for å være en regional avdeling av Reform UK. Nettstedet inneholdt russiske metadata som beskrev Wales som «Vest-Britannia». I et forsøk på aktiv unndragelse slettet operatørene koden direkte mens vi etterforsket. Etter våre rapporter har store nettlesere svartelistet nettstedet som en farlig phishing-trussel.\n\nKort tid etter å ha blitt flagget, endret operatørene taktikk og erstattet villedende nyhetsbrev-skjemaer med en enkel CMS-innloggingsportal – en taktikk som ofte brukes for å omgå automatiserte sikkerhetsskannere når et domene er blitt «avslørt».\n\nPer 23. april er domenet helt nede. Tekniske revisjoner bekrefter at hostingleverandøren har utstedt en global REFUSED-status for alle DNS-forespørsler, noe som indikerer at leverandøren administrativt har avsluttet sonen.",
            uk: "За лічені дні до виборів до Сенедду 2026 року ми виявили підозрілий домен (reform-uk-wales[.]com), який видавав себе за регіональне відділення партії Reform UK. Сайт містив російські метадані, що описували Уельс як «Західну Британію». Проявляючи активне ухилення, оператори видалили код у прямому ефірі, поки ми проводили розслідування. Після наших звітів основні браузери внесли сайт до чорного списку як небезпечну фішингову загрозу.\n\nНевдовзі після того, як сайт було позначено, оператори змінили тактику, замінивши оманливі форми простим порталом входу в CMS — ця тактика часто використовується для обходу автоматизованих сканерів безпеки, коли домен стає «скомпрометованим».\n\nСтаном на 23 квітня домен повністю не працює. Технічний аудит підтверджує, що хостинг-провайдер видав глобальний статус REFUSED для всіх DNS-запитів, що свідчить про адміністративне закриття зони провайдером.",
            fr: "À quelques jours des élections du Senedd de 2026, nous avons détecté un domaine suspect (reform-uk-wales[.]com) se présentant comme une branche régionale de Reform UK. Le site contenait des métadonnées russes décrivant le Pays de Galles comme la « Bretagne occidentale ». Dans une tentative d'évasion active, les opérateurs ont effacé le code en direct pendant que nous enquêtions. Suite à nos rapports, les principaux navigateurs ont mis le site sur liste noire en tant que menace de phishing dangereuse.\n\nPeu de temps après avoir été signalé, les opérateurs du site ont changé de stratégie, remplaçant les formulaires trompeurs par un simple portail de connexion CMS — une tactique souvent utilisée pour contourner les scanners de sécurité automatisés une fois qu'un domaine est « grillé ».\n\nDepuis le 23 avril, le domaine est complètement hors ligne. Des audits techniques confirment que l'hébergeur a émis un statut REFUSED mondial pour toutes les requêtes DNS, indiquant que le fournisseur a mis fin administrativement à la zone.",
          }}
        >
          {`<meta property="og:description" content="Сделано только для аудитории в западной части Британии.">`}
        </FunFact>

        <FunFact
          t={tFun}
          locale={locale}
          status={{
            owner:
              "Authority for European Political Parties and European Political Foundations",
            type: "fixed",
          }}
          title={{
            en: "EU Donations documents mix-up",
            de: "Verwechslung bei EU-Spendendokumenten",
            et: "EL-i annetuste dokumentide segadus",
            nl: "Verwarring met EU-donatiedocumenten",
            cs: "Záměna dokumentů o darování v EU",
            lv: "ES ziedojumu dokumentu sajaukums",
            hr: "Zamjena dokumenata o donacijama EU-a",
            no: "EU-donasjonsdokumenter blandet sammen",
            uk: "Плутанина з документами про пожертвування ЄС",
            fr: "Confusion autour des documents de dons de l'UE",
          }}
          text={{
            en: "The 2025 donations page for European political parties mistakenly links party donations to an older version of the foundations report.",
            de: "Die Spendenseite 2025 für europäische politische Parteien verweist fälschlicherweise auf eine ältere Version des Stiftungsberichts.",
            et: "2025. aasta Euroopa erakondade annetuste leht viitab ekslikult fondi aruande vanemale versioonile.",
            nl: "De donatiepagina van 2025 voor Europese politieke partijen verwijst per ongeluk naar een oudere versie van het stichtingsrapport.",
            cs: "Stránka s dary za rok 2025 pro evropské politické strany omylem odkazuje na starší verzi zprávy o nadacích.",
            lv: "2025. gada Eiropas politisko partiju ziedojumu lapa kļūdaini norāda uz vecāku fonda ziņojuma versiju.",
            hr: "Stranica o donacijama za 2025. godinu za europske političke stranke pogrešno povezuje donacije stranaka sa starijom verzijom izvješća zaklade.",
            no: "Siden for donasjoner i 2025 for europeiske politiske partier lenker ved en feil til en eldre versjon av stiftelsesrapporten.",
            uk: "Сторінка пожертвувань для європейських політичних партій за 2025 рік помилково містить посилання на старішу версію звіту про фонди.",
            fr: "La page des dons de 2025 pour les partis politiques européens contient par erreur un lien vers une version plus ancienne du rapport sur les fondations.",
          }}
          date={"2025-11-03"}
        >
          {`<a
  href="/cmsdata/293644/2025 FOUNDATIONS Donations table as of 2025-03-11.pdf"
  target="_blank"
>
  2025 PARTIES Donations
</a>
`}
        </FunFact>
        <FunFact
          t={tFun}
          locale={locale}
          title={{
            en: "Czech test donations",
            de: "Tschechische Testspenden",
            et: "Tšehhi testannetused",
            nl: "Tsjechische testdonaties",
            cs: "České testovací dary",
            lv: "Čehijas testa ziedojumi",
            hr: "Češke probne donacije",
            no: "Tsjekkiske testdonasjoner",
            uk: "Чеські тестові пожертвування",
            fr: "Dons de test tchèques",
          }}
          text={{
            en: 'The Czech ÚDHPSH seems to prepare their annual donation dataset with test data. ("Česká zkušební strana" can be translated to "Czech Testing Party").',
            de: "Die tschechische ÚDHPSH scheint ihren jährlichen Spendedatensatz mit Testdaten vorzubereiten. („Česká zkušební strana“ kann als „Tschechische Testpartei“ übersetzt werden.)",
            et: "Tundub, et Tšehhi ÚDHPSH valmistab oma iga-aastast annetuste andmekogumit testandmetega. („Česká zkušební strana“ tähendab „Tšehhi testipartei“.)",
            nl: "De Tsjechische ÚDHPSH lijkt hun jaarlijkse donatiegegevensset met testgegevens voor te bereiden. („Česká zkušební strana“ kan worden vertaald als „Tsjechische testpartij“.)",
            cs: "Česká ÚDHPSH zřejmě připravuje svůj každoroční datový soubor darů s testovacími daty. („Česká zkušební strana“ lze přeložit jako „Czech Testing Party“.)",
            lv: "Izskatās, ka Čehijas ÚDHPSH sagatavo savu ikgadējo ziedojumu datu kopu ar testa datiem. („Česká zkušební strana“ var tulkot kā „Čehijas testēšanas partija“.)",
            hr: "Čini se da češki ÚDHPSH priprema svoj godišnji skup podataka o donacijama s probnim podacima. („Česká zkušební strana“ može se prevesti kao „Češka probna stranka“.)",
            no: 'Tsjekkias ÚDHPSH ser ut til å forberede sitt årlige donasjonsdatasett med testdata. ("Česká zkušební strana" kan oversettes til "Tsjekkiske testparti").',
            uk: "Чеський ÚDHPSH, схоже, готує свій щорічний набір даних про пожертвування з тестовими даними. («Česká zkušební strana» можна перекласти як «Чеська тестова партія»).",
            fr: 'Il semble que l\'ÚDHPSH tchèque prépare son ensemble de données de dons annuel avec des données de test. ("Česká zkušební strana" peut être traduit par "Parti de test tchèque").',
          }}
          date={"2025-10-24"}
        >
          {JSON.stringify(
            {
              shortName: "ČZS",
              longName: "Česká zkušební strana",
              donations: [
                {
                  money: 1500,
                  lastName: "Druhý",
                  firstName: "Tester",
                },
                {
                  money: 300,
                  lastName: "Testovač",
                  firstName: "Testovací",
                },
              ],
            },
            null,
            " ",
          )}
        </FunFact>
        <FunFact
          t={tFun}
          locale={locale}
          title={{
            en: "Typo Challenge in the AEC Dataset",
            de: "Typo-Herausforderung im AEC-Datensatz",
            et: "Trükivigade väljakutse AEC andmekogus",
            nl: "Typo-uitdaging in de AEC Dataset",
            cs: "Výzva překlepů v datové sadě AEC",
            lv: "Nepareizrakstības izaicinājums AEC datu kopā",
            hr: "Izazov s tipfelerima u AEC skupu podataka",
            no: "Typo-utfordring i AEC-datasettet",
            uk: "Виклик друкарських помилок у наборі даних AEC",
            fr: "Défi de fautes de frappe dans le jeu de données AEC",
          }}
          text={{
            en: 'While working with the Australian Electoral Commission’s “Detailed Receipts” dataset, we noticed creative spelling in the "received from" field. For example, WESTPAC BAKING CORPORATION appears as if someone traded banking for cakes! We’ve also come across at least eight inventive spelling attempts for the word "association.".',
            de: "Beim Arbeiten mit dem „Detailed Receipts“-Datensatz der Australian Electoral Commission haben wir kreative Schreibweisen im Feld „received from“ bemerkt. Zum Beispiel erscheint WESTPAC BAKING CORPORATION, als hätte jemand Bankgeschäfte gegen Kuchen getauscht! Außerdem sind wir auf mindestens acht erfinderische Schreibversuche für das Wort „association“ gestoßen.",
            et: "Töötades Australian Electoral Commissioni „Detailed Receipts“ andmekoguga, märkasime loomingulisi kirjaviisivigu „received from“ väljal. Näiteks on WESTPAC BAKING CORPORATION toodud kujul, justkui keegi oleks panganduse koogitegemise vastu vahetanud! Samuti oleme kohanud vähemalt kaheksat uudset katset kirjutada sõna „association“.",
            nl: "Bij het werken met de 'Detailed Receipts'-dataset van de Australian Electoral Commission viel ons creatieve spelling op in het veld 'received from'. Zo lijkt WESTPAC BAKING CORPORATION wel alsof iemand bankzaken heeft verwisseld voor taarten! Ook kwamen we minstens acht originele spellingspogingen voor het woord 'association' tegen.",
            cs: "Při práci s datovou sadou „Detailní příjmy“ od Australian Electoral Commission jsme si všimli kreativního pravopisu v poli „received from“. Například WESTPAC BAKING CORPORATION působí, jako by někdo vyměnil bankovnictví za pečení! Narazili jsme také na nejméně osm vynalézavých pokusů o napsání slova „association“.",
            lv: "Strādājot ar Austrālijas Vēlēšanu komisijas „Detailed Receipts” datu kopu, pamanījām radošu pareizrakstību laukā „received from”. Piemēram, WESTPAC BAKING CORPORATION izskatās, it kā kāds būtu banku nomainījis pret kūkām! Esam saskārušies arī vismaz ar astoņiem izgudrojuma mēģinājumiem vārda „association” pareizrakstībā.",
            hr: "Dok smo radili s „Detailed Receipts“ skupom podataka Australske izborne komisije, primijetili smo kreativno pisanje u polju „received from“. Na primjer, WESTPAC BAKING CORPORATION izgleda kao da je netko zamijenio bankarstvo za kolače! Također smo naišli na najmanje osam domišljatih pokušaja pravopisa riječi „association“.",
            no: "Mens vi jobbet med Australian Electoral Commissions 'Detailed Receipts'-datasett, la vi merke til kreativ staving i feltet 'received from'. For eksempel ser WESTPAC BAKING CORPORATION ut som om noen har byttet bankvirksomhet mot kaker! Vi har også kommet over minst åtte oppfinnsomme staveforsøk for ordet 'association'.",
            uk: "Працюючи з набором даних «Детальні квитанції» Австралійської виборчої комісії, ми помітили творче написання в полі «отримано від». Наприклад, WESTPAC BAKING CORPORATION виглядає так, ніби хтось проміняв банківську справу на випічку! Ми також натрапили щонайменше на вісім винахідливих спроб написання слова «association».",
            fr: 'En travaillant avec le jeu de données "Detailed Receipts" de la Commission électorale australienne, nous avons remarqué une orthographe créative dans le champ "received from". Par exemple, WESTPAC BAKING CORPORATION semble indiquer que quelqu\'un a échangé les services bancaires contre des gâteaux ! Nous avons également rencontré au moins huit tentatives d\'orthographe inventives pour le mot "association".',
          }}
          date={"2025-08-08"}
        >
          association
          <br />
          associatiion
          <br />
          assocation
          <br />
          associatio
          <br />
          assocn
          <br />
          assoc
          <br />
          associoation
          <br />
          associaton
          <br />
          associaiton
        </FunFact>
        <FunFact
          t={tFun}
          locale={locale}
          title={{
            en: "UK Electoral Commission search site down after SSL certificate expiry",
            de: "Suchseite der britischen Wahlkommission nach Ablauf des SSL-Zertifikats nicht erreichbar",
            et: "Suurbritannia Valimiskomisjoni otsinguleht pole saadaval pärast SSL-sertifikaadi aegumist",
            nl: "Zoekpagina van de Britse Kiescommissie niet bereikbaar na afloop SSL-certificaat",
            cs: "Vyhledávací stránka britské volební komise nedostupná po vypršení platnosti SSL certifikátu",
            lv: "Apvienotās Karalistes vēlēšanu komisijas meklēšanas vietne nav pieejama pēc SSL sertifikāta termiņa beigām",
            hr: "Pretraživač stranica Britanske izborne komisije nedostupan nakon isteka SSL certifikata",
            no: "UK Electoral Commission søkeside nede etter utløp av SSL-sertifikat",
            uk: "Пошуковий сайт Виборчої комісії Великої Британії не працює після закінчення терміну дії SSL-сертифіката",
            fr: "Le site de recherche de la Commission électorale britannique est en panne après l'expiration du certificat SSL",
          }}
          text={{
            en: "The search portal for the UK Electoral Commission became unavailable due to an expired SSL certificate, blocking secure access for users.",
            de: "Das Suchportal der britischen Wahlkommission wurde aufgrund eines abgelaufenen SSL-Zertifikats unerreichbar, wodurch der sichere Zugriff für Nutzer blockiert wurde.",
            et: "Suurbritannia Valimiskomisjoni otsingupäringu portaal muutus kättesaamatu tänu aegunud SSL-sertifikaadile, mis blokeeris kasutajate turvalise ligipääsu.",
            nl: "Het zoekportaal van de Britse Kiescommissie werd onbereikbaar door een verlopen SSL-certificaat, waardoor gebruikers geen veilige toegang meer hadden.",
            cs: "Vyhledávací portál britské volební komise se stal nedostupným kvůli vypršení platnosti SSL certifikátu, čímž byla zablokována bezpečná přístupnost pro uživatele.",
            lv: "Apvienotās Karalistes vēlēšanu komisijas meklēšanas portāls kļuva nepieejams, jo SSL sertifikāts bija beidzies, bloķējot drošu piekļuvi lietotājiem.",
            hr: "Pretraživački portal Britanske izborne komisije postao je nedostupan zbog isteka SSL certifikata, čime je blokiran siguran pristup korisnicima.",
            no: "Søkeportalen for UK Electoral Commission ble utilgjengelig på grunn av et utløpt SSL-sertifikat, noe som blokkerte sikker tilgang for brukere.",
            uk: "Пошуковий портал Виборчої комісії Великої Британії став недоступним через прострочений SSL-сертифікат, що заблокувало безпечний доступ для користувачів.",
            fr: "Le portail de recherche de la Commission électorale britannique est devenu indisponible en raison d'un certificat SSL expiré, bloquant l'accès sécurisé pour les utilisateurs.",
          }}
          status={{
            type: "fixed",
            owner: "The Electoral Commission",
          }}
          date={"2025-06-07"}
        >
          This Connection is Invalid. SSL certificate expired.
          <br />
          <br />
          Site: search.electoralcommission.org.uk
          <br />
          Certificate CN: search.electoralcommission.org.uk
          <br />
          Certificate Authority: GeoTrust TLS RSA CA G1
          <br />
          Certificate Validity:
          <br />
          Not Before: Jul 8 00:00:00 2024 GMT
          <br />
          Not After: Jun 6 23:59:59 2025 GMT
        </FunFact>
        <FunFact
          t={tFun}
          locale={locale}
          title={{
            en: "Missing documents in the Croatian database",
            de: "Fehlende Dokumente in der kroatischen Datenbank",
            et: "Puuduvad dokumendid Horvaatia andmebaasis",
            nl: "Ontbrekende documenten in de Kroatische database",
            cs: "Chybějící dokumenty v chorvatské databázi",
            lv: "Trūkstošie dokumenti Horvātijas datubāzē",
            hr: "Nedostajući dokumenti u hrvatskoj bazi podataka",
            no: "Manglende dokumenter i den kroatiske databasen",
            uk: "Відсутні документи в хорватській базі даних",
            fr: "Documents manquants dans la base de données croate",
          }}
          text={{
            en: 'The State Electoral Commission of the Republic of Croatia\'s database is missing certain party documents from 2019 and 2020, including lists of donations. These documents were previously linked but now return a "404 Not Found" error.',
            de: 'Die Datenbank der Staatswahlkommission der Republik Kroatien fehlt es an bestimmten Parteidokumenten aus den Jahren 2019 und 2020, darunter Spendenlisten. Diese Dokumente waren zuvor verlinkt, liefern jetzt jedoch einen "404 Nicht gefunden"-Fehler.',
            et: 'Horvaatia Vabariigi Riikliku Valimiskomisjoni andmebaasist puuduvad teatud erakondade dokumendid aastatest 2019 ja 2020, sealhulgas annetuste loendid. Need dokumendid olid varem lingitud, kuid nüüd tagastavad "404 Ei leitud" vea.',
            nl: 'De database van de Staatsverkiezingscommissie van de Republiek Kroatië ontbeert bepaalde partijdocumenten uit 2019 en 2020, waaronder donatielijsten. Deze documenten waren eerder gelinkt, maar geven nu een "404 Niet gevonden"-fout.',
            cs: 'Databáze Státní volební komise Republiky Chorvatsko chybí jisté stranické dokumenty z let 2019 a 2020, včetně seznamů darů. Tyto dokumenty byly dříve propojeny, nyní však vracejí chybu "404 Nenalezeno".',
            lv: 'Horvātijas Republikas Valsts vēlēšanu komisijas datubāzē trūkst noteikti partiju dokumenti no 2019. un 2020. gada, tostarp ziedojumu saraksti. Šie dokumenti bija iepriekš saistīti, bet tagad atgriež "404 Nav atrasts" kļūdu.',
            hr: 'Baza podataka Državne izborne komisije Republike Hrvatske nedostaje određeni stranački dokumenti iz 2019. i 2020. godine, uključujući i popise donacija. Ti dokumenti su ranije bili povezani, ali sada vraćaju grešku "404 Nije pronađeno".',
            no: "Databasen til Statens valgkommisjon i Republikken Kroatia mangler visse partidokumenter fra 2019 og 2020, inkludert lister over donasjoner. Disse dokumentene var tidligere",
            uk: "У базі даних Державної виборчої комісії Республіки Хорватія відсутні певні партійні документи за 2019 і 2020 роки, включаючи списки пожертвувань. Раніше на ці документи були посилання, але зараз вони повертають помилку «404 Не знайдено».",
            fr: "La base de données de la Commission électorale de l'État de la République de Croatie manque certains documents de parti de 2019 et 2020, y compris les listes de dons. Ces documents étaient précédemment liés mais renvoient maintenant une erreur « 404 Not Found ».",
          }}
          status={{
            type: "fixed",
            owner: "Državno izborno povjerenstvo Republike Hrvatske",
          }}
          date={"2025-03-06"}
        >
          <ul>
            <li>2019 - HRVATSKA BRANITELJSKA PUČKA STRANKA - HBPS</li>
            <li>2019 - STRANKA UMIROVLJENIKA - SU</li>
            <li>
              2020 - MAKSIMIRSKA GRAĐANSKA INICIJATIVA - ZAJEDNO - MGI - ZAJEDNO
            </li>
            <li>2020 - ŽELJKO KERUM - HRVATSKA GRAĐANSKA STRANKA - HGS</li>
          </ul>
        </FunFact>
        <FunFact
          t={tFun}
          locale={locale}
          title={{
            en: "EU foundation donation country code uses Greek unicode characters",
            de: "EU-Stiftungsspenden-Ländercode verwendet griechische Unicode-Zeichen",
            et: "ELi sihtasutuse annetuse riigikood kasutab kreeka unikoodimärke.",
            nl: "De landcode voor EU-stichtingsdonaties gebruikt Griekse unicode-tekens",
            cs: "Kód země nadace EU používá řecké znaky Unicode",
            lv: "ES fonda ziedojumu valsts kods izmanto grieķu unikoda rakstzīmes",
            hr: "Šifra države donacije zaklade EU koristi grčke unicode znakove",
            no: "EU-stiftelses donasjonslandskode bruker greske unicode-tegn",
            uk: "Код країни пожертвування фонду ЄС використовує грецькі символи Юнікоду",
            fr: "Le code pays de don de la fondation de l'UE utilise des caractères Unicode grecs",
          }}
          text={{
            en:
              "There was one donation in the 2021 EU foundation document that randomly used Greek unicode characters to represent the ISO country code for Belgium " +
              "(GREEK CAPITAL LETTER BETA and GREEK CAPITAL LETTER EPSILON). Everywhere else, they correctly use the ASCII characters instead.",
            de: "Es gab eine Spende im EU-Gründungsdokument 2021, bei der willkürlich griechische Unicode-Zeichen zur Darstellung des ISO-Ländercodes für Belgien verwendet wurden (GREEK CAPITAL LETTER BETA and GREEK CAPITAL LETTER EPSILON). Überall sonst werden stattdessen korrekt die ASCII-Zeichen verwendet.",
            et: "ELi 2021. aasta alusdokumendis oli üks annetus, milles kasutati juhuslikult Kreeka unikoodimärke Belgia ISO riigikoodi tähistamiseks (GREEK CAPITAL LETTER BETA and GREEK CAPITAL LETTER EPSILON). Kõikjal mujal kasutatakse selle asemel korrektselt ASCII-märke.",
            nl: "Er was één donatie in het EU-stichtingsdocument van 2021 die willekeurig Griekse unicode-tekens gebruikte om de ISO-landencode voor België weer te geven (GREEK CAPITAL LETTER BETA and GREEK CAPITAL LETTER EPSILON). Overal elders worden de ASCII-tekens correct gebruikt.",
            cs: "V dokumentu o založení EU v roce 2021 byl jeden dar, který náhodně použil řecké znaky unicode pro reprezentaci kódu ISO země Belgie (GREEK CAPITAL LETTER BETA and GREEK CAPITAL LETTER EPSILON). Všude jinde se místo toho správně používají znaky ASCII.",
            lv: "2021. gada ES dibināšanas dokumentā bija viens ziedojums, kurā Beļģijas ISO valsts koda apzīmēšanai nejauši tika izmantotas grieķu vienkoda zīmes (GREEK CAPITAL LETTER BETA and GREEK CAPITAL LETTER EPSILON). Visur citur tā vietā pareizi izmantotas ASCII rakstzīmes.",
            hr: "Postojala je jedna donacija u temeljnom dokumentu EU-a za 2021. koja je nasumično koristila grčke unicode znakove za predstavljanje ISO koda zemlje za Belgiju (GREEK CAPITAL LETTER BETA i GREEK CAPITAL LETTER EPSILON). Svugdje drugdje ispravno koriste ASCII znakove.",
            no: "Det var en donasjon i 2021 EU-stiftelsesdokumentet som tilfeldig brukte greske unicode-tegn for å representere ISO-landskoden for Belgia (GREEK CAPITAL LETTER BETA and GREEK CAPITAL LETTER EPSILON). Overalt ellers bruker de i stedet korrekt ASCII-tegn.",
            uk: "У документі про заснування ЄС у 2021 році було одне пожертвування, у якому випадковим чином використовувалися грецькі символи Юнікоду для позначення ISO-коду країни Бельгії (GREEK CAPITAL LETTER BETA та GREEK CAPITAL LETTER EPSILON). В усіх інших випадках вони правильно використовують символи ASCII.",
            fr: "Il y avait un don dans le document de fondation de l'UE de 2021 qui utilisait aléatoirement des caractères Unicode grecs pour représenter le code pays ISO pour la Belgique (GREEK CAPITAL LETTER BETA et GREEK CAPITAL LETTER EPSILON). Partout ailleurs, ils utilisent correctement les caractères ASCII à la place.",
          }}
          date={"2024-12-10"}
          status={{
            type: "reported",
            owner:
              "Authority for European Political Parties and European Political Foundations",
          }}
        >
          NOVE SA;<span className="font-black text-red-800">ΒΕ</span>;6000
          <br />
          NOVE SA;<span className="font-black text-green-800">BE</span>;6000
        </FunFact>
        <FunFact
          t={tFun}
          locale={locale}
          title={{
            en: "Australia had some donations dated to 2106",
            de: "Australien hatte einige Spenden, die auf das Jahr 2106 datiert waren.",
            et: "Austraalias olid mõned annetused dateeritud 2106. aastani",
            nl: "Australië had een aantal donaties gedateerd op 2106",
            cs: "Austrálie měla několik darů datovaných do roku 2106",
            lv: "Austrālijā bija daži ziedojumi, kas datēti ar 2106. gadu",
            hr: "Australija je imala neke donacije iz 2106",
            no: "Australia hadde noen donasjoner datert til 2106",
            uk: "Деякі пожертвування в Австралії датовані 2106 роком",
            fr: "L'Australie avait des dons datés de 2106",
          }}
          text={{
            en: "There seemed to be a typo for in the dataset of the Australian Electoral Commission for some donations in the year 2016 that were dated to 2106.",
            de: "Im Datensatz der australischen Wahlkommission scheint sich ein Tippfehler eingeschlichen zu haben, denn einige Spenden aus dem Jahr 2016 wurden auf das Jahr 2106 datiert.",
            et: "Tundus, et Austraalia valimiskomisjoni andmekogumis on trükiviga mõne annetuse puhul aastatel 2016-2106.",
            nl: "Er leek een tikfout te zitten in de dataset van de Australian Electoral Commission voor sommige donaties in het jaar 2016 die gedateerd waren op 2106.",
            cs: "Zdá se, že v souboru údajů australské volební komise došlo k překlepu u některých darů v roce 2016, které byly datovány do roku 2106.",
            lv: "Šķiet, ka Austrālijas Vēlēšanu komisijas datubāzē ir pārrakstīšanās kļūda attiecībā uz dažiem ziedojumiem 2016. gadā, kas datēti ar 2106. gadu.",
            hr: "Čini se da postoji tipfeler u skupu podataka Australskog izbornog povjerenstva za neke donacije u 2016. godini koje su bile datirane u 2106. godinu.",
            no: "Det ser ut til å være en skrivefeil i datasettet til Australian Electoral Commission for noen donasjoner i året 2016 som var datert til 2106.",
            uk: "Здавалося, у наборі даних Австралійської виборчої комісії сталася друкарська помилка для деяких пожертвувань у 2016 році, які були помилково датовані 2106 роком.",
            fr: "Il semble y avoir une faute de frappe dans le jeu de données de la Commission électorale australienne pour certaines donations de l'année 2016 qui étaient datées de 2106.",
          }}
          status={{
            type: "wontfix",
            owner: "Australian Electoral Commission",
          }}
          date={"2024-11-22"}
        >
          2015-16;XXX;ALP National Secretariat/ALP - FED;4/14/
          <span className="font-black text-red-800">2106</span>;3500
          <br />
          2015-16;XXX;Liberal Party of Australia/LIB-NSW;5/25/
          <span className="font-black text-red-800">2106</span>;1500
        </FunFact>
        <FunFact
          t={tFun}
          locale={locale}
          title={{
            en: "Austria changed their currency format for new rows",
            de: "Österreich hat sein Währungsformat für neue Zeilen geändert",
            et: "Austria muutis oma valuutaformaati uute ridade jaoks",
            nl: "Oostenrijk heeft zijn valutaformaat gewijzigd voor nieuwe rijen",
            cs: "Rakousko změnilo formát měny pro nové řádky",
            lv: "Austrija mainīja valūtas formātu jaunām rindām",
            hr: "Austrija je promijenila format valute za nove retke",
            no: "Østerrike endret valutaformatet for nye rader",
            uk: "Австрія змінила формат валюти для нових рядків",
            fr: "L'Autriche a changé son format de devise pour les nouvelles lignes",
          }}
          text={{
            en: 'For some reason the 2024 donation document from Austria changed it\'s currency format for new rows from "EUR" to "Euro".',
            de: "Aus irgendeinem Grund änderte das österreichische Spendendokument 2024 das Währungsformat für neue Zeilen von „EUR“ auf „Euro“.",
            et: "Mingil põhjusel muudeti Austria 2024. aasta annetusdokumendis uute ridade valuutaformaat „EUR“ asemel „Euro“.",
            nl: "Om de een of andere reden heeft het 2024 donatiedocument van Oostenrijk de valuta-indeling voor nieuwe rijen veranderd van “EUR” in “Euro”.",
            cs: "Z nějakého důvodu se v rakouském dotačním dokumentu na rok 2024 změnil formát měny pro nové řádky z „EUR“ na „Euro“.",
            lv: "Kādu iemeslu dēļ Austrijas 2024. gada ziedojuma dokumentā jaunajām rindām mainīts valūtas formāts no “EUR” uz “Euro”.",
            hr: 'Iz nekog je razloga dokument o donaciji iz Austrije iz 2024. promijenio format valute za nove retke iz "EUR" u "Euro".',
            no: 'Av en eller annen grunn endret Østerrikes donasjonsdokument for 2024 valutaformatet for nye rader fra "EUR" til "Euro".',
            uk: "З якоїсь причини австрійський документ про пожертвування за 2024 рік змінив формат валюти для нових рядків з «EUR» на «Euro».",
            fr: 'Pour une raison quelconque, le document de don de l\'Autriche pour 2024 a changé son format de devise pour les nouvelles lignes de "EUR" à "Euro".',
          }}
          status={{ type: "fixed", owner: "Rechnungshof" }}
          date={"2024-11-08"}
        >
          KPÖ;30.07.24;27.06.24;XXX;1100;1000;
          <span className="font-black text-green-800">EUR</span>;KPÖ
          Bundespartei; KPÖ;04.11.24;26.07.24;YYY;1150;1000;
          <span className="font-black text-red-800">Euro</span>;KPÖ
          Bundespartei;
        </FunFact>
        <FunFact
          t={tFun}
          locale={locale}
          title={{
            en: "Incorrect link on Romania's donation page",
            de: "Falscher Link auf der Spendenseite von Rumänien",
            et: "Vale link Rumeenia annetuste lehel",
            nl: "Onjuiste link op de donatiepagina van Roemenië",
            cs: "Nesprávný odkaz na darovací stránce Rumunska",
            lv: "Nepareiza saite uz Rumānijas ziedojumu lapu",
            hr: "Netočna poveznica na stranici za donacije Rumunjske",
            no: "Feil lenke på donasjonssiden til Romania",
            uk: "Неправильне посилання на сторінці пожертвувань Румунії",
            fr: "Lien incorrect sur la page de dons de la Roumanie",
          }}
          text={{
            en: 'Romania links to the donation data of "PDR PARTIDUL DISPORA ROMANA" which points to a 404 page.',
            de: "Rumänien verweist auf die Spendendaten von „PDR PARTIDUL DISPORA ROMANA“, die auf eine 404-Seite verweisen.",
            et: "Rumeenia viitab „PDR PARTIDUL DISPORA ROMANA“ annetusandmetele, mis viitavad 404-leheküljele.",
            nl: "Roemenië verwijst naar de donatiegegevens van “PDR PARTIDUL DISPORA ROMANA”, die naar een 404-pagina verwijst.",
            cs: "Rumunsko odkazuje na darovací údaje společnosti „PDR PARTIDUL DISPORA ROMANA“, které odkazují na stránku 404.",
            lv: "Rumānijas saites uz “PDR PARTIDUL DISPORA ROMANA” ziedojumu datiem norāda uz 404 lapu.",
            hr: 'Rumunjska se povezuje s podacima o donacijama "PDR PARTIDUL DISPORA ROMANA" koji upućuju na stranicu 404.',
            no: 'Romania lenker til donasjonsdataene til "PDR PARTIDUL DISPORA ROMANA" som peker til en 404-side.',
            uk: "Румунія посилається на дані про пожертвування «PDR PARTIDUL DISPORA ROMANA», які вказують на сторінку 404.",
            fr: 'La Roumanie renvoie aux données de dons de "PDR PARTIDUL DISPORA ROMANA" qui pointent vers une page 404.',
          }}
          status={{
            type: "reported",
            owner: "Departamentul de Control al Finanțării Partidelor",
          }}
          date={"2024-09-29"}
        />
        <FunFact
          t={tFun}
          locale={locale}
          title={{
            en: "Changed date format for new donations in Germany",
            de: "Geändertes Datumsformat für neue Spenden in Deutschland",
            et: "Muudetud kuupäeva formaat uute annetuste puhul Saksamaal",
            nl: "Datumnotatie gewijzigd voor nieuwe donaties in Duitsland",
            cs: "Změna formátu data pro nové dary v Německu",
            lv: "Mainīts datumu formāts jauniem ziedojumiem Vācijā",
            hr: "Promijenjen format datuma za nove donacije u Njemačkoj",
            no: "Endret datoformat for nye donasjoner i Tyskland",
            uk: "Змінений формат дати для нових пожертвувань у Німеччині",
            fr: "Format de date modifié pour les nouvelles donations en Allemagne",
          }}
          text={{
            en: "The Bundestag has changed the date format for new donations. The month was written out for the newly added donations. This change was later corrected.",
            de: "Der Bundestag hat das Datumsformat für neue Spenden geändert. Bei den neu hinzugekommenen Spenden wurde der Monat ausgeschrieben. Diese Änderung wurde später korrigiert.",
            et: "Bundestag on muutnud uute annetuste kuupäevaformaati. Kuu kirjutati välja uute lisatud annetuste puhul. See muudatus parandati hiljem.",
            nl: "De Bondsdag heeft de datumnotatie voor nieuwe donaties gewijzigd. De maand werd uitgeschreven voor de nieuw toegevoegde donaties. Deze wijziging is later gecorrigeerd.",
            cs: "Spolkový sněm změnil formát data pro nové dary. U nově přidaných darů byl vypsán měsíc. Tato změna byla později opravena.",
            lv: "Bundestāgs ir mainījis datumu formātu jauniem ziedojumiem. Jaunizveidotajiem ziedojumiem tika izrakstīts mēnesis. Vēlāk šī izmaiņa tika labota.",
            hr: "Bundestag je promijenio format datuma za nove donacije. Mjesec je ispisan za novododane donacije. Ta je promjena kasnije ispravljena.",
            no: "Bundestag har endret datoformatet for nye donasjoner. Måneden ble skrevet ut for de nylig tilføyde donasjonene. Denne endringen ble senere korrigert.",
            uk: "Бундестаг змінив формат дати для нових пожертвувань. Для нещодавно доданих пожертвувань розписано місяць. Пізніше ця зміна була виправлена.",
            fr: "Le Bundestag a changé le format de date pour les nouvelles donations. Le mois était écrit pour les nouvelles donations ajoutées. Ce changement a été corrigé plus tard.",
          }}
          date={"2024-04-04"}
        >
          <span className="font-black text-red-800">3. April 2024</span>
          <br />
          <span className="font-black text-green-800">03.04.2024</span>
        </FunFact>
        <FunFact
          t={tFun}
          locale={locale}
          title={{
            en: "Germany had a typo in one of its zipcode for Frankfurt",
            de: "Deutschland hatte einen Tippfehler in einer seiner Postleitzahlen für Frankfurt",
            et: "Saksamaal oli ühes Frankfurdi postiindeksis trükiviga",
            nl: "Duitsland had een typfout in een van zijn postcodes voor Frankfurt",
            cs: "Německo mělo překlep v jednom z poštovních směrovacích čísel pro Frankfurt.",
            lv: "Vācijā vienā no Frankfurtes pasta indeksiem bija pārrakstīšanās kļūda.",
            hr: "Njemačka je imala tipfeler u jednom od svojih poštanskih brojeva za Frankfurt",
            no: "Tyskland hadde en skrivefeil i en av postnumrene sine for Frankfurt",
            uk: "У Німеччині була друкарська помилка в одному з поштових індексів Франкфурта",
            fr: "L'Allemagne avait une faute de frappe dans l'un de ses codes postaux pour Francfort",
          }}
          text={{
            en: `One donation in 2021 had "0329" as its zip for Frankfurt, which is incorrect as it should be "60329".`,
            de: "Bei einer Spende im Jahr 2021 war als Postleitzahl für Frankfurt „0329“ angegeben, was nicht korrekt ist, da die Postleitzahl „60329“ lauten müsste.",
            et: "Ühel annetusel aastal 2021 oli Frankfurdi postiindeksiks „0329“, mis on vale, kuna see peaks olema „60329“.",
            nl: "Een donatie in 2021 had “0329” als postcode voor Frankfurt, wat onjuist is omdat het “60329” zou moeten zijn.",
            cs: "U jednoho příspěvku v roce 2021 bylo jako poštovní směrovací číslo pro Frankfurt uvedeno „0329“, což není správně, protože by mělo být „60329“.",
            lv: "Vienā 2021. gada ziedojumā kā Frankfurtes pasta indekss bija norādīts “0329”, kas ir nepareizi, jo tam vajadzētu būt “60329”.",
            hr: 'Jedna donacija 2021. imala je "0329" kao poštanski broj za Frankfurt, što je netočno jer bi trebalo biti "60329".',
            no: 'En donasjon i 2021 hadde "0329" som postnummer for Frankfurt, noe som er feil da det skulle vært "60329".',
            uk: "Одне пожертвування в 2021 році мало «0329» у якості поштового індексу Франкфурта, що є неправильним, оскільки має бути «60329».",
            fr: 'Une donation en 2021 avait "0329" comme code postal pour Francfort, ce qui est incorrect car il devrait être "60329".',
          }}
          status={{
            type: "fixed",
            owner: "Bundestag",
          }}
          date={"2024-02-23"}
        >
          Deutsche Vermögensberatung AG
          <br />
          Wilhelm-Leuschner-Straße 24
          <br />
          <span className="font-black text-red-800">0329</span> Frankfurt am
          Main
        </FunFact>
        <FunFact
          t={tFun}
          locale={locale}
          title={{
            en: "The Austrian party donation document for 2022 randomly uses macintosh file encoding",
            de: "Das österreichische Parteispendenpapier für 2022 verwendet zufällig die Macintosh-Dateikodierung",
            et: "Austria partei 2022. aasta annetusdokument kasutab juhuslikult macintosh-faili kodeeringut",
            nl: "Het donatiedocument van de Oostenrijkse partij voor 2022 gebruikt willekeurig macintosh-bestandscodering",
            cs: "Dokument rakouské strany o dotacích na rok 2022 namátkou používá kódování souborů Macintosh.",
            lv: "Austrijas partijas ziedojumu dokumentā 2022. gadam izlases veidā tiek izmantota macintosh failu kodēšana",
            hr: "Dokument o donaciji austrijske stranke za 2022. nasumično koristi kodiranje datoteka za Macintosh",
            no: "Det østerrikske partiets donasjonsdokument for 2022 bruker tilfeldig macintosh-fil-koding",
            uk: "Австрійський документ про пожертвування партій за 2022 рік випадково використовує кодування файлів Macintosh",
            fr: "Le document de don de parti autrichien pour 2022 utilise aléatoirement l'encodage de fichier macintosh",
          }}
          text={{
            en: `All csv files from Austria use utf8 encoding except the one from 2022 which uses Apple Macintosh encoding.`,
            de: "Alle csv-Dateien aus Österreich verwenden utf8-Kodierung, mit Ausnahme derjenigen aus dem Jahr 2022, die Apple Macintosh-Kodierung verwendet.",
            et: "Kõik Austriast pärit csv-failid kasutavad utf8-kodeeringut, välja arvatud 2022. aasta fail, mis kasutab Apple Macintoshi kodeeringut.",
            nl: "Alle csv-bestanden uit Oostenrijk gebruiken utf8 codering, behalve die uit 2022 die Apple Macintosh codering gebruikt.",
            cs: "Všechny soubory csv z Rakouska používají kódování utf8 s výjimkou souboru z roku 2022, který používá kódování Apple Macintosh.",
            lv: "Visos Austrijas csv failos tiek izmantota utf8 kodēšana, izņemot 2022. gada failu, kurā izmantota Apple Macintosh kodēšana.",
            hr: "Sve csv datoteke iz Austrije koriste utf8 kodiranje osim one iz 2022. koja koristi Apple Macintosh kodiranje.",
            no: "Alle csv-filer fra Østerrike bruker utf8-koding bortsett fra den fra 2022 som bruker Apple Macintosh-koding.",
            uk: "Усі csv-файли з Австрії використовують кодування utf8, за винятком файлу 2022 року, який використовує кодування Apple Macintosh.",
            fr: "Tous les fichiers csv d'Autriche utilisent l'encodage utf8, sauf celui de 2022 qui utilise l'encodage Apple Macintosh.",
          }}
          date={"2024-02-06"}
        >
          Zu ver<span className="font-black text-red-800">�</span>
          ffentlichen;;;;;;
        </FunFact>
      </Article>
    </NonCountryRootLayout>
  );
}
