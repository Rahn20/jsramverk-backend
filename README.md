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
Det är ett utvecklingsläge när man startar upp Express, man kan starta produktionsläge med kommandot `NODE_ENV="production" node app.js` ,Detta ger mindre information i felmeddelandena.

## Me-API

För att hantera databasens innehåll kan man använda sig av API:t (https://jsramverk-editor-rahn20.azurewebsites.net/me-api). Det går att hantera innehållet direkt från editor också [Frontend-editor](https://www.student.bth.se/~rahn20/editor/frontend/).


| Request metod | Route                 |   Beskrivning          |
|---------------|-----------------------|------------------------|
|   GET         | /me-api               | visar data             |
|   GET         | /me-api/reset         | återställer data       |
|   PUT         | /me-api/update/:id    | uppdaterar data        |
|   POST        | /me-api/create        | skapar data            |


#### Databasens innehåll  

Ett dokument i databasen har en id, namn och bor innehåll, det kan se ut så här:

```
"_id": "1234567890poiuytrewq"
"namn": "Snorkfröken",
"bor": "Mumindalen"
```
