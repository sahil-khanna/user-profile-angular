import { Component, OnInit } from '@angular/core';
import { Utils } from '../common/service/utils.service';
import { AlertHelper } from '../common/service/alert-helper.service';
import { WebServiceService } from '../common/service/web-service/web-service.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent implements OnInit {

  constructor(
    private utils: Utils,
    private webservice: WebServiceService,
    private activatedRoute: ActivatedRoute,
    private alertHelper: AlertHelper
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.activateAccount(decodeURIComponent(params['key']));
    });
  }

  private activateAccount(key: string) {
    const $this = this;
    this.webservice.execute({
      method: 'activate-account',
      urlParams: {key: key},
      priority: 'high',
      loadingMessage: 'Please wait',
      callback: function(resp) {
        if (resp.code === 0) {
          $this.alertHelper.push({text: resp.message});
        } else {
          $this.alertHelper.push({text: resp.message});
        }
      }
    });
  }

}
