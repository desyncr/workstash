import { Injectable, Injector } from '@angular/core';
import { Workspace, Section, WorkstashState, Tab } from '@models';
import { AbstractStore } from '@core/abstract/store.abstract';
import { Subject, Observable } from 'rxjs';
import { ReturnStatement } from '@angular/compiler';
import { ControlContainer } from '@angular/forms';

declare var window: any;
@Injectable({
    providedIn: 'root'
})
export class WorkstashService extends AbstractStore<WorkstashState> {

    protected readonly STORAGE_KEY: string = 'workspaces';
    
    // Fixed a default state to work with
    protected readonly DEFAULT_STATE: WorkstashState = JSON.parse('{"sections":[{"id":"d138ed91-9349-410b-8b6a-aed5804e0fba","name":"Default","workspaces":[{"id":"3b808293-1f09-409a-a4d1-7b695cd1dddd","name":"Main","tabs":[{"id":4,"url":"https://www.google.com/?gws_rd=ssl","title":"Google","index":0},{"id":5,"url":"https://trello.com/","title":"Trello","index":1},{"id":6,"url":"https://stackoverflow.com/","title":"Stack Overflow - Where Developers Learn, Share, & Build Careers","index":2}],"active":false,"open":false},{"id":"f02a9628-a00f-434c-ab66-ab6fbb7ac8b9","name":"News","tabs":[],"initialized":false,"active":false,"open":false}],"index":0},{"id":"ffb5ccac-f104-4400-bc57-5a39f7adcdb4","name":"Development","workspaces":[{"id":"9a0dc43c-1577-4063-9d6f-75f1718112c1","name":"Team","tabs":[],"initialized":false}],"index":1}]}');
    private currentWorkspaceId: string;

    constructor(public injector: Injector) {
        super(injector);
    }

    private onUpdate(tab: any, workspace: Workspace) {
        if (tab.pinned) {
            console.log('Not registering pinned tab: ' + tab.url);
            return;
        }

        if (!workspace.active) {
            console.log('Workspace inactive: ' + workspace.id + '. Not registering tab update: ' + tab.url);
            return;
        }

        const tabIndex = workspace.tabs.findIndex(item => item.id === tab.id);
        if (tabIndex >= 0) {
            console.log('Update tab: ' + tab.url + ', id: ' + tab.id);
            workspace.tabs[tabIndex].title = tab.title;
            workspace.tabs[tabIndex].url = tab.url;
            workspace.tabs[tabIndex].index = tab.index;
        } else {
            console.log('Tab not existing: ' + tab.url + ', id: ' + tab.id);
        }
    }

    private onCreate(tab: any, workspace: Workspace) {
        console.log('Created new tab: ' + tab.url);
        if (tab.pinned) {
            console.log('Not registering pinned tab: ' + tab.url);
            return;
        }
        if (!workspace.active) {
            console.log('Workspace inactive: ' + workspace.id + '. Not registering tab creation: ' + tab.url);
            return;
        }
        const tabIndex = workspace.tabs.findIndex(item => item.id === tab.id);
        if (tabIndex >= 0) {
            console.log('Tab already exists, not saving: ' + tab.url + ', id: ' + tab.id);
            return;
        }
        console.log('Registered tab creation: ' + tab.url + ', id: ' + tab.id);
        const aTab = new Tab(tab.id);
        aTab.url = tab.url
        aTab.title = tab.title;
        aTab.index = tab.index;
        workspace.tabs.push(aTab);
    }

    private onRemove(tabId: number, workspace: Workspace) {
        console.log('Removing tab');
        if (!workspace.active) {
            console.log('Workspace inactive: ' + workspace.id + '. Not registering tab removal: ' + tabId);
            return;
        }
        const tabIndex = workspace.tabs.findIndex(item => item.id === tabId);
        if (tabIndex >= 0) {
            console.log('Removed tab: ' + tabId);
            workspace.tabs.splice(tabIndex, 1);
        } else {
            console.log('Tab not existing: ' + tabId);
        }
    }

