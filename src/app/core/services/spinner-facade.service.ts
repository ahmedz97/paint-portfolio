import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerFacadeService {
  constructor(private spinner: NgxSpinnerService) {}

  show(name?: string): void {
    this.spinner.show(name);
  }

  hide(name?: string): void {
    this.spinner.hide(name);
  }
}

