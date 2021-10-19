import { Section } from './section.model';
import { Tab } from './tab.model';
import { v4 as uuidv4} from 'uuid';

declare var window: any;
export class Workspace {
    public id: string;
    public tabs: Tab[];
    public name: string;
    public index: number;
    public active: boolean;
    public open: boolean;

    constructor(
        name: string,
        id?: string
    ) {
        this.id = id ? id : uuidv4();
        this.name = name;
        this.tabs = [];
        this.open = false;
    }
}
