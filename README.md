[![Build Status](https://app.travis-ci.com/Rahn20/jsramverk-backend.svg?branch=main)](https://app.travis-ci.com/Rahn20/jsramverk-backend)

# jsramverk-backend

Ett backend repo som handlar om att hämta, radera, uppdatera och återställa data från en databas. Modulerna som används är **Nodemon** för automatisk omstart av node-appen, **MongoDB** databas för att skapa databaser och hantera databasens innehåll, **Morgan** för loggning av händelser i API:t och **Cors** för hantering av Cross-Origin Sharing problematik. Vi installerar också **Express** som är en del av MEAN som är en samling moduler för att bygga webbapplikationer med Node.js, **body-parser** för att använda parametrar tillsammans med HTTP metoderna.


## Installation

Vi installerar de nödvändiga modulerna och kör `node/nodemon app.js` för att köra applikationen i en webbläsare som kan nås via localhost:1337. 
```
npm init
npm install express cors morgan body-parser --save
npm install -g nodemon
npm install nodemon --save-dev
node app.js
```
Det är ett utvecklingsläge när man startar upp Express, man kan starta produktionsläge med kommandot `NODE_ENV="production" node app.js`, detta ger mindre information i felmeddelandena.

### Socket.io

**Socket.io** är en modul som implementerar websockets för realtid i klient och server. Socket.io underlättar kommunikationen mellan klient och server när vi vill skicka data över en websocket mellan en server och flertal klienter. Vi installera socket.io via npm tillsammans med två andra packet som kan snabba upp servers hantering av socket. 

```
npm install --save socket.io
npm install --save-optional bufferutil utf-8-validate
```

### Autentisering

För säker hantering av lösenord använder vi bcrypt och för att autentisera klienter mot en server använder vi tokens.

```
npm install --save bcrypt.js
npm install --save jsonwebtoken
```

### GraphQL

GraphQL är ett query språk för API:er, den ger en fullständig beskrivning av data i API:et, ger klienterna möjlighet att fråga efter exakt vad de behöver och inget mer, det gör det lättare att utveckla API:er över tid och möjliggör kraftfulla utvecklarverktyg.

```
npm install --save graphql
npm install --save express-graphql
```

### SendGrid

SendGrid är ett mail API som jag använde för att koppla på möjligheten att maila ut inbjudan till att redigera dokument.

```
npm install --save @sendgrid/mail
```

## Me-API

API:et (https://jsramverk-editor-rahn20.azurewebsites.net/me-api). Det går att hantera innehållet direkt från editor [Frontend-editor](https://www.student.bth.se/~rahn20/editor/frontend/).


| Request metod | Route             |   Beskrivning                                 
|---------------|-------------------|------------------------------|
|   POST        | /me-api/register  | Registrerar ett användare    |
|   POST        | /me-api/login     | Logga in                     |

Föt att Uppdatera ett dokument, skapa ett nytt dokument, visa ett dokument, radera ett dokument, visa alla användare, visa en användare, radera en användare och uppdatera en användare kan göra med **GraphQL** route /me-api/graphql.


### Databasens innehåll  

En planet databas som innehåller dokuemnterna och består av id, namn och innehåll, en users databas som innehåller alla användarens information och består av id, namn, email, lösenord, dokuments id och tillåtna användares id.

**Dokument:**

```
"_id": "1234567890poiuytrewq"
"name": "Mercury",
"content": "<p>60 million km from the Sun, is the closest planet to the Sun and the smallest planet in the Solar System, Mercury has no natural satellites. Mercury's very tenuous atmosphere consists of atoms     blasted off its surface by the solar wind. Its relatively large iron core and thin mantle have not yet been adequately explained.</p><p>Source: https://en.wikipedia.org/wiki/Solar_System </p>"
```

**Användare**
```
"_id": "5364459596966dgdg"
"name": "Auth",
"email": "test1@bth.se",
"password": "hsy638202£$ddsadsaioewiqo39210mskcdmcxznmwireqrhr38",
"docs": [
    "_id": "1234567890poiuytrewq",
    "allowed_users": ["test2@bth.se"]
]
```

## Testning
De verktygen som används för att köra enhetstester är **Mocha**, **Istanbul** för att hantera kodtäckning vid enhetstester, **Chai** och **Chai http** (integrationstester). Chai låter oss på ett smidigt och enkelt sätt kolla om JavaScript är lika med det vi vill testa för. Vi använder chai http för att anropa våra router och kolla om svaren vi får tillbaka matcher det vi förväntar oss. För statisk kodvalidering använder vi eslint.
```
npm install mocha nyc chai chai-http --save-dev
npm install javascript-style-guide --save-dev
cp node_modules/javascript-style-guide/.eslint* .
npm install eslint eslint-plugin-react --save-dev
```
Vi uppdaterar vår package.json, vi lägger till nya scripts:
```
"scripts": {
    "test": "nyc --reporter=html --reporter=text --reporter=clover mocha 'test/*.js' --timeout 10000",
    "posttest": "npm run eslint",
    "clean": "rm -rf coverage .nyc_output",
    "eslint": "eslint ."
},
```

## START

Vi installerar allt som finns i package.json och exekverar validatorer och testfall
```
npm install
npm test
```
