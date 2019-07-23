// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

'use strict';

import { Event, EventEmitter } from 'vscode';
import { IAuthorTreeViewProvider, IDisposable, AuthorDataItem, AuthorStatusData } from './types';
import { AuthorTreeItem } from './authorTreeViewItem';

export class AuthorTreeViewProvider implements IAuthorTreeViewProvider, IDisposable {
    public static getInstance(): AuthorTreeViewProvider {
        if (!this.instance) {
            this.instance = new AuthorTreeViewProvider();
        }
        return this.instance;
    }

    private static instance: AuthorTreeViewProvider;
    public readonly onDidChangeTreeData: Event<AuthorDataItem | undefined>;
    private _onDidChangeTreeData = new EventEmitter<AuthorDataItem | undefined>();
    private disposables: IDisposable[] = [];

    constructor() {
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        // this.disposables.push(this.authorService.onDidStatusChange(this.onAuthorStatusChanged, this));
    }

    /**
     * As the TreeViewProvider itself is getting disposed, ensure all registered listeners are disposed
     * from our internal emitter.
     */
    public dispose() {
        this.disposables.forEach(d => d.dispose());
        this._onDidChangeTreeData.dispose();
    }

    /**
     * Get [TreeItem](#TreeItem) representation of the `element`
     *
     * @param element The element for which [TreeItem](#TreeItem) representation is asked for.
     * @return [TreeItem](#TreeItem) representation of the element
     */
    public async getTreeItem(element: AuthorDataItem): Promise<AuthorTreeItem> {
        return new AuthorTreeItem(element);
    }

    /**
     * As our tree contains no child notes, this returns roots of the tree
     */
    public async getChildren(): Promise<AuthorDataItem[]> {
        const author1 = {
            name: 'Kartik Raj',
            email: 'kartikr@microsoft.com',
            status: true
        };
        const author2 = {
            name: 'Paras Jindal',
            email: 'paras@microsoft.com',
            status: false
        };
        const author3 = {
            name: 'Ritvik Raj',
            email: 'ritvik@microsoft.com',
            status: true
        };
        return [new AuthorDataItem(author1), new AuthorDataItem(author2), new AuthorDataItem(author3)];
    }

    private onAuthorStatusChanged(e: AuthorStatusData) {
    }
}
