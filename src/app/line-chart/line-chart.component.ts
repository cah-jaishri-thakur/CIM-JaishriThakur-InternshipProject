import { Component, Input, AfterViewInit, ViewChild,ElementRef } from '@angular/core';
import { Chart, registerables} from 'chart.js';
import {HttpClient} from "@angular/common/http";
import {Transactions} from "../transactions";
import 'chartjs-adapter-moment';
import {Axes} from "../axes";
import {Transaction} from "../model/transaction";
import { TooltipItem } from 'chart.js';




@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent  {
  @Input() jsonData : any;
  chart!: Chart ;
  data : any [];
  jsonDataResult: Transactions [] = [];
  jsonFile = './assets/json/jaishri_data_minmax.json';

  TRANSACTION_DATE = 'transaction_date';
  TRANSACTION_TYPE = 'transaction_type';
  QUANTITY = 'quantity';
  MIN_QUANTITY = 'MIN_QTY';
  MAX_QUANTITY = 'max_qty';
  transactions: Transaction[] = [];

  changeQuantityArray : any[] =[];
   dates : any []= [];
   Dispensequantity : any [] = [];
   Reversalquantity : any [] = [];
   Invoicequantity : any [] = [];
   transTypesNum: any [] = [];
  maxQuantity: any [] = [];
  minQuantity: any [] = [];
  colorChange: any [] = [];
  finalQuantites : { date: Date, type: number, quant: number }[] =[];
  constructor(private Http: HttpClient) {
    this.data = [];
  }



  ngOnInit(): void {
    this.createChart();
    this.changeInQuantity2();
  }

  changeInQuantity2(){ // put transaction date & quantity in hashmap and plot backwards
    // Todo Step 1: Create an object array that takes in the transaction_type, quantity, and date X
    //      Step 2: Sort the array according the date in descending order
    //      Step 3: Put it through a for loop and adding conditional statements to figure out the transaction types
    //      Step 4: Based of the transaction type, increment or decrement onHand value and push into an array
    //      Step 5: Reverse the array so it will plot the points accordingly
    var currentOnHand = 274;
    const invoiceQuant : any [] = [];

    this.Http.get('../../assets/json/jaishri_data_minmax.json', {responseType : 'text'})
      .subscribe( resp => {
        this.jsonDataResult = JSON.parse(resp);
        this.jsonDataResult.forEach(result =>{
          let obj = {date: result.transaction_date,type: result.transaction_type, quant: result.quantity }
          this.finalQuantites.push(obj);
          this.dates.push(result.transaction_date);
          this.maxQuantity.push(result.max_qty);
          this.minQuantity.push(result.MIN_QTY);
          invoiceQuant.push(result.mif_package_qty); // todo: get the package quant to do the math
          this.finalQuantites.sort().reverse();
        })
        console.log('finalQuant array: '+this.finalQuantites);
       for(let i=0; i < this.finalQuantites.length; i++){
         let obj2 = this.finalQuantites[i];
         switch(obj2.type){
           case 1:
             currentOnHand += obj2.quant;
             this.changeQuantityArray.push(currentOnHand);
             this.transTypesNum.push(obj2.type);
             break;
           case 0:
             currentOnHand -= obj2.quant; // Todo    change invoice value
             this.changeQuantityArray.push(currentOnHand);
             this.transTypesNum.push(obj2.type);
            // this.dates.push(obj2.date);
             break;
           case 3:
             currentOnHand -= obj2.quant;
             this.changeQuantityArray.push(currentOnHand);
             this.transTypesNum.push(obj2.type);
            // this.dates.push(obj2.date);
             break;
         }
       }
       this.dates.reverse();
       this.transTypesNum.reverse();

        this.chart.data.datasets[0].backgroundColor = [];
        for(let i=0; i < this.transTypesNum.length; i++) {
          if(this.transTypesNum[i] === 1){
            this.colorChange.push('#ACEEAC');
          }else if(this.transTypesNum[i] === 3){
            this.colorChange.push('#1023FE');
          }else{
            this.colorChange.push('#F3F3B8')
          }
        }


        this.chart.data.labels = this.dates.sort();
        this.chart.data.datasets[0].data = this.changeQuantityArray.reverse();
        this.chart.data.datasets[1].data = this.maxQuantity;
        this.chart.data.datasets[2].data = this.minQuantity;
        //this.chart.data.datasets[1].data = this.Reversalquantity.reverse();
        //this.chart.data.datasets[2].data =  this.Invoicequantity.reverse();
        this.chart.update();
      })
  }

  createChart(){
    Chart.register(...registerables);
    this.chart = new Chart(document.getElementById('chart') as  HTMLCanvasElement ,{
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label:'Current On Hand',
            data: [],
            fill: false,
            pointBackgroundColor: this.colorChange,
            borderColor:'#9E9A72',
          },
          {
            label:'Max Value',
            data:[],
            fill: false,
            borderColor:'#acc236',
            backgroundColor: '#acc236',
          },
          {
            label:'Min Value',
            data:[],
            fill: false,
            borderColor:'#f67019',
            backgroundColor:'#f67019',
          },
         /* {
            label:'Dispense',
            data:[],
            borderColor:'#ACEEAC',
            backgroundColor:'#ACEEAC',
          },
          {
            label:'Reversal',
            data:[],
            borderColor:'#1023FE',
            backgroundColor:'#1023FE',
          },
          {
            label:'Invoice',
            data:[],
            borderColor:'#F3F3B8',
            backgroundColor:'#F3F3B8',
          }*/
        ]
      },
      options: {
        responsive: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                var index : string = context.dataIndex.toString();
                var x = context.dataset.pointBackgroundColor?[index];
                if(context.dataset.pointBackgroundColor && x === '#ACEEAC'){

                  return 'Dispense';
                }
              },
            },
          },
        },
        scales: {
          x: {
            display: true,
            type: 'time',
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


