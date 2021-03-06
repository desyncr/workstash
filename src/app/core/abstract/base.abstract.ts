import { Injectable, Injector, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from '@core/services/loading.service';

@Injectable()
export class BaseAbstract implements OnDestroy {

    protected loadingService: LoadingService;

    protected subs: { [key: string]: Subscription } = {};
    protected timeouts: { [key: string]: any } = {};

    constructor(public injector: Injector) {
        this.loadingService = this.injector.get(LoadingService);
    }

    ngOnDestroy() {
        Object.values(this.subs).forEach((sub: Subscription) => {
            if (!!sub && !!sub.unsubscribe) {
                sub.unsubscribe();
            }
        });
        Object.values(this.timeouts).forEach((timeout: any) => {
            if (!!timeout) {
                clearTimeout(timeout);
            }
        });
    }
}
