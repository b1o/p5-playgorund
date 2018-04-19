import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostBinding,
  HostListener,
  ChangeDetectorRef
} from '@angular/core';

declare var p5;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
}
