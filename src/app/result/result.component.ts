import { Component, Input, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  @Input() jsonData: any;
  @Input() from: 'transactionH' | undefined;


  constructor() { }

  ngOnInit(): void {
  }
  ngOnChanges(): void {
    if (this.jsonData) {
      console.log(this.jsonData);
    }

  }
  getBgColor() {
    if (this.from === 'transactionH') {
      return 'aliceblue';
    } else if (this.from === 'Second Way') {
      return 'lemonchiffon';
    } else {
      return 'whitesmoke';
    }
  }

}
