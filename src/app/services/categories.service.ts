import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CategoriesService {

  constructor(private http: HttpClient) { }
  public categories = new BehaviorSubject(null);

  getCategories() {
    let apiURL = 'http://street-asset-manager-api.herokuapp.com/categories';
    return this.http.get(apiURL) .map(res => {
      return res;
    })
  }
    
  getSubCategories(name: String){
    let apiURL = 'http://street-asset-manager-api.herokuapp.com/categories/subcategories/';
    return this.http.get(apiURL + name).map(res => {
      return res;
    })
  }

  addCategory(category: any){
    let apiURL = 'http://street-asset-manager-api.herokuapp.com/categories';
    return this.http.post(apiURL, category).map((res: any) => {
      return res.results;
    })
  }

  deleteCategory(id: String){
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    headers.append('Access-Control-Allow-Origin','*');

    return this.http.delete(`https://asset-service.herokuapp.com/categories/${id}`, {headers: headers, withCredentials: true}).map((res: any) => {
      return res;
    })
  }

}
