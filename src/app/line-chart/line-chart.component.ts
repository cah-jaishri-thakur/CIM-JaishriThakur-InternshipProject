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
  constructor(private Http: HttpClient) {
    this.data = [];
  }



  ngOnInit(): void {
    this.createChart();
    this.populateAxes();
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
  populateAxes(){
    const Dispensedates : any []= [];
    const Dispensequantity : any [] = [];
    const Reversaldates : any []= [];
    const Reversalquantity : any [] = [];
    const Invoicedates : any [] = [];
    const Invoicequantity : any [] = [];
    const transTypes : any [] = [];
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
     invoices.forEach(result => {
       let transTypeString = this.differentTransactionTypes(result.transaction_type);
       var date = result.transaction_date;
       Invoicedates.push(date);
       Invoicequantity.push(result.quantity);
       maxQuantity.push(result.max_qty);
       minQuantity.push(result.MIN_QTY);
       transTypes.push(transTypeString);
     })

     this.chart.data.labels = Dispensedates;
     this.chart.data.datasets[0].data = Dispensequantity;
     this.chart.data.datasets[1].data = Reversalquantity;
     this.chart.data.datasets[2].data = Invoicequantity;
     this.chart.data.datasets[3].data = maxQuantity;
     this.chart.data.datasets[4].data = minQuantity;
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
          fill: false
        },
         {
          label: 'Reversal',
          data: [],
          fill: false,
           backgroundColor:'#4dc9f6',
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
            backgroundColor:'#acc236',
          },
          {
            label: 'Min',
            data: [],
            fill: false,
            backgroundColor:'#f67019',
          }]
      },
      options: {
        plugins:{
          title:{
            display: true,
            text: 'Chart Title',
          }
        },
        responsive: false,
        scales: {
          x: {
              display: true,
            type: 'time',
            time: {
              unit: 'month'
            },
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