    public async init(): Promise<WorkstashState> {
        console.log('Init workstash service');
        
        let querying = window.browser.tabs.query({currentWindow: true, pinned: false});
        querying.then((tabs: any[]) => {
            tabs.forEach((tab) => {
                // These change in development
                if (tab.url.match(/60fc1c98-a0a4-b74c-8b4b-81dc508c57ee/)) {
                    window.browser.tabs.update(tab.id, {pinned: true});
                }
            });
        });

        console.log('Registering listener for workspaces');
        window.browser.tabs.onUpdated.addListener((tabIdx, changeInfo, tab) => {
            const state = super.getState();
            state.sections.forEach((section) => {
                section.workspaces.forEach((workspace) => {
                    if (workspace.id == this.currentWorkspaceId) {
                        this.onUpdate(tab, workspace);
                    }
                });
            });
    
            super.setState(state);
        });

        window.browser.tabs.onCreated.addListener((tab) => {
            const state = super.getState();
            state.sections.forEach((section) => {
                section.workspaces.forEach((workspace) => {
                    if (workspace.id == this.currentWorkspaceId) {
                        this.onCreate(tab, workspace);
                    }
                });
            });
    
            super.setState(state);
        });

        window.browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
            const state = super.getState();
            state.sections.forEach((section) => {
                section.workspaces.forEach((workspace) => {
                    if (workspace.id == this.currentWorkspaceId) {
                        this.onRemove(tabId, workspace);
                    }
                });
            });
            console.log(state);
            super.setState(state);
        });

        return super.init().then((state: WorkstashState) => {
            this.setState(state);
            return state;
        });
    }

    public createSection(name: string) {
        const state = super.getState();
        state.sections.push(new Section(name + ' (' + state.sections.length + ')', state.sections.length));
        super.setState(state);
    }

    public deleteSection(uuid: string) {
        const state = super.getState();
        const removeIndex = state.sections.findIndex(item => item.id === uuid);
        state.sections.splice(removeIndex, 1);
        super.setState(state);
    }

    public hasOpenWorkspaces(): boolean {
        return this.currentWorkspaceId != null;
    }

    // component = ng.getComponent(document.querySelector('app-root'))
    // component.workstashService
    //
    // Create workspace in section
    public createWorkspace(name: string, sectionId: string) {
        const state = super.getState();
        const sectionIndex = state.sections.findIndex(item => item.id === sectionId);
        state.sections[sectionIndex].workspaces.push(new Workspace(name));
        super.setState(state);
    }

    // Open workspace
    public activateWorkspace(uuid: string) {
        const state = super.getState();
        state.sections.forEach((section) => {      
            section.workspaces.forEach((workspace) => {
                if (workspace.id === uuid) {
                    if (!workspace.active) {
                        this.activate(workspace);
                    }
                } else {
                    this.deactivate(workspace);
                }

                if (workspace.id == uuid) {
                    workspace.open = true;
                }
            });
        });
        this.currentWorkspaceId = uuid;

        super.setState(state);
    }

    // Close workspace
    public closeWorkspace(uuid: string) {
        const state = super.getState();
        state.sections.forEach((section) => {
            section.workspaces.forEach((workspace) => {
                if (workspace.id == uuid) {
                    this.close(workspace);
                }
            });
        });

        super.setState(state);
    }

    public activate(workspace: Workspace) {
        workspace.active = true;
        workspace.tabs.forEach(async (tab: Tab) => {
            console.log('Restoring tab id: ' + tab.id + ', url: ' + tab.url);
            window.browser.tabs.show(tab.id).then(
                () => {},
                () => {
                    console.log('Create new tabs workspace. Removing stale entry.');
                    const tabIndex = workspace.tabs.findIndex(item => item.id === tab.id);
                    if (tabIndex >= 0) {
                        console.log('Removed stale tab: ' + tab.id);
                        workspace.tabs.splice(tabIndex, 1);
                    }

                    window.browser.tabs.create({
                        url: tab.url,
                        index: tab.index,
                        active: false
                    });
                }
            );
        });
    }

    public deactivate(workspace: Workspace) {
        workspace.active = false;

        workspace.tabs.forEach((tab: Tab) => {
            window.browser.tabs.hide(tab.id);
        });
    }

    public close(workspace: Workspace) {
        workspace.open = false;
        workspace.active = false;
        workspace.tabs.forEach((tab: Tab) => {
            window.browser.tabs.remove(tab.id);
        });
    }
}
