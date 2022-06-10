import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {TransactionHComponent} from './transaction-h/transaction-h.component';



const routes: Routes = [
  { path: 'transactionsH', component: TransactionHComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
