# Identifikace týmu

- `Název projektu` - Menu pro restauraci
- **Členové týmu**
  - Lukáš Matoušek, ID: I2300504
  - Bohdan Melnyk, ID: I2400417
  - Vojtěch Kocourek, ID: I2400398
  - Jan Macháček, ID: I2400414

# Rozdělení práce (rozdělení bussiness odpovědností a infrastrukturních rolí)

## Lukáš Matoušek

### Entita WeeklyMenu

- **stavy:**
  - `DRAFT` - menu na týden se sestavuje, ale není finální
  - `READY` - menu splňuje všechny validační podmínky a je připravené k publikaci
  - `PUBLISHED` - menu je viditelné návštěvníkům
  - `ARCHIVED` - menu je skryté návštěvníkům, ale je archivováno
- **povolené přechod mezi stavy:**
  - mazání?
  - `DRAFT` -> `READY`
    - podmínky pro přechod:
      - zvolený týden a rok
      - neexistuje jiné menu ve stavu `READY` nebo `PUBLISHED` pro zvolený týden
      - zvolený týden je v budoucnosti nebo jde o aktuální týden
      - draft obsahuje plně definované jídlo nebo nic v seznamu
  - `READY` -> `PUBLISHED`
    - podmínky pro přechod žádné
  - `READY` -> `DRAFT`
    - podmínky pro přechod žádné
  - `PUBLISHED` -> `DRAFT`
    - podmínky pro přechod žádné
  - `PUBLISHED` -> `ARCHIVED`
    - podmínky pro přechod žádné
- **popis odpovědnosti za chování:**
  - Návštěvníci mají přístup pouze k `PUBLISHED` menu
  - Pro každý týden existuje právě jedno published menu

### Infrastrukturní odpovědnost

- **IR01 – Správa stavu aplikace (State Management)**
  - definice struktury globálního stavu aplikace
  - inicializace stavu
  - řízené aktualizace stavu
- **IR02 – Dispatcher / Interpretace akcí**
  - centrální zpracování akcí
  - rozhodování, jak akce ovlivní stav
  - koordinace synchronních a asynchronních operací

## Bohdan Melnyk

### Entita Auth

- **stavy:**
  - `GUEST` - uživatel není přihlášený (běžný návštěvník, má přístup pouze k publikovanému menu)
  - `AUTHENTICATING` - probíhá asynchronní ověřování uživatele (čekání na odpověď z API)
  - `MANAGER` - uživatel je úspěšně přihlášený a má plná práva pro správu aplikace
- **povolené přechody mezi stavy:**
  - `GUEST` -> `AUTHENTICATING`
    - podmínky pro přechod: uživatel vyplnil a odeslal přihlašovací formulář
  - `AUTHENTICATING` -> `MANAGER`
    - podmínky pro přechod: API vrátilo úspěšnou odpověď a validní token
  - `AUTHENTICATING` -> `GUEST`
    - podmínky pro přechod: API vrátilo chybu (např. špatné heslo) nebo došlo k chybě sítě
  - `MANAGER` -> `GUEST`
    - podmínky pro přechod: uživatel kliknul na tlačítko pro odhlášení, nebo API vrátilo chybu 401 (vypršení platnosti relace)
- **popis odpovědnosti za chování:**
  - Zabezpečení přístupu: nepřihlášený uživatel (`GUEST`) nesmí vidět editační rozhraní a je přesměrován na přihlašovací obrazovku, pokud se o to pokusí.
  - Správa relace: uložení tokenu (např. do `localStorage`) a jeho odstranění při odhlášení.

### Infrastrukturní odpovědnost

- **IR03 – Asynchronní operace a side-effects**
  - komunikace s API (mock nebo reálné) pro proces přihlášení a ověření identity
  - zpracování úspěchů a chyb (vyhodnocení HTTP status kódů, např. 200 OK, 401 Unauthorized)
  - řízení přechodů do stavu načítání (`AUTHENTICATING`) a zobrazení chyb během síťových požadavků
  - _Nezahrnuje:_ samotné rozhodování o tom, zda jsou přihlašovací údaje správné (to dělá backend).
- **IR06 – Renderovací logika (View composition)**
  - převod stavu autentizace na konkrétní UI strukturu (vykreslení přihlašovacího formuláře)
  - sestavení DOM stromu pro přihlašovací pohled pomocí čistého JavaScriptu
  - podmíněné zobrazení částí UI: skrytí/zobrazení navigačních prvků a editačních tlačítek na základě toho, zda je stav `GUEST` nebo `MANAGER`
  - oddělení rozhodování _co_ se má zobrazit (to řeší dispatcher) od toho _jak_ se to zobrazí na obrazovce

