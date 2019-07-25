'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import dedent from 'ts-dedent';
import { IDisposable, AuthorData } from '../explorer/types';
import { GitBlame } from '../gitblame';

const gitBlameShell = require('git-blame');
const simpleGit = require('simple-git');

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
    private _selectedText: string = '';
    private _linkToSelectedText: string = '';
    private gitRepo = {};
    private _userName = '';
    private _userEmail = '';
    private _repoDir = '';
    private _file = '';
    private _lineRange = [-1, -1];
    private _isFetchComplete = false;
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

    public get isFetchComplete(): boolean {
        return this._isFetchComplete;
    }

    public get repoDir(): string {
        return this._repoDir;
    }

    public get file(): string {
        return this._file;
    }

    public get lineRange(): number[] {
        return this._lineRange;
    }

    public get selectedText(): string {
        return this._selectedText;
    }

    public get linkToSelectedText(): string {
        return this._linkToSelectedText;
    }

    public get userName(): string {
        return this._userName;
    }

    public get userEmail(): string {
        return this._userEmail;
    }

    private async updateModel() {
        // Workspace not using a folder. No access to git repo.
        if (!vscode.workspace.rootPath) {
            return;
        }
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const fileName = editor.document.fileName;
        if ((fileName in this.gitRepo)) {
            await this.fetchDataAndUpdate((this.gitRepo as any)[fileName]);
        } else {
            const fileDirectory = path.dirname(editor.document.fileName);
            await this.fetchDataAndUpdate(fileDirectory);
        }
    }

    private async fetchDataAndUpdate(repoDir: string): Promise<void> {
        const repoPath = path.join(repoDir, '.git');

        fs.access(repoPath, async (err) => {
            if (err) {
                // No access to git repo or no repo, try to go up.
                const parentDir = path.dirname(repoDir);
                if (parentDir !== repoDir) {
                    await this.fetchDataAndUpdate(parentDir);
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
                this._isFetchComplete = false;
                const gitBlame = new GitBlame(repoPath, gitBlameShell);
                const fileName = editor!.document.fileName;
                (this.gitRepo as any)[fileName] = this._repoDir = repoDir;
                const file = path.relative(repoDir, editor!.document.fileName);
                this._file = file;
                this._lineRange = lineRange;
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
                    // Fetch additional info in background
                    this.fetchInfo(editor!, repoDir, file, lineRange).catch(() => { });
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
        const start = editor.selections[0].start.line + 1;
        const end = editor.selections[0].end.line + 1;
        return [start, end];
    }

    public async populateSelectedText(editor: vscode.TextEditor) {
        let startPosition = editor.selections[0].start;
        let endPosition = editor.selections[0].end;
        if (startPosition.line === endPosition.line) {
            this._selectedText = editor.document.lineAt(startPosition).text;
        } else {
            const range = new vscode.Range(startPosition, endPosition);
            this._selectedText = editor.document.getText(range);
        }
        this._selectedText = dedent(`\n${this._selectedText}`);
    }

    public async populateLinkToSelectedText(repoDir: string, file: string, lineRange: number[]) {
        let remoteURL = await this.getRemoteURL(repoDir);
        if (remoteURL !== '') {
            const relativeFilePath = file.replace(/\\/g, '/');
            remoteURL = remoteURL.slice(0, -5);  // Remove trailing string '.git'
            if (remoteURL.includes('github.com/')) {
                this._linkToSelectedText = `${remoteURL}/blob/master/${relativeFilePath}#L${lineRange[0]}`;
            } else if (remoteURL.includes('bitbucket.org/')) {
                remoteURL = remoteURL.slice(0, -5);
                this._linkToSelectedText = `${remoteURL}/src/master/${relativeFilePath}`;
            }
        }
    }

    public async getRemoteURL(repoDir: string): Promise<string> {
        return new Promise<string>((resolve) => {
            simpleGit(repoDir)
                .listRemote(['--get-url'], (err: any, remoteUrl: string) => {
                    if (err) {
                        resolve('');
                    }
                    resolve(remoteUrl);
                });
        });
    }

    public async getUserName(repoDir: string) {
        return new Promise<void>((resolve) => {
            simpleGit(repoDir).raw(
                [
                    'config',
                    'user.name'
                ], (err: any, result: string) => {
                    if (err || !result) {
                        resolve();
                    }
                    this._userName = result.slice(0, -1);
                    resolve();
                });
        });
    }

    public async getUserEmail(repoDir: string) {
        return new Promise<void>((resolve) => {
            simpleGit(repoDir).raw(
                [
                    'config',
                    'user.email'
                ], (err: any, result: string) => {
                    if (err || !result) {
                        resolve();
                    }
                    this._userEmail = result.slice(0, -1);
                    resolve();
                });
        });
    }

    public async fetchInfo(editor: vscode.TextEditor, repoDir: string, file: string, lineRange: number[]) {
        await this.populateSelectedText(editor);
        await this.populateLinkToSelectedText(repoDir, file, lineRange);
        await this.getUserName(repoDir);
        await this.getUserEmail(repoDir);
        this._isFetchComplete = true;
    }
}
