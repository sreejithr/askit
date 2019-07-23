import { GitBlame } from './gitblame';
import { StatusBarView } from './view';
import { GitBlameController } from './controller';
import {
    window, StatusBarAlignment,
    workspace,
} from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { IDisposable } from '../explorer/types';

const gitBlameShell = require('git-blame');

export class GitBlameExtension {
    public static getInstance(): GitBlameExtension {
        if (!this.instance) {
            this.instance = new GitBlameExtension();
        }
        return this.instance;
    }

    private static instance: GitBlameExtension;
    private disposables: IDisposable[] = [];
    public activate() {
        // Workspace not using a folder. No access to git repo.
        if (!workspace.rootPath) {
            return;
        }

        const workspaceRoot = workspace.rootPath;

        // Try to find the repo first in the workspace, then in parent directories
        // because sometimes one opens a subdirectory but still wants information
        // about the full repo.
        this.lookupRepo(workspaceRoot);
    }

    public dispose() {
        this.disposables.forEach(d => d.dispose());
    }

    private lookupRepo(repoDir: string) {
        const repoPath = path.join(repoDir, '.git');

        fs.access(repoPath, (err) => {
            if (err) {
                // No access to git repo or no repo, try to go up.
                const parentDir = path.dirname(repoDir);
                if (parentDir !== repoDir) {
                    this.lookupRepo(parentDir);
                }
            }
            else {
                const statusBar = window.createStatusBarItem(StatusBarAlignment.Left);
                const gitBlame = new GitBlame(repoPath, gitBlameShell);
                const controller = new GitBlameController(gitBlame, repoDir, new StatusBarView(statusBar));

                this.disposables.push(controller);
                this.disposables.push(gitBlame);
            }
        });
    }
}
