'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { IDisposable, AuthorData } from '../explorer/types';
import { GitBlame } from '../gitBlame/gitblame';

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

                if (!editor) {
                    return;
                }
                const lineRange = this.getLineNumberRange(editor);
                if (!lineRange) {
                    return;
                }
                const gitBlame = new GitBlame(repoPath, gitBlameShell);
                const file = path.relative(repoDir, editor.document.fileName);

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

    private getLineNumberRange(editor: vscode.TextEditor) {

        if (editor) {
            const start = editor.selections[0].start.line + 1;
            const end = editor.selections[0].end.line + 1;
            return [start, end];
        }
    }

}
