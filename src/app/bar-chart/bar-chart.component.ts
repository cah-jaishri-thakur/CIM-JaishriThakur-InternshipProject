import {Component, Input, OnInit} from '@angular/core';
import { Chart, registerables} from 'chart.js';
import {HttpClient} from "@angular/common/http";
import {Transactions} from "../transactions";
import 'chartjs-adapter-moment';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
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
  populateAxes(){
    const Dispensedates : any []= [];
    const Dispensequantity : any [] = [];
    const Reversaldates : any []= [];
    const Reversalquantity : any [] = [];
    const transTypes : any [] = [];
    let dispenses : any [] = [];
    let reversals : any [] = [];
    const maxQuantity: any [] = [];
    const minQuantity: any [] = [];
    var dispenseTotal : number;
    const dispenseTotalArray : any [] = [];
    this.Http.get('../../assets/json/jaishri_data_minmax.json', {responseType : 'text'})
      .subscribe( resp => {
        this.jsonDataResult = JSON.parse(resp);
        dispenses = this.jsonDataResult.filter((t)=>t.transaction_type === 1);
        reversals = this.jsonDataResult.filter((t)=>t.transaction_type === 3);
        reversals.forEach(result=> {
          //let transTypeString = this.differentTransactionTypes(result.TRANSACTION_TYPE);
          var date = result.transaction_date.substring(0,10);
          Reversaldates.push(date);
          Reversalquantity.push(result.quantity);
          maxQuantity.push(result.max_qty);
          minQuantity.push(result.MIN_QTY);
          //transTypes.push(transTypeString);
        })
        dispenses.forEach(result => {
          //let transTypeString = this.differentTransactionTypes(result.TRANSACTION_TYPE);
          var date = result.transaction_date.substring(0,10);
          Dispensedates.push(date);
          Dispensequantity.push(result.quantity);
          maxQuantity.push(result.max_qty);
          minQuantity.push(result.MIN_QTY);
          //transTypes.push(transTypeString);
        })

        this.chart.data.labels = Dispensedates;
        this.chart.data.datasets[0].data = Dispensequantity;
        this.chart.data.datasets[1].data = Reversalquantity;
        this.chart.data.datasets[2].data = maxQuantity;
        this.chart.data.datasets[3].data = minQuantity;
        //this.chart.data.datasets[0].label = transTypes;
        this.chart.update();
      })
  }
  createChart(){
    Chart.register(...registerables);
    this.chart = new Chart(document.getElementById('chartID') as  HTMLCanvasElement ,{
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Dispense',
          data: [],
          //fill: false
        },
          {
            label: 'Reversal',
            data: [],
            //fill: false,
            backgroundColor:'#4dc9f6',
          },
          {
            label: 'Max',
            data: [],
            type: 'line',
            //fill: false,
            borderColor:'#acc236',
            backgroundColor: '#acc236',
          },
          {
            label: 'Min',
            data: [],
            type: 'line',
            //fill: false,
            borderColor:'#f67019',
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
            reverse: true,
            title: {
              display: true,
              text: 'Type of Transactions',
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
