'use strict';

import { ThemeIcon, TreeItem, TreeItemCollapsibleState, Uri } from 'vscode';
import { AuthorDataItem } from './types';
import { getIcon } from './icons';
import { Icons } from './constants';

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
        if (!this.data) {
            return '';
        }
        const status = this.data.status;
        if (status) {
            return getIcon(Icons.selectedUser);
        } else {
            return getIcon(Icons.normalUser);
        }
    }

    public get tooltip(): string {
        if (!this.data) {
            return '';
        }
        const status = this.data.status;
        if (status) {
            return 'Contributed to the selected code';
        } else {
            return 'Did not contribute to the selected code';
        }
    }

    private setCommand() {
        this.command = { command: 'askIt.chat', title: 'Open', arguments: [this.data] };
    }
}
