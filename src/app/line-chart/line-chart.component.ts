import { Component, OnInit, AfterViewInit, ViewChild,ElementRef } from '@angular/core';
import { Chart, Point, LineController, LineElement, PointElement, LinearScale, Title } from 'chart.js';

import {CategoryScale} from 'chart.js';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements AfterViewInit  {
  @ViewChild('chart')
  private chartRef!: ElementRef;
  private chart!: Chart;
  private data: Point[];
  constructor() {
    this.data = [{x: 1, y: 5}, {x: 2, y: 10}, {x: 3, y: 6}, {x: 4, y: 2}, {x: 4.1, y: 6}];
  }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    Chart.register(LinearScale, Title);
    this.chart = new Chart(this.chartRef.nativeElement, {
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
            ticks: {
              display: true,
            }
          },
        }
      }
    });
  }

}
