import { AuthorTreeItem } from "./authorTreeViewItem";
import { TreeDataProvider, Event } from "vscode";

export type AuthorData = {
  name: string;
  email?: string;
  status?: boolean;
  teamsMri?: string;
};

export class AuthorDataItem {
  public status?: boolean;

  constructor(public readonly author: AuthorData) {
    this.status = author.status;

  }

  public get name(): string {
    return this.author.name;
  }

  public get email(): string | undefined {
    return this.author.email;
  }
}

export const IAuthorTreeViewProvider = Symbol('IAuthorTreeViewProvider');
export interface IAuthorTreeViewProvider extends TreeDataProvider<AuthorDataItem> {
  onDidChangeTreeData: Event<AuthorDataItem | undefined>;
  getTreeItem(element: AuthorDataItem): Promise<AuthorTreeItem>;
  getChildren(element?: AuthorDataItem): Promise<AuthorDataItem[]>;
}

export interface IDisposable {
  dispose(): void | undefined;
}