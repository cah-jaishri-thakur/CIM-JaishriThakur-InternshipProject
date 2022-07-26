import { Injectable } from '@angular/core';
import {ChartTransaction} from "./model/chartTransaction";
import { HttpClient } from'@angular/common/http';
import { map } from 'rxjs/operators';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class transactionHistoryService {

  constructor(private httpClient: HttpClient) { }
  getTransactionHistory(): Observable<any>{
    return this.httpClient.get<any>("http://localhost:3000/api/transactionHistory");

  }
}


