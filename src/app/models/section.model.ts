import { Workspace } from './workspace.model';
import { v4 as uuidv4} from 'uuid';

export class Section {
    public id: string;
    public name: string;
    public workspaces: Workspace[];
    public index: number;

    constructor(
        name: string,
        index: number,
        id?: number
    ) {
        this.id = id ? id : uuidv4();
        this.name = name;
        this.workspaces = [];
        this.index = index;
    }
}
