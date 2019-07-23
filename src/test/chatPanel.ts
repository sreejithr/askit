'use strict';

import * as vscode from 'vscode';

export class TeamsChat {
    public static getInstance(): TeamsChat {
        if (!this.instance) {
            this.instance = new TeamsChat();
        }
        return this.instance;
    }

    private static instance: TeamsChat;
    private panel: vscode.WebviewPanel | undefined;

    public getWebViewPanel() {
        if (this.panel) {
            return this.panel;
        }
        this.panel = vscode.window.createWebviewPanel(
            "chatPanel",
            "Chat",
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                portMapping: [{
                    extensionHostPort: 80,
                    webviewPort: 80
                }],
            }
        );
        return this.panel;
    }

}
