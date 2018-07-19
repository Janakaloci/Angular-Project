import { AssetsService } from '../../services/assets.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-asset-edit',
  templateUrl: './asset-edit.component.html',
  styleUrls: ['./asset-edit.component.css']
})
export class AssetEditComponent implements OnInit {
  assetId: String;
  asset: any;

  constructor(private assetsService: AssetsService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.assetId = this.route.snapshot.params['id'];

    this.assetsService.getAsset(this.assetId).subscribe(asset => {
      this.asset = asset;
    })
  }
  
  onSubmit({value, valid}:{value:any, valid:boolean}){    
    if(!valid){
      this.router.navigate(['/asset-edit/' + this.assetId]);
    } else {
      this.assetsService.updateAsset(this.assetId, value.model, value.brand, value.installationMode).subscribe(asset => {
        if(asset){
          this.asset = asset;
          this.router.navigate(['/']);
        }
      }, err => {
        this.router.navigate(['/asset-edit/' + this.assetId]);
      })
    }
  }
}