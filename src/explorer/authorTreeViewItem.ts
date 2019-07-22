'use strict';

import { ThemeIcon, TreeItem, TreeItemCollapsibleState, Uri } from 'vscode';
import { AuthorDataItem } from './types';

/**
 * Class that represents a visual node on the
 * Chat Explorer tree view. Is essentially a wrapper for the underlying
 * TestDataItem.
 */
export class AuthorTreeItem extends TreeItem {
    constructor(
        public readonly data: Readonly<AuthorDataItem>
    ) {
        super(data.name, TreeItemCollapsibleState.None);
        this.setCommand();
    }

    public get iconPath(): string | Uri | { light: string | Uri; dark: string | Uri } | ThemeIcon {
        return ThemeIcon.Folder;
    }

    public get tooltip(): string {
        return 'Loading...';
    }

    private setCommand() {
        this.command = { command: 'extension.helloWorld', title: 'Open', arguments: [this.data] };
    }
}
