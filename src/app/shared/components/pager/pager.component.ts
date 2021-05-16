import { IPager } from '../../models/pager.model';
import { EventEmitter } from '@angular/core';
import { Input } from '@angular/core';
import { Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit {
 @Output() changed: EventEmitter<number> = new EventEmitter<number>();
  @Input() model!: IPager;
  pageNumber: number[] = [];
  
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(){
    if(this.model){
      console.log('pager %o', this.model);
      this.model.items = (this.model.itemsPage > this.model.totalItems) ? this.model.totalItems : this.model.itemsPage;
      this.pageNumber=[];
      for(let i=0; i<this.model.totalPages; i++){
          this.pageNumber.push(i);
      }
    }
  }

  onPageClicked(page:number){
    console.log(page);
    this.changed.emit(this.model.actualPage = page);
  }

  onNextClicked(event: any){
    event.preventDefault();
    console.log('Pager next cliked');
    this.changed.emit(this.model.actualPage + 1);
  }

  onPreviousClicked(event: any){
    event.preventDefault();
    console.log('Pager previous clicked');
    this.changed.emit(this.model.actualPage - 1);
  }
}
