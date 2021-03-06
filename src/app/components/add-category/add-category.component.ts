import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import {
  DynamicCheckboxModel,
  DynamicCheckboxGroupModel,
  DynamicDatePickerModel,
  DynamicInputModel,
  DynamicSelectModel,
  DynamicRadioGroupModel,
  DynamicTextAreaModel,
  DynamicTimePickerModel,
  DynamicFormArrayModel,
  DynamicFormGroupModel,
  DynamicFormControlModel,
  DynamicFormLayout,
  DynamicFormService
} from "@ng-dynamic-forms/core";
import { of } from "rxjs/observable/of";
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { BOOTSTRAP_FORM_LAYOUT } from './bootstrap-form.layout';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  categories: any;

  SAMPLE_FORM_MODEL : any;

  formModel: DynamicFormControlModel[];
  formGroup: FormGroup;
  formLayout: DynamicFormLayout = BOOTSTRAP_FORM_LAYOUT;

  arrayControl: FormArray;
  arrayModel: DynamicFormArrayModel;

  categoryNames: any[] = [];

  constructor(private categoriesService: CategoriesService,
              private router: Router,
              private flashMessages: FlashMessagesService,
              private formService: DynamicFormService) { 
  }

  ngOnInit() {
    this.categoriesService.getCategories().subscribe(categories => {
      this.categories = categories;
      this.categories.map(category => {
        this.categoryNames.push({
          label: category.categoryName,
          value: category.categoryName
        });
      });
    }, err => {
      console.log(err);
    }, () => {
      this.SAMPLE_FORM_MODEL = [
        new DynamicFormGroupModel({
          id: "bootstrapFormGroup1",
          legend: "Add Category",
          group: [
            new DynamicInputModel({
              id: 'categoryName',
              label: 'Category Name',
              placeholder: 'Enter a Category Name',
              value: '',
              validators: {
                required: null,
                minLength: 5
              },
              errorMessages: {
                  required: "{{ label }} is required",
                  maxLength: "Min character count is 5"
              }
            }),
            new DynamicSelectModel<string>({
              id: "parent",
              label: "Select Parent",
              options: of(this.categoryNames),
              value: "",
              validators: {
                required: null
              },
              errorMessages: {
                required: "{{ label }} is required"
              }
            }),
            new DynamicFormArrayModel({
              id: 'properties',
              initialCount: 1,
              label: "Properties",
              groupFactory: () => {
                return [
                  new DynamicInputModel({
                    id: 'propertyName',
                    label: 'Property Name',
                    placeholder: 'Enter a Property Name',
                    value: '',
                    validators: {
                      required: null,
                      minLength: 5
                    },
                    errorMessages: {
                        required: "{{ label }} is required",
                        maxLength: "Min character count is 5"
                    }
                  }),
                  new DynamicSelectModel<string>({
                    id: "propertyType",
                    label: "Select Property Type",
                    options: of([
                        {
                            label: "string",
                            value: "string",
                        },
                        {
                            label: "number",
                            value: "number"
                        },
                        {
                            label: "listString",
                            value: "listString"
                        },
                        {
                            label: "listNumber",
                            value: "listNumber"
                        },
                        {
                            label: "boolean",
                            value: "boolean"
                        }
                    ]),
                    value: "",
                    validators: {
                      required: null
                    },
                    errorMessages: {
                      required: "{{ label }} is required"
                    }
                  }),
                  new DynamicCheckboxModel({
                    id: 'required',
                    label: 'Required'
                  }),
                  new DynamicFormGroupModel({
                    id: 'validation',
                    group: [
                      new DynamicSelectModel<string>({
                        id: "format",
                        label: "Select Validation Format",
                        options: of([
                            {
                                label: "string",
                                value: "string",
                            },
                            {
                                label: "number",
                                value: "number"
                            },
                            {
                                label: "listString",
                                value: "listString"
                            },
                            {
                                label: "listNumber",
                                value: "listNumber"
                            },
                            {
                                label: "boolean",
                                value: "boolean"
                            }
                        ]),
                        value: "",
                        validators: {
                          required: null
                        },
                        errorMessages: {
                          required: "{{ label }} is required"
                        }
                      }),
                      new DynamicInputModel({
                        id: 'pattern',
                        label: 'Validation Pattern',
                        placeholder: 'Enter a Validation Pattern',
                        value: ''
                      }),
                      new DynamicSelectModel<string>({
                        id: "type",
                        label: "Select Validation Type",
                        options: of([
                            {
                                label: "IP",
                                value: "IP",
                            },
                            {
                                label: "DATE",
                                value: "DATE"
                            },
                            {
                                label: "URL",
                                value: "URL"
                            },
                            {
                                label: "REGEX",
                                value: "REGEX"
                            },
                            {
                                label: "RANGE",
                                value: "RANGE"
                            },
                            {
                                label: "NAME",
                                value: "NAME"
                            }
                        ]),
                        value: "",
                        validators: {
                          required: null
                        },
                        errorMessages: {
                          required: "{{ label }} is required"
                        }
                      }),
                    ]
                  })
                ]
              }
            })
          ]
        })
      ];
      this.formModel = this.SAMPLE_FORM_MODEL;

      this.formGroup = this.formService.createFormGroup(this.formModel);

      this.arrayControl = this.formGroup.get("bootstrapFormGroup1").get("properties") as FormArray;
      this.arrayModel = this.formService.findById("properties", this.formModel) as DynamicFormArrayModel;
    });
  }

  add() {
    this.formService.addFormArrayGroup(this.arrayControl, this.arrayModel);
  }

  insert(context: DynamicFormArrayModel, index: number) {
      this.formService.insertFormArrayGroup(index, this.arrayControl, context);
  }

  remove(context: DynamicFormArrayModel, index: number) {
      this.formService.removeFormArrayGroup(index, this.arrayControl, context);
  }

  clear() {
    this.formService.clearFormArray(this.arrayControl, this.arrayModel);
  }

  onSave(){
    if(!this.formGroup.valid){
        let category: any = this.formGroup.value;
        let errors: any[] = [];

        for(let cat in category.bootstrapFormGroup1){
          if(cat == "parent"){
            category.bootstrapFormGroup1.parent = "s";
          }

          for (var prop in category.bootstrapFormGroup1[cat]) {
            for(var key in category.bootstrapFormGroup1[cat][prop]){
              if(key == "required"){
                category.bootstrapFormGroup1.properties.map(prop => {
                  prop.required = true;
                })
              }
            }
          }
          if(category.bootstrapFormGroup1[cat] == ""){
            // this.router.navigate(['/addCategory']);
            // this.flashMessages.show("Enter " + cat, {cssClass: 'alert-danger', timeout: 5000});
            errors.push(cat);
          } 
          for (var prop in category.bootstrapFormGroup1[cat]) {
            if(category.bootstrapFormGroup1[cat][prop] == ""){
              // this.router.navigate(['/addCategory']);
              // this.flashMessages.show("Enter " + prop, {cssClass: 'alert-danger', timeout: 5000});  
              errors.push(prop);
            }

            for(var key in category.bootstrapFormGroup1[cat][prop]){
              if(category.bootstrapFormGroup1[cat][prop][key] == ""){
                // this.router.navigate(['/addCategory']);
                // this.flashMessages.show("Enter " + key, {cssClass: 'alert-danger', timeout: 5000});  
                errors.push(key);
              }
              for(var val in category.bootstrapFormGroup1[cat][prop][key]){
                if(category.bootstrapFormGroup1[cat][prop][key][val] == ""){
                  // this.router.navigate(['/addCategory']);
                  // this.flashMessages.show("Enter " + val , {cssClass: 'alert-danger', timeout: 5000});  
                  errors.push(val);
                }
              }
            }
          }
        }
      this.router.navigate(['/addCategory']);
      this.flashMessages.show(`Enter ${errors.join()}` , {cssClass: 'alert-danger', timeout: 5000});  
    } else {
      let category: any = this.formGroup.value;

      if(category.bootstrapFormGroup1.parent == ""){
        delete category.bootstrapFormGroup1.parent;
      }

      let properties = category.bootstrapFormGroup1.properties;

      properties.map(prop => {
        prop.validation = null;
      });

      // this.categoriesService.addCategory(category.bootstrapFormGroup1).subscribe(categoryNew => {
      //   console.log(categoryNew);
      //   // if(categoryNew.id){
      //   //   this.flashMessages.show("Category Adedd", {cssClass: 'alert-success', timeout: 3000});
      //   //   this.router.navigate(['/addAsset'])
      //   // } else {
      //   //   this.flashMessages.show("Category alredy exist", {cssClass: 'alert-danger', timeout: 3000});
      //   //   this.router.navigate(['/addCategory'])
      //   // }
      // })
    }
  }
}