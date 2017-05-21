import * as request from 'request';

import { Observable } from 'rxjs/Observable';

import Error from '../models/APIError';
//Config
import STATUSCODES from '../config/StatusCodes';

class Captcha {
    private googleUrl:  string = 'https://www.google.com/recaptcha/api/siteverify';
    
    verifyRecaptcha(captcha: string, ip: string): Observable<boolean> {
        const date = {
            secret: '6LdiVyIUAAAAACPlJJqpY4RJLzc-TepytXWBoQNA',
            response: captcha,
            remoteip: ip
        }
        var options = {
                url: this.googleUrl,
                method: 'POST',
                form: date
        };
        
        let observable = Observable.create(function (observer) {
            request(options, function(err, httpResponse, body) { 
                const reponse = JSON.parse(body)
                console.log(reponse.success);
                if (!err && httpResponse.statusCode == 200) {
                    observer.next(reponse.success); 
                }else {
                    observer.error(err);     
                }          
            });
        });
        return observable;   
    }
}

export default new Captcha();