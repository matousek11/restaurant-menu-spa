# Rozdělení práce
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
Další entity: Meal, Auth, Announcement (oznámení na vršku nad menu), Alergeny
# rozhraní mezi částmi
# způsob spolupráce a kontroly práce