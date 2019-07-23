// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

'use strict';

import { Event, EventEmitter } from 'vscode';
import { IAuthorTreeViewProvider, IDisposable, AuthorDataItem } from './types';
import { AuthorTreeItem } from './authorTreeViewItem';
import { AuthorModelService } from '../authorModel/authorModelService';

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
        this.disposables.push(AuthorModelService.getInstance().onDidAuthorModelChange(this.onAuthorStatusChanged, this));
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
        return AuthorModelService.getInstance().authorsList
            .map(author => new AuthorDataItem(author));
    }

    private onAuthorStatusChanged() {
        this._onDidChangeTreeData.fire();
    }
}
