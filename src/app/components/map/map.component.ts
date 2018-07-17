import { Component, OnInit, ElementRef } from '@angular/core';
import { icon, marker, LeafletMouseEvent, latLng,tileLayer, polygon } from 'leaflet';
import { AssetsService } from '../../services/assets.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  listOfAssets: any;
  markers: any[] = [];
  googleMaps:any;
  options:any;
  polyline: any;
  constructor(private elementRef: ElementRef,
              private assetsService: AssetsService) { }

  ngOnInit() {
    this.googleMaps = tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 18,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      detectRetina: true
    });

    this.options = {
      layers: [ this.googleMaps ],
      zoom: 5,
      center: latLng([ 45.01246, 39.00137 ])
    };

    this.assetsService.getAssets().subscribe(assets => {
      this.listOfAssets = assets;

      this.getMap(this.listOfAssets);
    })
  }

  getMap(assets: any){
    assets.map(asset => {
      if(asset.geoinfo.geometry.coordinates.filter(Array.isArray).length == 0){
        if(asset[0] === undefined){
          this.markers.push(marker([asset.geoinfo.geometry.coordinates[0],asset.geoinfo.geometry.coordinates[1]],{
            icon: icon({
              iconSize: [ 25, 41 ],
              iconAnchor: [ 13, 41 ],
              iconUrl: 'assets/marker-icon.png',
              shadowUrl: 'assets/marker-shadow.png'
            })
          })
          .bindPopup(`
            <div align='center'>
              <p style='font-size:15px'>Asset Status: ${asset.assetStatus}</p>
              <p style='font-size:15px'>Asset Condition: ${asset.assetCondition}</p>
            </div>
          `)
          )
        } 
      }
    })
  }

}