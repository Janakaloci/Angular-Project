import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { CategoriesService } from '../../services/categories.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
  styleUrls: ['./list-categories.component.css']
})
export class ListCategoriesComponent implements OnInit {
  categories: any;
  displayedColumns = ['id', 'categoryName', 'parent', 'propertiesLength'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource:any;


  constructor(private categoriesService: CategoriesService, private flashMessages: FlashMessagesService, private router: Router) { }

  ngOnInit() {
    this.categoriesService.getCategories().subscribe(categories => {
      this.categories = categories;
      this.dataSource = new MatTableDataSource<any>(this.categories);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  deleteCategory(id: string){
    this.categoriesService.deleteCategory(id).subscribe(category => {
      this.flashMessages.show("Category Deleted", {cssClass: 'alert-success', timeout: 3000});
      this.router.navigate(['/']);
      this.categoriesService.getCategories().subscribe(categories => {
        this.categories = categories;
        this.dataSource = new MatTableDataSource<any>(this.categories);
        this.dataSource.paginator = this.paginator;
      });
    }, err => {
      this.router.navigate(['/listCategories']);
      this.flashMessages.show("Category not Deleted", {cssClass: 'alert-danger', timeout: 3000});
    })
  }

}
