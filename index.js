import fetch from "node-fetch";
global.fetch = fetch;

import { csv } from "d3-fetch";

import dayjs from "dayjs";

import fs from "fs";

const url = "https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto74/paso_a_paso.csv";
// const url = "https://raw.githubusercontent.com/AntoineBraultChile/scrapping-covid-data-chile/main/output/planPasoAPaso24Noviembre2021.csv";

(async () => {
  let paso = await csv(url);
  let pasoAPaso = {};
  paso.forEach((comuna) => {
    let date = Object.keys(comuna)
      .slice(5)
      .map((date) => {
        return dayjs(date, "YYYY-MM-DD").format("DD-MM-YYYY");
      });
    let fases = Object.values(comuna)
      .slice(5)
      .map((i) => {
        return Number(i);
      });
    let currentFase = fases[0];
    pasoAPaso[comuna["comuna_residencia"]] = {
      dateChangePaso: [date[0]],
      numeroDelPaso: [currentFase],
    };
    fases.forEach((fase, index) => {
      if (fase != currentFase) {
        currentFase = fase;
        pasoAPaso[comuna["comuna_residencia"]].dateChangePaso.push(date[index]);
        pasoAPaso[comuna["comuna_residencia"]].numeroDelPaso.push(fase);
      }
    });
    pasoAPaso[comuna["comuna_residencia"]].dateChangePaso.push(date[date.length - 1]);
    pasoAPaso[comuna["comuna_residencia"]].numeroDelPaso.push(fases[fases.length - 1]);
  });

  const pasoAPasoJson = JSON.stringify(pasoAPaso, null, "\t");

  var dir = "./output";

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFile("output/pasoAPasoComunas.json", pasoAPasoJson, "utf8", function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }
  });
})();
