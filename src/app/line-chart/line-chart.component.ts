import { Component, Input, AfterViewInit, ViewChild,ElementRef } from '@angular/core';
import { Chart, Point, registerables} from 'chart.js';



@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements AfterViewInit  {
  chart: Chart | undefined;
  data: Point[];
  jsonFile = './assets/json/Untitled.json';
  constructor() {
    this.data = [{x: 1, y: 5}, {x: 2, y: 10}, {x: 3, y: 6}, {x: 4, y: 2}, {x: 4.1, y: 6}];
  }


  ngOnInit(): void {
    this.createChart();
  }
  ngAfterViewInit(): void {

  }
  createChart(){
    Chart.register(...registerables);
    this.chart = new Chart(document.getElementById('chart') as  HTMLCanvasElement ,{
      type: 'line',
      data: {
        datasets: [{
          label: 'Interesting Data',
          data: this.data,
          fill: false
        }]
      },
      options: {
        responsive: false,
        scales: {
          x: {
              display: true,
              type: 'linear',
          },
          y: {
              display: true,
             type: 'linear',
            },
        }
      }
    });
  }

}