## Vojtěch Kocourek

### Entita Subscription

- **stavy:**
  - `ACTIVE` – předplatné je aktivní, zákazník čerpá obědy z publikovaného týdenního menu, ubývají zbývající dny
  - `PAUSED` – zákazník dočasně pozastavil předplatné, zbývající dny jsou zachovány
  - `EXPIRED` – předplatné přirozeně vypršelo po vyčerpání všech zakoupených dnů
  - `CANCELLED` – předplatné bylo trvale zrušeno zákazníkem
- **povolené přechody mezi stavy:**
  - `ACTIVE` -> `PAUSED`
    - podmínky pro přechod žádné (zákazník si kdykoli může pozastavit čerpání)
  - `PAUSED` -> `ACTIVE`
    - podmínky pro přechod žádné (obnovení čerpání se zbývajícími dny)
  - `ACTIVE` -> `EXPIRED`
    - podmínky pro přechod: počet zbývajících dnů dosáhl nuly
  - `ACTIVE` -> `CANCELLED`
    - podmínky pro přechod žádné
  - `PAUSED` -> `CANCELLED`
    - podmínky pro přechod žádné
- **popis odpovědnosti za chování:**
  - Zákazník (GUEST) vytvoří předplatné – stav je ihned `ACTIVE`, zbývající dny nastaveny dle zakoupeného rozsahu
  - Zákazník může předplatné pozastavit (`PAUSED`) a kdykoli obnovit (`ACTIVE`) – dny se nepočítají v době pauzy
  - Zákazník může předplatné kdykoli trvale zrušit (`CANCELLED`)
  - Předplatné automaticky přejde do `EXPIRED`, jakmile zbývající dny dosáhnou nuly
  - Předplatné lze vytvořit pouze pokud existuje `PUBLISHED` WeeklyMenu pro dané období
  - Zákazník může mít nejvýše jedno `ACTIVE` nebo `PAUSED` předplatné současně

### Infrastrukturní odpovědnost

- **IR04 – Router / Navigační logika**
  - mapování URL adres na příslušné pohledy aplikace (`#/subscriptions`, `#/subscriptions/:id`, `#/subscriptions/create`)
  - parsování URL parametrů a synchronizace s adresou prohlížeče
  - převod URL změn na akce předávané do dispatcheru
  - reakce na změny historie prohlížeče (popstate)
- **IR05 – Selektory (výběr dat ze stavu)**
  - filtrování předplatných dle stavu (`ACTIVE`, `PAUSED`, `EXPIRED`, `CANCELLED`)
  - odvozování hodnot pro UI (např. `canCreateSubscription`, `canPauseSubscription`, `canResumeSubscription`, `canCancelSubscription`)
  - příprava dat pro konkrétní pohledy (seznam předplatných, detail s počtem zbývajících dnů)

## Honza Macháček

### Entita Meal

- **stavy:**
  - `DRAFT` - jídlo je vytvořeno v systému, ale ještě není publikováno v menu (manažer ho může upravovat, jídlo není vytvořené úplně)
  - `AVAILABLE` - jídlo je publikované v menu a zákazníci si ho mohou objednat
  - `UNAVAILABLE` - jídlo existuje v systému, ale momentálně ho není možné objednat (např. chybí suroviny)
- **povolené přechody mezi stavy:**
  - `DRAFT` -> `AVAILABLE`
    - podmínky pro přechod: manažer publikoval jídlo do menu a jídlo je plně vytvořené
  - `AVAILABLE` -> `UNAVAILABLE`
    - podmínky pro přechod: žádné (nastane když např. chybí suroviny)
  - `UNAVAILABLE` -> `AVAILABLE`
    - podmínky pro přechod: žádné (nastane pokud se změní dostupnost surovin)
- **popis odpovědnosti za chování:**
  - Řízení dostupnosti: pouze jídla ve stavu `AVAILABLE` mohou být zobrazena zákazníkům v menu a mohou být objednána.
  - Správa publikace: jídla ve stavu `DRAFT` nejsou viditelná zákazníkům a mohou být upravována manažerem před publikací.
  - Dočasná nedostupnost: jídla ve stavu `UNAVAILABLE` zůstávají v systému, ale nelze je objednat, dokud nejsou znovu označena jako `AVAILABLE`.

### Infrastrukturní odpovědnost

