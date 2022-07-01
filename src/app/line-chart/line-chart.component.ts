import { Component, Input, AfterViewInit, ViewChild,ElementRef } from '@angular/core';
import { Chart, registerables} from 'chart.js';
import {HttpClient} from "@angular/common/http";
import {Transactions} from "../transactions";
import 'chartjs-adapter-moment';
import {Axes} from "../axes";
import {Transaction} from "../model/transaction";


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements AfterViewInit  {
  @Input() jsonData : any;
  chart!: Chart ;
  data : any [];
  jsonFile = './assets/json/jaishri_data_minmax.json';

  TRANSACTION_DATE = 'transaction_date';
  TRANSACTION_TYPE = 'transaction_type';
  QUANTITY = 'quantity';
  MIN_QUANTITY = 'MIN_QTY';
  MAX_QUANTITY = 'max_qty';
  transactions: Transaction[] = [];

  constructor(private Http: HttpClient) {
    this.data = [];
  }

  ngOnInit(): void {
    this.populateDataset();
  }

  getTransactionType(transType : number){
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

  sortTransactions(transactions: Transaction[]): Transaction[] {
    return transactions.sort((a, b) => a.transaction_date.getTime() - b.transaction_date.getTime());
  }

  populateDataset() {
    this.Http.get('../../assets/json/jaishri_data_minmax.json', {responseType: 'text'})
      .subscribe( resp => {
        let result: [] = JSON.parse(resp);
        result.forEach(r => this.transactions.push(new Transaction(
          this.getTransactionType(r[this.TRANSACTION_TYPE]),
          new Date(r[this.TRANSACTION_DATE]),
          r[this.QUANTITY],
          r[this.MIN_QUANTITY],
          r[this.MAX_QUANTITY]))
        );
        this.transactions = this.sortTransactions(this.transactions);
        this.createChart();
      });
  }

  createChart(){
    Chart.register(...registerables);
    this.chart = new Chart(document.getElementById('chart') as HTMLCanvasElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            data: JSON.parse(JSON.stringify(this.transactions)),
            fill: false,
            parsing: {
              xAxisKey: this.TRANSACTION_DATE,
              yAxisKey: this.QUANTITY
            }
          }
        ]
      },
      options: {
        plugins:{
          title:{
            display: true,
            text: 'Inventory Remaining Purchases'
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let transaction = context.raw as Transaction;
                return transaction.transaction_type + ' - ' + transaction.quantity;
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
                lineHeight: 1.2
              }
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
                lineHeight: 1.2
              }
            }
          }
        }
      }
    });
  }

  ngAfterViewInit(): void {}

}
