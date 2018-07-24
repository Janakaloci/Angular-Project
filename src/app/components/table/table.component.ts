import { FlashMessagesService } from 'angular2-flash-messages';
import { Component, OnInit, NgZone, ViewChild, AfterViewInit } from '@angular/core';
import { AssetsService } from '../../services/assets.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import {MatTableDataSource, MatPaginator, MatSort} from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicFormControlModel, DynamicFormLayout, DynamicFormGroupModel, DynamicInputModel, DynamicFormService, DynamicCheckboxModel, DynamicSelectModel } from '@ng-dynamic-forms/core';
import { BOOTSTRAP_FORM_LAYOUT } from './bootstrap.layout';
import { of } from "rxjs/observable/of";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})

export class TableComponent implements OnInit, AfterViewInit {
  assets: any;
  asset: any;
  modalReference: NgbModalRef;
  modelNewReference: NgbModalRef;
  logged: any;
  displayedColumns = ['id', 'name', 'model', 'category', 'subcategory', 'description', 'brand', 'assetStatus', 'assetCondition', 'tags', 'showAsset', 'deleteAsset', 'editAsset'];
  reverseBtn: boolean = true;
  unreverseBtn: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource:any;

  SAMPLE_FORM_MODEL : any;
  formModel: DynamicFormControlModel[];
  formGroup: FormGroup;

  formLayout: DynamicFormLayout = BOOTSTRAP_FORM_LAYOUT;

  constructor(private assetsService: AssetsService,
              private modalService: NgbModal,
              private router: Router,
              private zone: NgZone,
            private flashMessages: FlashMessagesService,
            private formService: DynamicFormService) { }

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

  showChangeStatus(asset: any, modal){
    this.asset = asset;

    this.SAMPLE_FORM_MODEL = [
      new DynamicFormGroupModel({
        id: "bootstrapFormGroup4",
        legend: '',
        group: [
          new DynamicSelectModel<string>({
            id: "assetStatus",
            label: "Select Asset Status",
            options: of(this.statusCheck(this.asset)),
            value: '',
            validators: {
              required: null,
            },
            errorMessages: {
              required: "{{ label }} is required"
            }
          })
        ]
      })
    ];

    this.formModel = this.SAMPLE_FORM_MODEL;
    
    this.formGroup = this.formService.createFormGroup(this.formModel);

    this.modelNewReference = this.modalService.open(modal);
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

  onSave(id: String){
    if(!this.formGroup.valid){
      this.modelNewReference.close();
      this.router.navigate(['/']);
      this.flashMessages.show("Validate the Form", {cssClass: 'alert-danger', timeout: 3000});
    } else {
      if(confirm("Are you sure you want to update Status?")){
        this.assetsService.updateAsset(this.formGroup.value.bootstrapFormGroup4.assetStatus, id).subscribe((res: any) => {
          this.modelNewReference.close();
          this.assetsService.getAssets().subscribe(assets => {
            this.assets = assets
            this.dataSource = new MatTableDataSource<any>(this.assets);
            this.dataSource.paginator = this.paginator;
          });
        })
      }
    }
  }

  sortData(){
    this.reverseBtn = false;
    this.unreverseBtn = true;
    this.assetsService.getAssets().subscribe(assets => {
      this.assets = this.assets.sort(function (a, b) {
        return a.id - b.id
      });
      this.dataSource = new MatTableDataSource<any>(this.assets);
      this.dataSource.paginator = this.paginator;
    });
  }

  unSortData(){
    this.unreverseBtn = false;
    this.reverseBtn = true;
    this.assetsService.getAssets().subscribe(assets => {
      this.assets = this.assets.sort(function (a, b) {
        return b.id - a.id
      });
      this.dataSource = new MatTableDataSource<any>(this.assets);
      this.dataSource.paginator = this.paginator;
    });
  }

  statusCheck(asset: any){
    if(asset.assetStatus == 'ACTIVE'){
      return [
        {
            label: "DRAFT",
            value: "DRAFT"
        },
        {
            label: "DELETED",
            value: "DELETED"
        }
      ]
    } else if(asset.assetStatus == 'DRAFT'){
      return [
        {
            label: "ACTIVE",
            value: "ACTIVE"
        },
        {
            label: "DELETED",
            value: "DELETED"
        }
      ]
    } else if(asset.assetStatus == 'DELETED'){
      return [
        {
            label: "DRAFT",
            value: "DRAFT"
        },
        {
            label: "ACTIVE",
            value: "ACTIVE"
        }
      ]
    }
  }
}
