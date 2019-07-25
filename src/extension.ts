// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import webViewContent from "./getWebView";
import { AuthorTreeViewProvider } from './explorer/authorTreeViewProvider';
import { AuthorModelService } from './authorModel/authorModelService';
import { AuthorData } from './explorer/types';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "askit" is now active!');

	vscode.commands.executeCommand('setContext', 'askItExtensionActivated', true).then(() => { });

	let disposable = vscode.commands.registerCommand('askIt.chat', async (authorData: AuthorData | undefined) => {
		/**
		 * List of authors for which chat is to be opened. Could be just one author or multiple.
		 */
		let selectedAuthors: AuthorData[] = [];
		if (authorData) {
			// If `authorData` is provided, we only intend to open chat for this particular author.
			selectedAuthors.push(authorData);
		} else {
			// Chat with authors of the selected code, i.e opening group chat
			const authorNodes = await AuthorTreeViewProvider.getInstance().getChildren();
			selectedAuthors = authorNodes.filter(author => author.status === true);
		}
		const selectedUpns = selectedAuthors.map((selectedAuthor) => {
			return selectedAuthor.email;
		})
		const selectedText = AuthorModelService.getInstance().selectedText;
		const linkToSelectedText = AuthorModelService.getInstance().linkToSelectedText;
		const user: AuthorData = {
			name: AuthorModelService.getInstance().userName,
			email: AuthorModelService.getInstance().userEmail
		};
		selectedUpns.unshift(user.email);
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
		panel.webview.html = webViewContent(JSON.stringify(selectedUpns));
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
