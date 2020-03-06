import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { IDocumentResource } from '../interfaces/data-object';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { JsonapiConfig } from '../jsonapi-config';
import { share, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IDocumentData } from '../interfaces/document';

@Injectable()
export class Http {
    // NOTE: GET requests are stored in a this object to prevent duplicate requests
    public get_requests: { [key: string]: Observable<IDocumentData> } = {};

    public constructor(@Optional() @Inject(REQUEST) private request: any, @Inject(PLATFORM_ID) private platformId: any, private http: HttpClient, private rsJsonapiConfig: JsonapiConfig) {}

    public exec(path: string, method: string, data?: IDocumentResource): Observable<IDocumentData> {
        let url = this.rsJsonapiConfig.url
        let req = {
            body: data || null,
            headers: new HttpHeaders({
                'Content-Type': 'application/vnd.api+json',
                Accept: 'application/vnd.api+json'
            })
        };

        if (isPlatformServer(this.platformId) && !url.match(/^http\:|^https\:|^\/\//)) {
            const headers = this.request.headers
            const proto = (headers['x-forwarded-proto']) ? headers['x-forwarded-proto'].split(',')[0] : (headers['proto']) ? headers['proto'] : 'http'
            const host = (headers['x-forwarded-host']) ? headers['x-forwarded-host'].split(',')[0] : headers['host']
            url = `${proto}://${host}${url}`
        }

        // NOTE: prevent duplicate GET requests
        if (method === 'get') {
            if (!this.get_requests[path]) {
                let obs = this.http.request<IDocumentData>(method, url + path, req).pipe(
                    tap(() => {
                        delete this.get_requests[path];
                    }),
                    share()
                );
                this.get_requests[path] = obs;

                return obs;
            }

            return this.get_requests[path];
        }

        return this.http.request<IDocumentData>(method, url + path, req).pipe(
            tap(() => {
                delete this.get_requests[path];
            }),
            share()
        );
    }
}
