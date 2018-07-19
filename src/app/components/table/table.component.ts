import { FlashMessagesService } from 'angular2-flash-messages';
import { Component, OnInit, NgZone, ViewChild, AfterViewInit } from '@angular/core';
import { AssetsService } from '../../services/assets.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import {MatTableDataSource, MatPaginator} from '@angular/material';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, AfterViewInit {
  assets: any;
  asset: any;
  modalReference: any;
  logged: any;
  displayedColumns = ['name', 'model', 'category', 'subcategory', 'description', 'brand', 'assetStatus', 'assetCondition', 'tags', 'showAsset', 'deleteAsset', 'editAsset'];
  reverseBtn: boolean = true;
  unreverseBtn: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource:any;

  constructor(private assetsService: AssetsService,
              private modalService: NgbModal,
              private router: Router,
              private zone: NgZone,
            private flashMessages: FlashMessagesService) { }

  ngOnInit() {
    this.assetsService.getAssets().subscribe(assets => {
      this.assets = assets;
      this.dataSource = new MatTableDataSource<any>(this.assets);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  showAssetDetail(asset: any, modal){
    this.asset = asset;
    this.modalReference = this.modalService.open(modal);
  }

  deleteAsset(id: String){
    if(confirm("Are you sure you want to delete this Asset ?")){
      this.assetsService.deleteAssets(id).subscribe(asset => {
        this.assetsService.getAssets().subscribe(assets => {
          this.assets = assets;
          this.assetsService.getAssets().subscribe(assets => {
            this.assets = assets;
            this.dataSource = new MatTableDataSource<any>(this.assets);
            this.dataSource.paginator = this.paginator;
          });
        }) 
        this.flashMessages.show("Asset Deleted", {cssClass: 'alert-success', timeout: 3000});
      })
    }
  }

  goToEdit(id: String){
    this.zone.run(() => {
      this.router.navigate([`/asset-edit/${id}`]);
    })
  }

  ngAfterViewInit(){
    
  }

  sortData(){
    this.reverseBtn = false;
    this.unreverseBtn = true;
    this.assetsService.getAssets().subscribe(assets => {
      this.assets = assets.reverse();
      this.dataSource = new MatTableDataSource<any>(this.assets);
      this.dataSource.paginator = this.paginator;
    });
  }

  unSortData(){
    this.unreverseBtn = false;
    this.reverseBtn = true;
    this.assetsService.getAssets().subscribe(assets => {
      this.assets = assets;
      this.dataSource = new MatTableDataSource<any>(this.assets);
      this.dataSource.paginator = this.paginator;
    });
  }
}
