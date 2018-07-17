import { AssetsService } from './../../services/assets.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigationbar',
  templateUrl: './navigationbar.component.html',
  styleUrls: ['./navigationbar.component.css']
})
export class NavigationbarComponent implements OnInit {
  constructor(private assetService: AssetsService, private router: Router) { }

  ngOnInit() {

  }

}