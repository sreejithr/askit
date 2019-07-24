// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import webViewContent from "./getWebView";
import { AuthorTreeViewProvider } from './explorer/authorTreeViewProvider';
import { AuthorModelService } from './authorModel/authorModelService';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "askit" is now active!');

	vscode.commands.executeCommand('setContext', 'askItExtensionActivated', true).then(() => { });

	let disposable = vscode.commands.registerCommand('askIt.chat', async () => {

		const authorNodes = await AuthorTreeViewProvider.getInstance().getChildren();
		const selectedAuthors = authorNodes.filter(author => author.status === true);
		// Display a message box to the user
		const panel = vscode.window.createWebviewPanel(
			"chatPanel",
			"Chat",
			{
				viewColumn: vscode.ViewColumn.Beside,
				preserveFocus: true
			},
			{
				enableScripts: true,
				retainContextWhenHidden: true,
				portMapping: [{
					extensionHostPort: 80,
					webviewPort: 80
				}],
			}
		);
		panel.webview.html = webViewContent();
	});

	context.subscriptions.push(disposable);

	const treeDataProvider = AuthorTreeViewProvider.getInstance();
	const treeView = vscode.window.createTreeView('chat_authors', { showCollapseAll: true, treeDataProvider });
	context.subscriptions.push(treeView);
	context.subscriptions.push(treeDataProvider);

	const authorModelService = AuthorModelService.getInstance();
	authorModelService.registerHandlers();
	context.subscriptions.push(authorModelService);
}

// this method is called when your extension is deactivated
export function deactivate() { }
