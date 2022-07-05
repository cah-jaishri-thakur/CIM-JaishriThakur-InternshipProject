import { Component, Input, AfterViewInit, ViewChild,ElementRef } from '@angular/core';
import { Chart, registerables} from 'chart.js';
import {HttpClient} from "@angular/common/http";
import {Transactions} from "../transactions";
import 'chartjs-adapter-moment';
import {Axes} from "../axes";


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
// this.Http.get('../../assets/json/Untitled.json', {responseType : 'text'})
//   .subscribe( resp => {
//     this.jsonDataResult = JSON.parse(resp);
//     console.log(this.jsonDataResult);
//   })
export class LineChartComponent implements AfterViewInit  {
  @Input() jsonData : any;
  chart!: Chart ;
  data : any [];
  jsonDataResult: Transactions [] = [];
  jsonFile = './assets/json/jaishri_data_minmax.json';
  changeQuantityArray : any[] =[];
   dates : any []= [];
   Dispensequantity : any [] = [];
   Reversalquantity : any [] = [];
   Invoicequantity : any [] = [];
   onHandQuantity : any [] =[];
  finalQuantites : { date: Date, type: number, quant: number }[] =[];
  constructor(private Http: HttpClient) {
    this.data = [];
  }



  ngOnInit(): void {
    this.createChart();
    //this.changeInQuantity();
    this.populateAxes();
    this.changeInQuantity2();
    //this.changeInQuantity();
  }
  ngAfterViewInit(): void {

  }
  differentTransactionTypes(transType : number){
    if(transType === 1){
      return 'Dispense';
    }else if(transType === 0){
      return 'Invoices';
    }else if(transType === 3){
      return 'Reversals';
    }else{
      return 'other';
    }
  }

  changeInQuantity2(){ // put transaction date & quantity in hashmap and plot backwards
    // Todo Step 1: Create an object array that takes in the transaction_type, quantity, and date X
    //      Step 2: Sort the array according the date in descending order
    //      Step 3: Put it through a for loop and adding conditional statements to figure out the transaction types
    //      Step 4: Based of the transaction type, increment or decrement onHand value and push into an array
    //      Step 5: Reverse the array so it will plot the points accordingly
    var currentOnHand = 274;

    this.Http.get('../../assets/json/jaishri_data_minmax.json', {responseType : 'text'})
      .subscribe( resp => {
        this.jsonDataResult = JSON.parse(resp);
        this.jsonDataResult.forEach(result =>{
          let obj = {date: result.transaction_date,type: result.transaction_type, quant: result.quantity }
          this.finalQuantites.push(obj);
          this.finalQuantites.sort().reverse();
        })
        console.log('finalQuant array: '+this.finalQuantites);
       for(let i=0; i < this.finalQuantites.length; i++){
         let obj2 = this.finalQuantites[i];
         switch(obj2.type){
           case 1:
             currentOnHand += obj2.quant;
             this.changeQuantityArray.push(currentOnHand);
             this.dates.push(obj2.date);
             break;
           case 0:
             currentOnHand -= obj2.quant;
             this.changeQuantityArray.push(currentOnHand);
             this.dates.push(obj2.date);
             break;
           case 3:
             currentOnHand -= obj2.quant;
             this.changeQuantityArray.push(currentOnHand);
             this.dates.push(obj2.date);
             break;
         }
       }
       this.dates.reverse();
       console.log('reversal:' + this.Reversalquantity);
       console.log('dispense:' + this.Dispensequantity);
       console.log('invoice:' + this.Invoicequantity);
        console.log('dates:' + this.dates);

        //this.chart.data.labels = this.dates;
        this.chart.data.datasets[0].data = this.changeQuantityArray.reverse();
        //this.chart.data.datasets[1].data = this.Reversalquantity.reverse();
        //this.chart.data.datasets[2].data =  this.Invoicequantity.reverse();
        this.chart.update();

      })
  }

