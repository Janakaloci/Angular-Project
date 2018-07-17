import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddassetsService {

  constructor(private http: HttpClient) {
   }
   getAssets(){
    return this.http.get('http://street-asset-manager-api.herokuapp.com/assets/search?page_size=999').map((res: any) => {
      return res.results;
    });
  }

}