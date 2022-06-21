import { Component, Input, AfterViewInit, ViewChild,ElementRef } from '@angular/core';
import { Chart, registerables} from 'chart.js';
import {HttpClient} from "@angular/common/http";
import {Transactions} from "../transactions";
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
  jsonFile = './assets/json/Untitled.json';
  constructor(private Http: HttpClient) {
    this.data = [];
  }



  ngOnInit(): void {
    this.populateAxes();
    this.createChart();
  }
  ngAfterViewInit(): void {

  }
  populateAxes(){
    const dates : any []= [];
    const quantity : any [] = [];
    this.Http.get('../../assets/json/Untitled.json', {responseType : 'text'})
   .subscribe( resp => {
     this.jsonDataResult = JSON.parse(resp);
     this.jsonDataResult.forEach(result => {
       var date = result.TRANSACTION_DATE.substring(5,7);
       var dateInt = parseInt(date);
       dates.push(date);
       quantity.push(result.QUANTITY);
     })
     this.chart.data.labels = dates;
     this.chart.data.datasets[0].data = quantity;
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
          label: 'Interesting Data',
          data: [],
          fill: false
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
              type: 'linear',
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