- **IR07 – Handlery a vazba UI → akce**
  - převod uživatelských interakcí na akce aplikace (např. kliknutí na tlačítko „Publikovat jídlo“ nebo „Změnit dostupnost“)
  - definice handlerů událostí (`onClick`, `onSubmit`)
  - mapování uživatelských interakcí na `dispatch(action)`
  - práce s kontextem aktuálního pohledu (např. seznam jídel, detail jídla, objednávka)
  - izolace uživatelského rozhraní od business logiky aplikace
  - _Nezahrnuje:_ přímé změny stavu aplikace v UI.
- **IR08 – Autentizace a technická autorizace**
  - správa identity uživatele z technického hlediska
  - uchovávání informace o přihlášeném uživateli a jeho roli
  - práce s tokenem nebo identitou uživatele (např. uloženou v `localStorage`)
  - inicializace autentizačního stavu při načtení aplikace
  - zajištění přístupu k chráněným částem aplikace pouze pro přihlášené uživatele
  - _Nezahrnuje:_ business autorizaci (např. rozhodování, zda může uživatel upravovat jídla nebo pouze objednávat).

# ROZHRANÍ MEZI ČÁSTMI SYSTÉMU

## Business rozhraní

**WeeklyMenu poskytuje operace:**

- createWeeklyMenu
- updateWeeklyMenu
- validateWeeklyMenu
- publishWeeklyMenu
- archiveWeeklyMenu
  **Meal poskytuje operace:**
- createMeal
- updateMeal
- publishMeal
- markMealUnavailable
- markMealAvailable
  **Subscription poskytuje operace:**
- createSubscription
- pauseSubscription
- resumeSubscription
- cancelSubscription
- expireSubscription
  **Vazby mezi entitami:**
- WeeklyMenu obsahuje seznam Meal položek.
- Subscription reaguje na stav WeeklyMenu:
  - předplatné lze vytvořit pouze pokud existuje `PUBLISHED` WeeklyMenu pro dané období
- Meal reaguje na stav WeeklyMenu:
- pokud `WeeklyMenu.status ≠ PUBLISHED`, jídla nejsou zobrazena návštěvníkům

## Datové kontrakty

**Sdílené objekty:**

- WeeklyMenu
- Meal
- Subscription
- Auth
  **Vlastník dat:**
- WeeklyMenu – Lukáš Matoušek
- Auth – Bohdan Melnyk
- Subscription – Vojtěch Kocourek
- Meal – Honza Macháček
  **Kdo smí měnit stav:**
- `WeeklyMenu.status` mění pouze přechodové funkce WeeklyMenu
- `Meal.status` mění pouze přechodové funkce Meal
- `Subscription.status` mění pouze přechodové funkce Subscription
- `Auth.state` mění pouze autentizační logika
  Globální `state` aplikace může být měněn výhradně přes dispatcher.

## Technická hranice

### Tok dat v aplikaci:

**UI**

- Handlery (IR07)
- Dispatcher (IR02)
- Business logika entit  
  **Dispatcher může volat:**
- Asynchronní vrstvu (IR03)
- API / mock API  
  **API vrací změněné entity**
  **Dispatcher následně:**
- aktualizuje globální state (IR01)
- Selektory (IR05) připravují data pro UI.
- Renderovací logika (IR06) převádí view-state na DOM strukturu.
- Každá vrstva má jasně definovanou odpovědnost a nesmí zasahovat do odpovědnosti jiné vrstvy.

# ZPŮSOB SPOLUPRÁCE A KONTROLY PRÁCE

## Sledování práce

- Každá business entita má vlastní issue v repozitáři
- Každá infrastrukturní role má vlastní issue
- Každá implementovaná operace bude mít jednoduchý test přechodů stavů
- Změny budou prováděny pomocí pull requestů

## Kontrola kvality

**Budou dodržována následující pravidla:**

- business logika nesmí být implementována ve View
- stav aplikace nesmí být měněn mimo dispatcher
- UI nesmí přímo manipulovat se stavem
- autorizace uživatele nesmí být implementována ve View vrstvě
- každá business entita kontroluje své invarianty a přechody stavů

## Code review

- každý pull request musí být schválen alespoň jedním dalším členem týmu
- kontroluje se správné dodržení architektury IR01–IR08
- kontroluje se oddělení business logiky a infrastruktury

## Řešení problémů

**Pokud dojde k porušení rozdělení odpovědností:**

1. problém se řeší na týmové schůzce
2. případně se upraví rozdělení práce
3. v krajním případě bude situace konzultována s vyučujícím
