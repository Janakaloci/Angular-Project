import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { AssetsService} from './services/assets.service';
import { TableComponent } from './components/table/table.component';
import { Routes, RouterModule } from '@angular/router'; 
import { AssetEditComponent } from './components/asset-edit/asset-edit.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavigationbarComponent } from './components/navigationbar/navigationbar.component';
import { AddAssetsComponent } from './components/add-assets/add-assets.component';
import { AddCategoryComponent } from './components/add-category/add-category.component';
import { MapComponent } from './components/map/map.component';
import { CategoriesService } from './services/categories.service';
import { PaginationComponent } from './components/pagination/pagination.component';
import { BsDropdownModule } from 'ngx-bootstrap';
import { MatButtonModule, MatCheckboxModule, MatTableModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, MatCardModule } from '@angular/material';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { ListCategoriesComponent } from './components/list-categories/list-categories.component';
import { DynamicFormsCoreModule } from "@ng-dynamic-forms/core";
import { DynamicFormsBootstrapUIModule } from "@ng-dynamic-forms/ui-bootstrap";
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

const appRoutes: Routes = [
  {path: '', component: TableComponent},
  {path: 'asset-edit/:id', component: AssetEditComponent},
  {path: 'addAsset', component: AddAssetsComponent},
  {path: 'addCategory', component: AddCategoryComponent},
  {path: 'map',  component: MapComponent},
  {path: 'listCategories', component: ListCategoriesComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    AssetEditComponent,
    HeaderComponent,
    FooterComponent,
    NavigationbarComponent,
    AddAssetsComponent,
    AddCategoryComponent,
    MapComponent,
    PaginationComponent,
    ListCategoriesComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    BsDropdownModule.forRoot(),
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    NoopAnimationsModule,
    MatPaginatorModule,
    MatCardModule,
    FlashMessagesModule.forRoot(),
    ReactiveFormsModule,
    DynamicFormsCoreModule.forRoot(),
    DynamicFormsBootstrapUIModule,
    LeafletModule
  ],
  providers: [
    AssetsService,
    CategoriesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }