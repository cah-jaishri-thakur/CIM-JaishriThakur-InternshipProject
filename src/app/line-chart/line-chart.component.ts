import {Component, Input} from '@angular/core';
import {Chart, registerables} from 'chart.js';
import {HttpClient} from '@angular/common/http';
import {Transactions} from '../transactions';
import 'chartjs-adapter-moment';
import {DataPoint} from '../model/data-point';


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent {
  @Input() jsonData: any;
  chart!: Chart;
  data: Transactions [] = [];
  dates: any [] = [];
  finalDataSet: any[] = [];

  constructor(private Http: HttpClient) {
  }


  ngOnInit(): void {
    this.initializeChart();
  }

  initializeChart() {
    let currentOnHand = 0;
    this.Http.get('../../assets/json/jaishri_data_minmax.json', {responseType: 'text'})
      .subscribe(resp => {
        this.data = JSON.parse(resp);
        currentOnHand = this.data[0].on_hand;
        this.data.sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());
        this.data.forEach(result => {
          let obj =
            {
              x: result.transaction_date,
              y: currentOnHand,
              transactionDate: result.transaction_date,
              transactionType: this.getTransactionType(result.transaction_type),
              quantity: result.quantity,
              pkgQty: result.mif_package_qty
            };
          this.finalDataSet.push(obj);
          currentOnHand = this.calculateCurrentOnHand(currentOnHand, result.quantity, result.transaction_type, result.mif_package_qty)
        });

        this.createChart();
        this.chart.data.datasets[0].data = this.finalDataSet.reverse();
        this.chart.update();
      })
  }

  calculateCurrentOnHand(currentOnHand: number, txnQuantity: number, transactionType: number, pkgQty: number): number {
    switch (transactionType) {
      case 1:
        return currentOnHand += txnQuantity;
      case 0:
        return currentOnHand -= txnQuantity * pkgQty;
      case 3:
        return currentOnHand -= txnQuantity;
      default:
        return currentOnHand;
    }
  }

  getTransactionType(transactionType: number): string {
    switch (transactionType) {
      case 1:
        return 'Dispense: ';
      case 0:
        return 'Invoice: ';
      case 3:
        return 'Reversal: ';
      default:
        return 'Other: ';
    }
  }

  createChart() {
    Chart.register(...registerables);
    this.chart = new Chart(document.getElementById('chart') as HTMLCanvasElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            fill: false,
            pointBackgroundColor: function (context) {
              if (context.dataset.data.length > 0) {
                let index = context.dataIndex;
                let transaction = context.dataset.data[index] as DataPoint;
                if (transaction.transactionType.includes('Invoice')) {
                  return '#eb4034';
                } else if (transaction.transactionType.includes('Dispense')) {
                  return '#353adb';
                } else if (transaction.transactionType.includes('Reversal')) {
                  return '#9e35db';
                } else {
                  return '#7e7a80';
                }
              } else {
                return '';
              }
            },
          }
        ]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Inventory History for ' + this.data[0].brand_description
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let transaction = context.raw as DataPoint;
                if (transaction.transactionType === 'Invoice') {
                  let metricQty = transaction.quantity * transaction.pkgQty
                  return 'Invoice: ' + transaction.quantity + 'X' + transaction.pkgQty + ', On Hand: ' + transaction.y
                }
                return transaction.transactionType + transaction.quantity + ', On Hand: ' + transaction.y;
              }
            }
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
