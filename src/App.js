import React, {useEffect, useState} from 'react';
import './App.css';
import { Bar, Doughnut } from 'react-chartjs-2';
import {people} from './people';
import Graph3D from 'react-graph3d-vis';
// const csvString = require('./people.csv');
console.log(Graph3D);
var csvJSON = {};
let loaded = false;

var options3D = {
  style: 'bar-color',
  tooltip: ({x,y,z})=>`
    <div>
      <h3>Banco: ${catalogoBancos[y]||'No Especificado'}</h3>
      <h3>Edad: ${x}</h3>
      <h3>Tarjetahabientes: ${z}</h3>
    </div>
  `,
  height:'100vh',
  width:'98vw',
  
  xLabel:'Edad',
  yLabel:'Banco',
  yValueLabel:(y)=>catalogoBancos[y]||'No especificado',
  yStep:1,
  zLabel:'Tarjetahabientes'
}
let catalogoBancos=[];
function custom(x, y) {
  return (Math.sin(x/50) * Math.cos(y/50) * 50 + 50)
}

function generateData() {
  let data = []
  var steps = 10;  // number of datapoints will be steps*steps
  var axisMax = 200;
  var axisStep = axisMax / steps;
  for (var x = 0; x < axisMax; x+=axisStep) {
    for (var y = 0; y < axisMax; y+=axisStep) {
      var value = custom(x, y);
      data.push({
        x: x,
        y: y,
        z: value,
        style: value,
        extra:'Tooltip de prueba'
      })
    }
  }

  debugger;
  return data
}

let default3Ddata = generateData();

function App() {
  let [casados, setCasados]= useState({});
  let [banks, setBanks]= useState({});
  
  let [data3d, setdata3d]= useState(default3Ddata);
  function getColorArray(size){
    let colors = []
    for(let i=0;i<size;i++){
      colors.push('#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6));
    }
    return colors;
  }
  function getCasados(data){
    let cuenta = data.reduce((prev, current, index)=>{
      if( index===1 ) 
        prev = {casados:0,solteros:0};
      let cas = current[4] === 'true' ? 1 :0;
      let sol = current[4] === 'false' ? 1 :0;
      prev.casados += cas;
      prev.solteros += sol;
      return prev
    })
    let datosGrafica = {
      datasets : [
        {label:'Credit Card types', data:Object.values(cuenta),backgroundColor:['#c62828','#66bb6a']}
      ],
      labels: Object.keys(cuenta)
      
    }
    setCasados(datosGrafica)
    console.log(cuenta);
  }

  function getBanks(data){
    let labels = data.reduce((accum, next, index)=>{
      if(index === 1) return []
      if(!accum.includes(next[5])) accum.push(next[5])
      return accum
    })

    let values = labels.map((value,index)=>{
      return (data.filter(value2 => value===value2[5])).length
    })
    let dataBars = {
      labels:labels,
      datasets:[{data:values, backgroundColor:getColorArray(labels.length)}]
    }
    setBanks(dataBars);
    console.log(values)
  }

  function get3DData(data)
  {
    catalogoBancos = data.reduce((accum, next, index)=>{
      if(index === 1) return []
      if(!accum.includes(next[5])) accum.push(next[5])
      return accum
    })
    let cruceEdadesBancos = data.reduce((accum, next, index)=>{
      if(index === 1) return {}
      let edad = Number(new Date().getFullYear()) - Number(next[3].split('-')[0]);
      let banco = next[5];
      let key = `${banco}-${edad}`
      if(!Object.keys(accum).includes(key)) {
        accum[key]=1;
      }
      else accum[key]+=1;
      return accum
    });
    debugger;
    return Object.keys(cruceEdadesBancos).reduce((accum, next, index )=>{
      if(index === 1) return []
      return [...accum, {
        y:catalogoBancos.indexOf(next.split('-')[0]),
        x:Number(next.split('-')[1]),
        z:cruceEdadesBancos[next],style:cruceEdadesBancos[next],
        extra:next.split('-')[0]}]
    });
  }
  useEffect(()=>{
    async function loadCsv(){
      
      try{
      // let csvData = csv().fromFile('people.csv');
        const rows = people.split('\n');
        // const headers = rows[0].split(',');
        csvJSON = rows.map((item, index)=>{
          return item.split(',')
        })
        getCasados(csvJSON)
        getBanks(csvJSON);
        let datos3D = get3DData(csvJSON);
        debugger;
        setdata3d(datos3D);
        loaded=true;

      }
      catch(ex){
        
        console.log(ex)
      }
    }
      loadCsv();
  },[])











  
  return (
    <div className="App">
      <div className='grafica1 tarjeta'>
        <h2>Numero de tarjetahabientes por tipo de tarjeta</h2>
        <Bar data={banks}></Bar>
      </div>
      <div className='grafica2 tarjeta'>
        <h2>Estado Civil de los encuestados</h2>
        <Doughnut data={casados}></Doughnut>
      </div>
      <div className='grafica3 tarjeta grande'>
        <h2>Numero de tarjetahabientes por banco y edad</h2>
        <Graph3D data={data3d} options={options3D}/>
      </div>
      {/* <div className='grafica4 tarjeta'><Doughnut data={casados}></Doughnut></div> */}
      {/* <div className='grafica5'><Bar data={banks}></Bar></div>
      <div className='grafica6'><Doughnut data={casados}></Doughnut></div> */}
    </div>
  );
}

export default App;
