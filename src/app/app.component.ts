import 'rxjs/add/operator/map';
import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { AssetsService } from './services/assets.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  constructor(){

  }

  ngOnInit(){
  }


}