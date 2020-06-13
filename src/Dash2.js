import React, { useEffect, useState } from "react";
import TreeMap from "react-d3-treemap";
import "react-d3-treemap/dist/react.d3.treemap.css";
import { treemapData } from "./treemapData";
import "./App.css";
import { people } from "./people";

var csvJSON = {};
var TREEMAP = {};

const DashboardDos = (props) => {
  const [dataMap, setDataMap] = useState({});
  function getBanks(data) {
    TREEMAP = {
      name: "banks",
      children: [],
    };
    let labels = data.reduce((accum, next, index) => {
      if (index === 1) return [];
      if (!accum.includes(next[5])) accum.push(next[5]);
      return accum;
    });

    let values = labels.map((value, index) => {
      return data.filter((value2) => value === value2[5]).length;
    });

    let generosPorBanco = labels.map((value, index) => {
      let cuentaGeneros = ["Female", "Male"].map((genderVal, genderIndex) => {
        return data.filter((value2) => {
          return value === value2[5] && genderVal === value2[2];
        }).length;
      });
      return {
        Female: cuentaGeneros[0],
        Male: cuentaGeneros[1],
      };
    });

    let casadosgeneroPorBanco = labels.map((value, index) => {
      let cuentacasadosgenero = [
        "Female-false",
        "Male-false",
        "Female-true",
        "Male-true",
      ].map((genderVal, genderIndex) => {
        return data.filter((value2) => {
          return (
            value === value2[5] && genderVal === `${value2[2]}-${value2[4]}`
          );
        }).length;
      });
      return {
        Female: {
          casadas: cuentacasadosgenero[2],
          solteras: cuentacasadosgenero[0],
        },
        Male: {
          casados: cuentacasadosgenero[3],
          solteros: cuentacasadosgenero[1],
        },
      };
    });

    debugger;
    console.log(casadosgeneroPorBanco);
    labels.forEach((item, index) => {
      TREEMAP.children.push({
        name: labels[index],
        // value:values[index]
      });
    });
    TREEMAP.children.forEach((item, index) => {
      item.children = [
        ...Object.keys(generosPorBanco[index]).map((genero) => {
          return { name: genero };
        }),
      ]; //,value:generosPorBanco[index][genero]}}))]
    });

    debugger;
    TREEMAP.children.forEach((child, findex) => {
      child.children.forEach((child2, sindex) => {
        child2.children = [
          ...Object.keys(casadosgeneroPorBanco[findex][child2.name]).map((civil) => {
            return {
              name: civil,
              value: casadosgeneroPorBanco[findex][child2.name][civil],
            };
          }),
        ];
      });
    });
    debugger;
    setDataMap(TREEMAP);
    console.log(TREEMAP);
  }
  useEffect(() => {
    async function loadCsv() {
      try {
        // let csvData = csv().fromFile('people.csv');
        const rows = people.split("\n");
        // const headers = rows[0].split(',');
        csvJSON = rows.map((item, index) => {
          return item.split(",");
        });
        getBanks(csvJSON);
        // let datos3D = get3DData(csvJSON);
        // debugger;
        // setdata3d(datos3D);
        // loaded=true;
      } catch (ex) {
        console.log(ex);
      }
    }
    loadCsv();
  }, []);

  return (
    <div>
      <TreeMap height={800} width={1200} data={dataMap} valueUnit={"Personas"} />
    </div>
  );
};

export default DashboardDos;
