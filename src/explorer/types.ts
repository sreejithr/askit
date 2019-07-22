import { AuthorTreeItem } from "./authorTreeViewItem";
import { TreeDataProvider, Event } from "vscode";

export type AuthorData = {
    name: string;
    email?: string;
};

export class AuthorDataItem {
    public hasAuthoredSelectedLines?: boolean;
    constructor(public readonly author: AuthorData) { }
    public get name(): string {
        return this.author.name;
    }
    public get email(): string|undefined {
        return this.author.email;
    }
}

export type AuthorStatusData = {
    author: string;
    status: boolean;
};

export const IAuthorTreeViewProvider = Symbol('IAuthorTreeViewProvider');
export interface IAuthorTreeViewProvider extends TreeDataProvider<AuthorDataItem> {
    onDidChangeTreeData: Event<AuthorDataItem | undefined>;
    getTreeItem(element: AuthorDataItem): Promise<AuthorTreeItem>;
    getChildren(element?: AuthorDataItem): Promise<AuthorDataItem[]>;
}

export interface IDisposable {
    dispose(): void | undefined;
}