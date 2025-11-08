import { PastebinLib } from './lib';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let storage_path = context.globalStorageUri.fsPath;
	let editor : vscode.TextEditor | undefined = vscode.window.activeTextEditor;

	let paste_bin_lib = new PastebinLib(storage_path);
	// Copy commands
	for (let i = 0; i < 10; i++) {
		const disposable = vscode.commands.registerCommand('multiple-pastebins.copy_' + i, () => {
			let editor : vscode.TextEditor | undefined = vscode.window.activeTextEditor;
			if (editor) {
				let selection : vscode.Selection = editor.selection;
				
				let text = editor.document.getText(
					selection
				);
				if ( selection.isEmpty ) {
					let line = editor.document.lineAt(selection.start);
					text = line.text + '\n';
				}
				
				paste_bin_lib.copy(i, text)
			}
		})

		context.subscriptions.push(disposable);
	}

	// Paste commands
	for (let i = 0; i < 10; i++) {
		const disposable = vscode.commands.registerCommand('multiple-pastebins.paste_' + i, () => {
			if (editor) {
				let text = paste_bin_lib.paste(i);
				editor.edit( ( edit : vscode.TextEditorEdit ) => {
					edit.delete(editor.selection);
					edit.insert(editor.selection.start, text);
				});
			}
		})

		context.subscriptions.push(disposable);
	}
}

// This method is called when your extension is deactivated
export function deactivate() {}
