import { Component, OnInit } from '@angular/core';
import { URLSearchParams} from "@angular/http";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss']
})
export class SendEmailComponent implements OnInit {
  endpoint = 'https://us-central1-lakbay-c65e4.cloudfunctions.net/httpEmail';

  constructor(private http: HttpClient) { }

  sendEmail() {

    const data = {
      toEmail: 'somebody@example.com',
      toName: 'Jeff Delaney'
    }

    this.http.post(this.endpoint, data).subscribe()

    // let url = `https://us-central1-lakbay-c65e4.cloudfunctions.net/httpEmail`;
    // let params: URLSearchParams = new URLSearchParams();
    // let headers1 = { headers: new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
    //
    // params.set('to', 'bjeraldmark@gmail.com');
    // params.set('from', 'lakbaymotors.phil@gmail.com');
    // params.set('subject', 'test-email');
    // params.set('content', 'Hello World');
    //
    // return this.http.post(url, params, headers1)
    //   .toPromise()
    //   .then( res => {
    //     console.log(res);
    //
    //     return res;
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })

  }

  ngOnInit() {
  }

}
