import {Component, Input, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {Chart, registerables} from 'chart.js';
import {HttpClient} from "@angular/common/http";
import {Transactions} from "../transactions";
import 'chartjs-adapter-moment';
import {transactionHistoryService } from "../transactionHistoryService.service"
//todo: add service import

import {ChartTransaction} from "../model/chartTransaction";


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
  providers: [transactionHistoryService]
  //todo: add a provider
})
export class LineChartComponent {
  chart!: Chart;
  jsonDataResult: Transactions [] = [];

  maxQuantity: any [] = [];
  minQuantity: any [] = [];
  finalQuant: any [] = [];

  constructor(private Http: HttpClient, private transactionHistory : transactionHistoryService) { // todo: private transaction-history service: transaction-history-service

  }

  ngOnInit(): void {
    this.intializeData();
  }

  intializeData() {
    this.transactionHistory.getTransactionHistory()
      .subscribe(resp => {
        this.jsonDataResult = resp;
        var onHandVal = this.jsonDataResult[0].on_hand;
        this.jsonDataResult.sort((a,b) => {
          var datesA = new Date(a.transaction_date).valueOf();
          var dateB = new Date(b.transaction_date).valueOf();
          return dateB - datesA;
        });
        this.jsonDataResult.forEach(result => {
          var transObj : ChartTransaction= { x:result.transaction_date, y:onHandVal, type: result.transaction_type, packageQuant:result.mif_package_qty, transactionQuant: result.quantity};
          onHandVal = this.quantityChange(onHandVal, result.mif_package_qty, result.transaction_type, result.quantity);
          this.finalQuant.push(transObj);
          var max = {x:result.transaction_date, y:result.max_qty};
          var min = {x:result.transaction_date, y:result.MIN_QTY};
          this.maxQuantity.push(max);
          this.minQuantity.push(min);
        })
        this.createChart();
        this.chart.data.datasets[0].data = this.finalQuant.reverse();
        this.chart.data.datasets[1].data = this.maxQuantity;
        this.chart.data.datasets[2].data = this.minQuantity;
        this.chart.update();


      })
  }

  quantityChange(onHand: number, package_quant: number, type: number,quantity: number ){
    switch (type){
      case 0:
        return onHand -= quantity * package_quant;
        break;
      case 1:
        return onHand += quantity;
        break;
      case 3:
        return onHand -= quantity;
        break;
      default:
        return onHand;
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
            label: 'Adjusted On hand',
            data: [],
            fill: false,
            pointBackgroundColor: function (context) {
              var x = context.raw as ChartTransaction;
              if(x){
                if(x.type === 1){
                  return '#ACEEAC';
                }
                else if(x.type === 0){
                  return '#1023FE';
                }
                else if(x.type === 3){
                  return '#F3F3B8';
                }
                else{
                  return 'red';
                }
              }
              else{
                return 'black';
              }
              },
            borderColor: '#A96EAE',
          },
          {
            label: 'Max Value',
            data: [],
            fill: false,
            borderColor: '#acc236',
            backgroundColor: '#acc236',
            pointStyle: 'line',
          },
          {
            label: 'Min Value',
            data: [],
            fill: false,
            borderColor: '#f67019',
            backgroundColor: '#f67019',
            pointStyle: 'line',
          },
          {
            label: 'Dispense',
            data: [],
            borderColor: '#ACEEAC',
            backgroundColor: '#ACEEAC',
            pointStyle: 'circle',
          },
          {
            label: 'Invoice',
            data: [],
            borderColor: '#1023FE',
            backgroundColor: '#1023FE',
            pointStyle: 'circle',
          },
          {
            label: 'Reversal',
            data: [],
            borderColor: '#F3F3B8',
            backgroundColor: '#F3F3B8',
            pointStyle: 'circle',
          },
          {
            label: 'Adjusted OnHand',
            data: [],
            borderColor: '#A96EAE',
            backgroundColor: '#A96EAE',
            pointStyle: 'line',
          }
        ]
      },
      options: {
        responsive: false,
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              filter: function (legendItem, chartData) {
                let index = legendItem.datasetIndex;
                if(index && chartData.datasets[index].label === 'Adjusted On hand'){
                  return false;
                }else{
                  return true;
                }
               // return !!(chartData.datasets[legendItem.datasetIndex].label)
              },
            }
          },
          tooltip: {
            callbacks: {
              label:function (context){
                var x = context.raw as ChartTransaction;
                if(x){
                  if(x.type === 1){
                    return 'Dispense ' +x.transactionQuant + ' Adjusted OnHand: ' + x.y;
                  }
                  else if(x.type === 0){
                    return 'Invoice ' + x.transactionQuant*x.packageQuant + ' Adjusted OnHand: ' + x.y;
                  }
                  else if(x.type === 3){
                    return 'Reversal ' + x.transactionQuant + ' Adjusted OnHand: ' + x.y;
                  } else{
                    return ' ';
                  }
                }
                else{
                  return ' ';
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


