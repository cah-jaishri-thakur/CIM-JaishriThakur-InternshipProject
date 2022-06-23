import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';


import {TransactionHistoryComponent} from "./transaction-history/transaction-history.component";

const routes: Routes = [
  { path: 'transactionH', component: TransactionHistoryComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
