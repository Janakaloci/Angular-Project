import { Component, OnInit, NgZone, ChangeDetectorRef, DoCheck } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
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
  selector: 'app-add-assets',
  templateUrl: './add-assets.component.html',
  styleUrls: ['./add-assets.component.css']
})

export class AddAssetsComponent implements OnInit {
  categories: any;
  subcategories: any = [];
  subcategoryShow: boolean = false;
  addBtnShow: boolean = false;
  addAssetForm: boolean = false;
  categoryName: any = "Select One Of Categories";
  subCategoryName: any = "Select One Of Subcategories";

  schema: any;

  SAMPLE_FORM_MODEL : any;
  formModel: DynamicFormControlModel[];
  formGroup: FormGroup;

  formLayout: DynamicFormLayout = BOOTSTRAP_FORM_LAYOUT;

  specificCategories: any;

  specificProps: any;

  constructor(private categoriesService: CategoriesService,
  private assetService: AssetsService,
  private router: Router,
  private flashMessages: FlashMessagesService,
  private formService: DynamicFormService,
  private http: HttpClient
) { }

  ngOnInit() {
    this.categoriesService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  selectSub(categoryName: String){
    this.subcategoryShow = true;
    this.categoryName = categoryName;

    this.categoriesService.getSubCategories(categoryName).subscribe(subcategories => {
      this.subcategories = subcategories;
    });

    return categoryName;
  }

  selectSubCategory(categoryName: String){
    this.subCategoryName = categoryName;
    this.addBtnShow = true;
    return categoryName;
  }

  addAssetBtn(){
    this.addAssetForm = true;
    let categoryName:any = this.selectSub(this.categoryName);
    let subCategoryName: any = this.selectSubCategory(this.subCategoryName);

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
          id: "bootstrapFormGroup2",
          legend: "Add Asset",
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
              legend: "Specific Properties",
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
  
      schemaNew.map(cat => {
        if(cat.propertyType === "String"){
          if(cat.propertyName === 'category'){
            this.SAMPLE_FORM_MODEL[0].group.push(
              new DynamicInputModel({
                id: cat.propertyName,
                label: cat.propertyName,
                placeholder: 'Enter ' + cat.propertyName,
                value: categoryName
              })
            )
          } else if (cat.propertyName === 'subcategory'){
            this.SAMPLE_FORM_MODEL[0].group.push(
              new DynamicInputModel({
                id: cat.propertyName,
                label: cat.propertyName,
                placeholder: 'Enter ' + cat.propertyName,
                value: subCategoryName
              }),
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
              value: "",
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
                value: "",
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
                value: '',
                validators: {
                  required: null
                }, 
                errorMessages: {
                  required: "{{ label }} is required"
                }
              })
            )
          } else {
            this.SAMPLE_FORM_MODEL[0].group.push(
              new DynamicInputModel({
                id: cat.propertyName,
                label: cat.propertyName,
                placeholder: 'Enter ' + cat.propertyName,
                value: '',
                validators: {
                  required: null
                }, 
                errorMessages: {
                  required: "{{ label }} is required"
                }
              })
            )
          }
        } else if (cat.propertyType === "double"){
          dimensions[0].group.push(
            new DynamicInputModel({
              id: cat.propertyName,
              label: cat.propertyName,
              placeholder: 'Enter ' + cat.propertyName,
              value: 0,
              inputType: 'number',
              validators: {
                required: null
              }, 
              errorMessages: {
                required: "{{ label }} is required"
              }
            })
          )
        } else if (cat.propertyType === "ListString"){
          this.SAMPLE_FORM_MODEL[0].group.push(
            new DynamicInputModel({
              id: cat.propertyName,
              label: cat.propertyName,
              placeholder: 'Enter ' + cat.propertyName,
              multiple: true,
              value: "",
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
              value: [],
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
            specProperties[0].group.push(
              new DynamicInputModel({
                id: cat.propertyName,
                label: cat.propertyName,
                placeholder: 'Enter ' + cat.propertyName,
                value: '',
                inputType: 'text',
                validators: {
                  required: null
                }, 
                errorMessages: {
                  required: "{{ label }} is required"
                }
              })
            )
          } else if (cat.propertyType === "number"){
            specProperties[0].group.push(
              new DynamicInputModel({
                id: cat.propertyName,
                label: cat.propertyName,
                placeholder: 'Enter ' + cat.propertyName,
                value: 0,
                inputType: 'number',
                validators: {
                  required: null
                }, 
                errorMessages: {
                  required: "{{ label }} is required"
                }
              })
            )
          } else if (cat.propertyType === "listNumber"){
            specProperties[0].group.push(
              new DynamicInputModel({
                id: cat.propertyName,
                label: cat.propertyName + ' Type:' + cat.propertyType,
                placeholder: 'Enter value by putting commas between (,)',
                value: [],
                inputType: 'text',
                validators: {
                  required: null
                }, 
                errorMessages: {
                  required: "{{ label }} is required"
                }
              })
            )
          } else if (cat.propertyType === "listString"){
            specProperties[0].group.push(
              new DynamicInputModel({
                id: cat.propertyName,
                label: cat.propertyName + ' Type:' + cat.propertyType,
                placeholder: 'Enter value by putting commas between (,)',
                value: [],
                inputType: 'text',
                validators: {
                  required: null
                }, 
                errorMessages: {
                  required: "{{ label }} is required"
                }
              })
            )
          } else if (cat.propertyType === "boolean"){
            specProperties[0].group.push(
              new DynamicCheckboxModel({
                id: cat.propertyName,
                label: cat.propertyName,
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
  }
   onSave(){
    if(!this.formGroup.valid){
      // this.router.navigate(['/addAsset']);
      // this.flashMessages.show("Validate the Form", {cssClass: 'alert-danger', timeout: 3000});
      let asset: any = this.formGroup.value.bootstrapFormGroup2;
      let errors: any[] = [];

      for(let val in asset){
        // if(asset[val] != ""){
        //   console.log(asset[val]);
        // }
        if(asset[val] == ""){
          // this.router.navigate(['/addAsset']);
          // this.flashMessages.show("Enter " + val, {cssClass: 'alert-danger', timeout: 5000});
          errors.push(val);
        } 

        for (var prop in asset[val]) {
          if(asset[val][prop] == ""){
            // this.router.navigate(['/addAsset']);
            // this.flashMessages.show("Enter " + prop, {cssClass: 'alert-danger', timeout: 5000});  
            errors.push(prop);
          }

          for (var key in asset[val][prop]) {
            if(asset[val][prop][key] !== "" && typeof asset[val][prop][key] !== "string"){
              // this.router.navigate(['/addAsset']);
              // this.flashMessages.show("Enter "  + key, {cssClass: 'alert-danger', timeout: 5000});  
              errors.push(prop);
            }
          }
        }
      }

      this.router.navigate(['/addAsset']);
      this.flashMessages.show(`Enter ${errors.join()}`, {cssClass: 'alert-danger', timeout: 5000});  
    } else {
      let asset: any = this.formGroup.value.bootstrapFormGroup2;

      if(asset.tags !== ""){
        asset.tags = asset.tags.split(",");
      } 

      if (asset.geoinfo.geometry.coordinates !== ""){
        asset.geoinfo.geometry.coordinates = asset.geoinfo.geometry.coordinates.split(",");
      }

      if (asset.geoinfo.geometry.coordinates.length == 1){
          this.router.navigate(['/addAsset']);
          this.flashMessages.show("Validate the Form", {cssClass: 'alert-danger', timeout: 3000});
      } else {
        for (const k in asset.specificProperties) {
            if (asset.specificProperties[k].includes(',')) {
              asset.specificProperties[k] = asset.specificProperties[k].split(",")
            } else {
              asset.specificProperties[k] = asset.specificProperties[k]
            }
        }
        this.assetService.addAsset(asset).subscribe(asset => {
          console.log(asset);
          this.router.navigate(['/']);
          this.flashMessages.show("Asset Added", {cssClass: 'alert-success', timeout: 3000});
        }, err => {
          this.flashMessages.show(err, {cssClass: 'alert-success', timeout: 3000});
        })
      }
    }
  }
}