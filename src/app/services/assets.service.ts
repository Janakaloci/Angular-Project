import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {
  constructor(private http: HttpClient) { 
  }
 
  getAssets(){
    return this.http.get('http://street-asset-manager-api.herokuapp.com/assets/search?page_size=999').map((res: any) => {
      return res.results;
    });
  }

  deleteAssets(id: String){
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    headers.append('Access-Control-Allow-Origin','*');

    return this.http.delete(`https://asset-service.herokuapp.com/assets/${id}`, {headers: headers, withCredentials: true}).map((res: any) => {
      return res;
    })
  }
  getAsset(id: String){
    return this.http.get(`http://street-asset-manager-api.herokuapp.com/assets/${id}`).map((res: any) => {
      return res;
    })
  }
  updateAsset(assetStatus: String, id: String){
    let headers = new HttpHeaders();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin','*');
    
    let body = `assetId=${id}&newStatus=${assetStatus}`;


    return this.http.put(`https://asset-service.herokuapp.com/assets/update/status?${body}`, {headers: headers}).map(res => {
      return res;
    })
  }

  addAsset(asset: any){
    return this.http.post('http://street-asset-manager-api.herokuapp.com/assets', asset).map((res: any) => {
      return res.results;
    })
  }

  getAssetSchema(){
    return this.http.get('http://street-asset-manager-api.herokuapp.com/assets/schema').map((schema: any) => {
      return schema.properties;
    });
  }

  getSchemaCategory(categoryName: String){
    return this.http.get('http://street-asset-manager-api.herokuapp.com/categories/' + categoryName).map((category: any) => {
      return category.properties;
    })
  }

  getSchemaSubCategory(categoryName: String){
    return this.http.get('http://street-asset-manager-api.herokuapp.com/categories/subcategories' + categoryName).map((category: any) => {
      return category;
    })
  }
}