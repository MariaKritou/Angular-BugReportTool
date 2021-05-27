import { BugComment } from "./bug-comment";

export class Bug {

    id?: String;
    title?: String;
    description?: String;
    priority?: number;
    reporter?: String;
    status?: String;
    updatedAt?: String;
    createdAt?: string;
    comments?: BugComment[]
}
