import { Component, OnInit } from '@angular/core';
import { AssetsService } from '../../services/assets.service';
declare var $:any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  sidebarOff: boolean = true;
  sidebarOn: boolean = false;
  constructor(private assetService: AssetsService) { }

  ngOnInit() {
    
  }

  changeRoute(){
  }

  eventCalled() {

    this.sidebarOff = false;
    this.sidebarOn = true;
    $('#sidebar').toggleClass('active');
    $("#content").removeClass('col-md-10').addClass('col-md-12');
  }

  eventOneCalled(){
    this.sidebarOff = true;
    this.sidebarOn = false;
    $('#sidebar').toggleClass('active');
    $("#content").removeClass('col-md-12').addClass('col-md-10');
  }

}
