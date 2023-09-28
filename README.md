# Karma - savanorystės organizavimo platforma

Projekto tikslas – palengvinti savanoriams surasti savanorystės veiklas, o organizacijoms susirasti savanorius.

## Sistemos paskirtis

„Karma“ sistemos paskirtis yra suvesti savanorius su organizacijomis savanoriškos veiklos tikslui. Savanoris norintis ieškoti organizuojamų savanorystės renginių gali tai daryti neprisijungęs prie sistemos. Tačiau norintis pateikti savanorystės paraišką turės prisijungti prie paskyros. Prisiregistravęs prie sistemos savanoris galės peržiūrėti siūlomų veiklų sąrašą, gauti rekomenduojamas savanorystės pozicijas, rasti šalia esančias savanorystės veiklas, kaupti atliktas savanorystės valandas, įmonių rekomendacijas. Iš kitos pusės organizacijos prisijungusios prie sistemos galės kurti renginius, priimti arba atmesti savanorių paraiškas, užregistruoti savanorio atliktas valandas arba parašyti atsiliepimą apie savanorį.

### Funkciniai reikalavimai

Neregistruotas sistemos naudotojas – savanoris galės:

1. Peržiūrėti savanorystės veiklų sąrašą/kalendorių
2. Peržiūrėti konkretų savanorystės pasiūlymą
3. Prisijungti prie sistemos

Registruotas sistemos naudotojas – savanoris galės:

1. Peržiūrėti savanorystės veiklų sąrašą
2. Peržiūrėti konkretų savanorystės pasiūlymą
3. Pateikti paraišką į savanorišką veiklą
4. Peržiūrėti ir redaguoti savo profilį
5. Peržiūrėti rekomendacijų sąrašą
6. Priimti arba atmesti patvirtinimo laukiančią rekomendaciją
7. Parašyti atsiliepimą apie organizaciją
8. Kaupti savanorystės valandas. Už sukauptas valandas įsigyti rėmėjų nuolaidos kodus

Registruotas sistemos naudotojas – organizacija galės:

1. Valdyti savo savanorystės pozicijas: peržiūrėti, redaguoti, naikinti, sukurti
2. Rašyti savanorių rekomendacijas
3. Peržiūrėti turimų savanorių sąrašą
4. Peržiūrėti savanorio profilį
5. Priimti arba atmesti savanorių paraiškas dėl savanoriškos veiklos

Administratorius galės:

1. Patvirtinti organizacijos paskyrą
2. Peržiūrėti arba šalinti naudotojų ar organizacijų paskyras
3. Šalinti savanoriškos veiklos skelbimus

## Sistemos architektūra

### Naudojamos technologijos:

- Kliento pusė - TypeScript, React.js, Tailwind, Redux
- Serverio pusė – Java, Spring Boot, Hibernate ORM, PostgreSQL

### Sistemos diegimas

Internetinė aplikacija bus pasiekiama su HTTP. Sistemos duomenų manipuliavimui bus naudojamas REST API, kuris vykdys duomenų mainus su Karma duomenų baze valdoma PostgreSQL DBVS. Patogesniam duomenų valdymui bus naudojamas ORM.
