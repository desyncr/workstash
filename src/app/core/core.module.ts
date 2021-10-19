import { NgModule } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

import { BrowserAPIService } from './browser-api/browser-api.service';
import { BrowserAPIFactory } from './browser-api/browser-api.factory';
import { LoadingService } from './services/loading.service';
import { SettingsService } from './services/settings.service';
import { WorkstashService } from './services/workstash.service';

@NgModule({
    providers: [
        {
            provide: BrowserAPIService,
            useFactory: BrowserAPIFactory,
        },
        TitleCasePipe,
        LoadingService,
        SettingsService,
        WorkstashService
    ],
})
export class CoreModule { }
