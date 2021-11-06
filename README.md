# jsramverk-backend

Ett backend repo som handlar om att hämta, lägga till, uppdatera och återställa data från en databas. Modulerna som används är **Nodemon** för automatisk omstart av node-appen, **MongoDB** databas för att skapa databaser och hantera databasens innehåll, **Morgan** för loggning av händelser i API:t och **Cors** för hantering av Cross-Origin Sharing problematik. Vi installerar också **Express** som är en del av MEAN som är en samling moduler för att bygga webbapplikationer med Node.js, **body-parser** för att använda parametrar tillsammans med HTTP metoderna.

Routerna är uppdelade i två filer, en indexfil som har router för att hämta, återställa och skapa data i databasen och en updatefil som uppdaterar innehållet i databasen.

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

#### Socket.io

**Socket.io** är en modul som implementerar websockets för realtid i klient och server. Socket.io underlättar kommunikationen mellan klient och server när vi vill skicka data över en websocket mellan en server och flertal klienter. Vi installera socket.io via npm tillsammans med två andra packet som kan snabba upp servers hantering av socket. 

```
npm install --save socket.io
npm install --save-optional bufferutil utf-8-validate
```

## Me-API

För att hantera databasens innehåll kan man använda sig av API:t (https://jsramverk-editor-rahn20.azurewebsites.net/me-api). Det går att hantera innehållet direkt från editor [Frontend-editor](https://www.student.bth.se/~rahn20/editor/frontend/).


| Request metod | Route                 |   Beskrivning                     |
|---------------|-----------------------|------------------------           |
|   GET         | /me-api               | Visar alla dokumenten             |
|   GET         | /me-api/reset         | Återställer dokumenten            |
|   PUT         | /me-api/update/:id    | Uppdaterar ett specifikt dokument |
|   POST        | /me-api/create        | Skapar ett nytt dokument          |
|   GEt         | /me-api/document/:id  | Visa ett specifikt dokument       |


#### Databasens innehåll  

Ett dokument i databasen har en id, namn och innehåll:

```
"_id": "1234567890poiuytrewq"
"name": "Mercury",
"content": "<p>60 million km from the Sun, is the closest planet to the Sun and the smallest planet in the Solar System, Mercury has no natural satellites. Mercury's very tenuous atmosphere consists of atoms     blasted off its surface by the solar wind. Its relatively large iron core and thin mantle have not yet been adequately explained.</p><p>Source: https://en.wikipedia.org/wiki/Solar_System </p>"
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
