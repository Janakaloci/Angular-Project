import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, NgZone, ChangeDetectorRef, DoCheck, AfterViewInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssetsService } from '../../services/assets.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicFormControlModel, DynamicFormLayout, DynamicFormGroupModel, DynamicInputModel, DynamicFormService, DynamicCheckboxModel, DynamicSelectModel } from '@ng-dynamic-forms/core';
import { BOOTSTRAP_FORM_LAYOUT } from './bootstrap.layout';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from "rxjs/observable/forkJoin";
import { of } from "rxjs/observable/of";
import * as _ from 'lodash';
@Component({
  selector: 'app-asset-edit',
  templateUrl: './asset-edit.component.html',
  styleUrls: ['./asset-edit.component.css']
})
export class AssetEditComponent implements OnInit, AfterViewInit {
  assetId: String;
  asset: any;
  assets:any[] = [];

  SAMPLE_FORM_MODEL : any;
  formModel: DynamicFormControlModel[];
  formGroup: FormGroup;

  formLayout: DynamicFormLayout = BOOTSTRAP_FORM_LAYOUT;

  specificCategories: any;

  specificProps: any;

  constructor(private assetsService: AssetsService,
              private router: Router,
              private route: ActivatedRoute,
              private flashMessages: FlashMessagesService,
              private formService: DynamicFormService,
              private http: HttpClient
            ) { }

  ngOnInit() {
    this.assetId = this.route.snapshot.params['id'];

    this.assetsService.getAsset(this.assetId).subscribe(asset => {
      this.asset = asset;
    }, err => {

    }, () => {
    
    })
  }

