import { Component, OnInit, Injector } from '@angular/core';
import { BaseAbstract } from '@core/abstract/base.abstract';
import { WorkstashState } from '@models';
import { WorkstashService } from '@core/services/workstash.service';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent extends BaseAbstract implements OnInit {

    public workstash: WorkstashState;

    constructor(
        public injector: Injector,
        private workstashService: WorkstashService
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.workstashService.$state.subscribe({
            next: (workstash: WorkstashState) => {
                this.workstash = workstash;
            }
        });
    }

    public createSection() {
        this.workstashService.createSection('New section');
    }

    public deleteSection(uuid: string) {
        this.workstashService.deleteSection(uuid);
    }

    public createWorkspace(uuid: string) {
        this.workstashService.createWorkspace('New', uuid);
    }

    public activateWorkspace(uuid: string) {
        this.workstashService.activateWorkspace(uuid);
    }

    public closeWorkspace(uuid: string) {
        this.workstashService.closeWorkspace(uuid);
    }

    public hasOpenWorkspaces(): boolean {
        return this.workstashService.hasOpenWorkspaces();
    }
}
