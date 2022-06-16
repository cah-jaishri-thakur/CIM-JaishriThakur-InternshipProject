import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import {HttpClientModule} from "@angular/common/http";
import { LineChartComponent } from './line-chart/line-chart.component';
import { ResultComponent } from './result/result.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    TransactionHistoryComponent,
    LineChartComponent,
    ResultComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
