import { Base } from './base';
import { isObject } from 'util';

export class UrlParamsBuilder {
    public toparams(params): string {
        let ret = '';
        Base.forEach(params, (value, key) => {
            ret += this.toparamsarray(value, '&' + key);
        });

        return ret.slice(1);
    }

    private toparamsarray(params, add): string {
        let ret = '';
        if (Array.isArray(params)) {
            Base.forEach(params, function (value, key) {
              ret += add + '[]=' + value;
            });
        }
        else if (isObject(params)) {
            Base.forEach(params, (value, key) => {
                ret += this.toparamsarray(value, add + '[' + key + ']');
            });
        } else {
            ret += add + '=' + params;
        }

        return ret;
    }
}
