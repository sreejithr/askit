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

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

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
		panel.webview.html = webViewContent;
	});

	context.subscriptions.push(disposable);

	const treeView = vscode.window.createTreeView('chat_authors', { showCollapseAll: true, treeDataProvider: AuthorTreeViewProvider.getInstance() });
	context.subscriptions.push(treeView);

	AuthorModelService.getInstance().registerHandlers();
}

// this method is called when your extension is deactivated
export function deactivate() { }
