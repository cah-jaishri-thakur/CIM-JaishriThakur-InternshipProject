import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Transactions} from "../transactions";

@Component({
  selector: 'app-transaction-history',
  templateUrl:`
    <div class="transactionH">
      <app-result [from]="'transactionH'" [jsonData]="jsonDataResult"></app-result>
    </div>
  `,
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {
  jsonDataResult: Transactions [] = [];

  constructor(private Http: HttpClient) {}

  ngOnInit(): void {
    this.Http.get('../../assets/json/8242_100_txns.json', {responseType : 'text'})
      .subscribe( resp => {
        this.jsonDataResult = JSON.parse(resp);
      })
    console.log('--- First Way of jsonDataResult :: ', this.jsonDataResult);
  }

}
