import { Workspace } from './workspace.model';

export class Tab {
    public id: number;
    public title: string;
    public url: string;
    public index: number;
    constructor(id: number) {
        this.id = id;
    }
}