  changeInQuantity(){
    this.Http.get('../../assets/json/jaishri_data_minmax.json', {responseType : 'text'})
      .subscribe( resp => {
        this.jsonDataResult = JSON.parse(resp);
        const sortedActivities = this.jsonDataResult.sort((a, b) => {
          console.log("a: " + a.transaction_date);
          console.log("b: " + b.transaction_date);
          //console.log("a value of: " + a.transaction_date.valueOf());
          //console.log("b value of: " + b.transaction_date.valueOf());
         // console.log("sorted: "+ (b.transaction_date.valueOf() - a.transaction_date.valueOf()))
          return b.transaction_date.valueOf() - a.transaction_date.valueOf()});
       // this.chart.data.labels = sortedActivities;

      })
  }
  populateAxes(){ // Todo: clean the method/ pull out reusable code
    const Dispensedates : any []= [];
    const Dispensequantity : any [] = [];
    const Reversaldates : any []= [];
    const Reversalquantity : any [] = [];
    const Invoicedates : any [] = [];
    const Invoicequantity : any [] = [];
    const onHandQuantity : any [] =[];
    const transTypes : any [] = []; // Todo: remove unused array/method
    let dispenses : any [] = [];
    let reversals : any [] = [];
    let invoices : any [] = [];
    const maxQuantity: any [] = [];
    const minQuantity: any [] = [];
    this.Http.get('../../assets/json/jaishri_data_minmax.json', {responseType : 'text'})
   .subscribe( resp => {
     this.jsonDataResult = JSON.parse(resp);
     dispenses = this.jsonDataResult.filter((t)=>t.transaction_type === 1);
     reversals = this.jsonDataResult.filter((t)=>t.transaction_type === 3);
     invoices = this.jsonDataResult.filter((t)=>t.transaction_type === 0);
     reversals.forEach(result=> {
       let transTypeString = this.differentTransactionTypes(result.transaction_type);
       var date = result.transaction_date;
       Reversaldates.push(date);
       Reversalquantity.push(result.quantity);
       maxQuantity.push(result.max_qty);
       minQuantity.push(result.MIN_QTY);
       transTypes.push(transTypeString);
     })
     dispenses.forEach(result => {
       let transTypeString = this.differentTransactionTypes(result.transaction_type);
       var date = result.transaction_date;
       Dispensedates.push(date);
       Dispensequantity.push(result.quantity);
       maxQuantity.push(result.max_qty);
       minQuantity.push(result.MIN_QTY);
       transTypes.push(transTypeString);
     })
     invoices.forEach(result => { // ToDo: fix the invoicesQuantity
       let transTypeString = this.differentTransactionTypes(result.transaction_type);
       var date = result.transaction_date;
       Invoicedates.push(date);
       Invoicequantity.push(result.quantity * result.mif_package_qty);
       maxQuantity.push(result.max_qty);
       minQuantity.push(result.MIN_QTY);
       onHandQuantity.push(result.on_hand);
       transTypes.push(transTypeString);
     })

      this.chart.data.labels = Dispensedates.reverse();
     //this.chart.data.datasets[0].data = Dispensequantity;
     //this.chart.data.datasets[1].data = Reversalquantity;
     //this.chart.data.datasets[2].data = Invoicequantity;
     this.chart.data.datasets[3].data = maxQuantity;
     this.chart.data.datasets[4].data = minQuantity;
     //this.chart.data.datasets[5].data = onHandQuantity;
     //this.chart.data.datasets[0].label = transTypes;
     this.chart.update();
   })
  }
  createChart(){
    Chart.register(...registerables);
    this.chart = new Chart(document.getElementById('chart') as  HTMLCanvasElement ,{
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Dispense',
          data: [],
          fill: false,

        },
         {
          label: 'Reversal',
          data: [],
          fill: false,
           backgroundColor:'#4dc9f6',
           showLine: true,
        },
          {
            label: 'Invoices',
            data: [],
            fill: false,
            backgroundColor:'#00a950',

          },
          {
            label: 'Max',
            data: [],
            fill: false,
            borderColor:'#acc236',
            backgroundColor:'#acc236',
          },
          {
            label: 'Min',
            data: [],
            fill: false,
            borderColor:'#f67019',
            backgroundColor:'#f67019',
          },
          {
            label: 'OnHand',
            data: [],
            fill: false,
            borderColor:'#1aafa2',
            backgroundColor:'#1aafa2',
          }]
      },
      options: {
        plugins:{
          tooltip: {
            callbacks: {
              label: function (tooltipItem: any) {
                console.log(tooltipItem)
                return tooltipItem
              }
            }
          },
          title:{
            display: true,
            text: 'Chart Title',
          }
        },
        responsive: false,
        scales: {
          x: {
              display: true,
              //reverse: true,

            title: {
              display: true,
              text: 'date',
              font: {
                family: 'times new roman',
                size: 10,
                weight: 'bold',
                lineHeight: 1.2,
              },
            }
          },
          y: {
              display: true,
             type: 'linear',
            title: {
              display: true,
              text: 'quantity',
              font: {
                family: 'times new roman',
                size: 10,
                weight: 'bold',
                lineHeight: 1.2,
              },
            }
            },
        }
      }
    });
  }

}
