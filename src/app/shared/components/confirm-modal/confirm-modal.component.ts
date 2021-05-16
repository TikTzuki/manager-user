import { Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {
  @Input() message: string;
  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  onDimiss(){
    this.activeModal.dismiss();
  }

  onSubmit(){
    this.activeModal.close();
  }

}