  ngAfterViewInit(){
    setTimeout(() => {
      let categoryName:any = this.asset.category
      let subCategoryName: any = this.asset.subcategory;

      let schema = this.http.get('http://street-asset-manager-api.herokuapp.com/assets/schema');
      let specCategories = this.http.get(`http://street-asset-manager-api.herokuapp.com/categories/${categoryName}`);
      let specSubCategories = this.http.get(`http://street-asset-manager-api.herokuapp.com/categories/subcategories/${categoryName}`);
      let schemaNew = [];

      forkJoin([schema, specCategories, specSubCategories]).subscribe((results: any) => {
        var finalArr = results[2].reduce((a,x)=>{
          (a[0].properties = a[0].properties || []).push(...x.properties);
          return a;
        },[{}]);

        let newArr = [];

        finalArr.map(prop => {
          prop.properties.map(props => {
            newArr.push(props);
          })
        });

        let newFinalArray = results[1].properties.concat(newArr);

        var noDuplicates = _.uniqBy(newFinalArray, 'propertyName');

        noDuplicates.map(res => {
          results[0].properties.push(res);
        });

        schemaNew = results[0].properties;
    
        this.SAMPLE_FORM_MODEL = [
          new DynamicFormGroupModel({
            id: "bootstrapFormGroup3",
            legend: "Edit Asset",
            group: [
              new DynamicFormGroupModel({
                id: 'dimensions',
                group: [
                  
                ]
              }),
              new DynamicFormGroupModel({
                id: 'geoinfo',
                group: [
                  new DynamicFormGroupModel({
                    id: 'geometry',
                    group: [
                      
                    ]
                  })
                ]
              }),
              new DynamicFormGroupModel({
                id: 'specificProperties',
                legend: 'Specific Properties',
                group: [
                  
                ]
              }),
            ]
          })
        ];
    
        const dimensions = this.SAMPLE_FORM_MODEL[0].group.filter(form => {
          return form.name === "dimensions";
        });
    
        const geoinfo = this.SAMPLE_FORM_MODEL[0].group.filter(form => {
          return form.name === "geoinfo";
        });

        const specProperties = this.SAMPLE_FORM_MODEL[0].group.filter(form => {
          return form.name === "specificProperties";
        });

        dimensions[0].group = [];
    
        geoinfo[0].group[0].group = [];

        specProperties[0].group = [];

        console.log(this.asset);
    
        schemaNew.map(cat => {
          if(cat.propertyType === "String"){
            if(cat.propertyName === 'category'){
              this.SAMPLE_FORM_MODEL[0].group.push(
                new DynamicInputModel({
                  id: cat.propertyName,
                  label: cat.propertyName,
                  placeholder: 'Enter ' + cat.propertyName,
                  value: categoryName,
                  validators: {
                    required: null,
                  }, 
                  errorMessages: {
                    required: "{{ label }} is required"
                  }
                })
              )
            } else if (cat.propertyName === 'subcategory'){
              this.SAMPLE_FORM_MODEL[0].group.push(
                new DynamicInputModel({
                  id: cat.propertyName,
                  label: cat.propertyName,
                  placeholder: 'Enter ' + cat.propertyName,
                  value: subCategoryName,
                  validators: {
                    required: null
                  }, 
                  errorMessages: {
                    required: "{{ label }} is required"
                  }
                })
              )
            } else if (cat.propertyName === 'status') {
              this.SAMPLE_FORM_MODEL[0].group.push(
                new DynamicSelectModel<string>({
                id: "assetStatus",
                label: "Select Asset Status",
                options: of([
                    {
                        label: "ACTIVE",
                        value: "ACTIVE",
                    },
                    {
                        label: "DRAFT",
                        value: "DRAFT"
                    },
                    {
                        label: "DELETED",
                        value: "DELETED"
                    }
                ]),
                value: this.asset.assetStatus,
                validators: {
                  required: null,
                },
                errorMessages: {
                  required: "{{ label }} is required"
                }
                })
              )
            } else if (cat.propertyName === 'condition'){
              this.SAMPLE_FORM_MODEL[0].group.push(
                new DynamicSelectModel<string>({
                  id: "assetCondition",
                  label: "Select Asset Condition",
                  options: of([
                      {
                          label: "UNCHECKED",
                          value: "UNCHECKED",
                      },
                      {
                          label: "WELL",
                          value: "WELL"
                      },
                      {
                          label: "GOOD",
                          value: "GOOD"
                      },
                      {
                        label: "BAD",
                        value: "BAD",
                      },
                      {
                          label: "EXELLENT",
                          value: "EXELLENT"
                      },
                      {
                          label: "FINE",
                          value: "FINE"
                      },
                  ]),
                  value: this.asset.assetCondition,
                  validators: {
                    required: null
                  },
                  errorMessages: {
                    required: "{{ label }} is required"
                  }
                })
              )
            } else if (cat.propertyName === "serialNo"){
              this.SAMPLE_FORM_MODEL[0].group.push(
                new DynamicInputModel({
                  id: 'serial_no',
                  label: 'Serial Number',
                  placeholder: 'Enter Serial Number',
                  value: this.asset.serial_no,
                  validators: {
                    required: null
                  }, 
                  errorMessages: {
                    required: "{{ label }} is required"
                  }
                })
              )
            } else {
              for(let asset in this.asset){
                if(asset == cat.propertyName){
                  this.SAMPLE_FORM_MODEL[0].group.push(
                    new DynamicInputModel({
                      id: cat.propertyName,
                      label: cat.propertyName,
                      placeholder: 'Enter ' + cat.propertyName,
                      value: this.asset[asset],
                      validators: {
                        required: null
                      }, 
                      errorMessages: {
                        required: "{{ label }} is required"
                      }
                    })
                  )
                }
              }
            }
          } else if (cat.propertyType === "double"){
            for(let asset in this.asset.dimensions){
              if(asset == cat.propertyName){
                dimensions[0].group.push(
                  new DynamicInputModel({
                    id: cat.propertyName,
                    label: cat.propertyName,
                    placeholder: 'Enter ' + cat.propertyName,
                    value: this.asset.dimensions[asset],
                    inputType: 'number',
                    validators: {
                      required: null
                    }, 
                    errorMessages: {
                      required: "{{ label }} is required"
                    }
                  })
                )
              }
            }
          } else if (cat.propertyType === "ListString"){
            this.SAMPLE_FORM_MODEL[0].group.push(
              new DynamicInputModel({
                id: cat.propertyName,
                label: cat.propertyName,
                placeholder: 'Enter ' + cat.propertyName,
                multiple: true,
                value: this.asset.tags.join(),
                validators: {
                  required: null,
                }, 
                errorMessages: {
                  required: "{{ label }} is required"
                }
              })
            )
          } else if (cat.propertyType === "GeoInfo"){
            geoinfo[0].group[0].group.push(
              new DynamicInputModel({
                id: 'type',
                label: 'type',
                placeholder: 'Enter type',
                value: 'Point',
                inputType: 'text',
                validators: {
                  required: null
                }, 
                errorMessages: {
                  required: "{{ label }} is required"
                }
              }),
              new DynamicInputModel({
                id: 'coordinates',
                label: 'coordinates',
                placeholder: 'Enter coordinates',
                value: this.asset.geoinfo.geometry.coordinates.join(),
                inputType: 'text',
                validators: {
                  required: null
                }, 
                errorMessages: {
                  required: "{{ label }} is required"
                }
              })
            )
          } else {
            if(cat.propertyType === "string"){
              for(let asset in this.asset.specificProperties){
                specProperties[0].group.push(
                  new DynamicInputModel({
                    id: cat.propertyName,
                    label: cat.propertyName,
                    placeholder: 'Enter ' + cat.propertyName,
                    value: this.asset.specificProperties[asset],
                    inputType: 'text',
                    validators: {
                      required: null
                    }, 
                    errorMessages: {
                      required: "{{ label }} is required"
                    }
                  })
                )
              }
            } else if (cat.propertyType === "number"){
              for(let asset in this.asset.specificProperties){
                specProperties[0].group.push(
                  new DynamicInputModel({
                    id: cat.propertyName,
                    label: cat.propertyName,
                    placeholder: 'Enter ' + cat.propertyName,
                    value: this.asset.specificProperties[asset],
                    inputType: 'text',
                    validators: {
                      required: null
                    }, 
                    errorMessages: {
                      required: "{{ label }} is required"
                    }
                  })
                )
              }
            } else if (cat.propertyType === "listNumber"){
              for(let asset in this.asset.specificProperties){
                specProperties[0].group.push(
                  new DynamicInputModel({
                    id: cat.propertyName,
                    label: cat.propertyName,
                    placeholder: 'Enter ' + cat.propertyName,
                    value: this.asset.specificProperties[asset].join(),
                    inputType: 'text',
                    validators: {
                      required: null
                    }, 
                    errorMessages: {
                      required: "{{ label }} is required"
                    }
                  })
                )
              }
            } else if (cat.propertyType === "listString"){
              for(let asset in this.asset.specificProperties){
                specProperties[0].group.push(
                  new DynamicInputModel({
                    id: cat.propertyName,
                    label: cat.propertyName,
                    placeholder: 'Enter ' + cat.propertyName,
                    value: this.asset.specificProperties[asset].join(),
                    inputType: 'text',
                    validators: {
                      required: null
                    }, 
                    errorMessages: {
                      required: "{{ label }} is required"
                    }
                  })
                )
              }
            } else if (cat.propertyType === "boolean"){
              specProperties[0].group.push(
                new DynamicCheckboxModel({
                  id: cat.propertyName,
                  label: cat.propertyName
                })
              )
            }
          }
        });
      
        this.SAMPLE_FORM_MODEL[0].group.sort(function(a,b){
          return a.name == "dimensions" ? 1 : 0
        });

        this.SAMPLE_FORM_MODEL[0].group.sort(function(a,b){
          return a.name == "specificProperties" ? 1 : 0
        });
    
        this.formModel = this.SAMPLE_FORM_MODEL;
    
        this.formGroup = this.formService.createFormGroup(this.formModel);
      });
    }, 1000)
  }
  
  onSave(){
    if(!this.formGroup.valid){
      this.router.navigate(['/addAsset']);
      this.flashMessages.show("Validate the Form", {cssClass: 'alert-danger', timeout: 3000});
    } else {
      let asset: any = this.formGroup.value.bootstrapFormGroup3;

      this.assetsService.updateAsset(asset).subscribe(asset => {
        console.log(asset);
        this.router.navigate(['/']);
        this.flashMessages.show("Asset Added", {cssClass: 'alert-success', timeout: 3000});
      }, err => {
        this.flashMessages.show(err, {cssClass: 'alert-success', timeout: 3000});
      })
    }
  }
}