import { PastebinLib } from './lib';
import * as vscode from 'vscode';
import { PastebinDataProvider } from './tree_view';

export function activate(context: vscode.ExtensionContext) {
	let storage_path = context.globalStorageUri.fsPath;

	let paste_bin_lib = new PastebinLib(storage_path);
	let pastebin_provider = new PastebinDataProvider(paste_bin_lib);

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
					if (! line.range.isEmpty)
						text = line.text + '\n';
				}
				
				paste_bin_lib.copy(i, text);
				pastebin_provider.refresh();
			}
		})

		context.subscriptions.push(disposable);
	}

	// Paste commands
	for (let i = 0; i < 10; i++) {
		const disposable = vscode.commands.registerCommand('multiple-pastebins.paste_' + i, () => {
			let editor : vscode.TextEditor | undefined = vscode.window.activeTextEditor;
			if (editor) {
				let text = paste_bin_lib.paste(i) || "";
				editor.edit( ( edit : vscode.TextEditorEdit ) => {
					edit.delete(editor.selection);
					edit.insert(editor.selection.start, text);
				});
			}
		})

		context.subscriptions.push(disposable);
	}

	vscode.window.registerTreeDataProvider(
		'pastebins',
		pastebin_provider
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
