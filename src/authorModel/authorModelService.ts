'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import dedent from 'ts-dedent';
import { IDisposable, AuthorData } from '../explorer/types';
import { GitBlame } from '../gitblame';

const gitBlameShell = require('git-blame');

export class AuthorModelService {
    public static getInstance(): AuthorModelService {
        if (!this.instance) {
            this.instance = new AuthorModelService();
        }
        return this.instance;
    }

    private static instance: AuthorModelService;
    private readonly _onDidAuthorModelChange: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    private disposables: IDisposable[] = [];
    public _selectedText: string = '';
    public authorsList: AuthorData[] = [];
    public registerHandlers() {
        this.disposables.push(vscode.window.onDidChangeActiveTextEditor(this.updateModel, this));
        this.disposables.push(vscode.window.onDidChangeTextEditorSelection(() => this.updateModel()));
    }

    public dispose() {
        this.disposables.forEach(d => d.dispose());
        this._onDidAuthorModelChange.dispose();
    }

    public get onDidAuthorModelChange(): vscode.Event<void> {
        return this._onDidAuthorModelChange.event;
    }

    public get selectedText(): string {
        return this._selectedText;
    }

    private updateModel() {
        // Workspace not using a folder. No access to git repo.
        if (!vscode.workspace.rootPath) {
            return;
        }
        const workspaceRoot = vscode.workspace.rootPath;
        this.fetchDataAndUpdate(workspaceRoot);
    }

    private fetchDataAndUpdate(repoDir: string) {
        const repoPath = path.join(repoDir, '.git');

        fs.access(repoPath, (err) => {
            if (err) {
                // No access to git repo or no repo, try to go up.
                const parentDir = path.dirname(repoDir);
                if (parentDir !== repoDir) {
                    this.fetchDataAndUpdate(parentDir);
                }
            }
            else {
                const editor = vscode.window.activeTextEditor;
                const lineRange = this.getLineNumberRange(editor);
                if (!lineRange) {
                    this.authorsList = [];
                    this._onDidAuthorModelChange.fire();
                    return;
                }
                const gitBlame = new GitBlame(repoPath, gitBlameShell);
                const file = path.relative(repoDir, editor!.document.fileName);

                gitBlame.getBlameInfo(file).then((info) => {
                    this.authorsList = [];
                    for (const lineNumber in info['lines']) {
                        const hash = info['lines'][lineNumber]['hash'];
                        const commitInfo = info['commits'][hash];
                        const newAuthor = {
                            name: commitInfo.author.name,
                            email: commitInfo.author.mail,
                            status: false
                        };
                        if (parseInt(lineNumber) >= lineRange[0] && parseInt(lineNumber) <= lineRange[1]) {
                            newAuthor.status = true;
                        }
                        const index = this.authorsList.findIndex(author => author.name === newAuthor.name && author.email === newAuthor.email);
                        if (index !== -1) {
                            if (newAuthor.status === true) {
                                this.authorsList[index].status = true;
                            }
                        } else {
                            this.authorsList.push(newAuthor);
                        }
                    }
                    this._onDidAuthorModelChange.fire();
                });
            }
        });
    }

    private getLineNumberRange(editor: vscode.TextEditor | undefined): number[] | undefined {
        if (!editor) {
            return;
        }
        const doc = editor.document;
        if (!doc) {
            return;
        }
        if (doc.isUntitled) {
            return;
        }
        let startPosition = editor.selections[0].start;
        let endPosition = editor.selections[0].end;
        if (startPosition.line === endPosition.line) {
            this._selectedText = editor.document.lineAt(startPosition).text;
        } else {
            const range = new vscode.Range(startPosition, endPosition);
            this._selectedText = editor.document.getText(range);
        }
        this._selectedText = dedent(`\n${this._selectedText}`);
        const start = startPosition.line + 1;
        const end = endPosition.line + 1;
        return [start, end];
    }
}
