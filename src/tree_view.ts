import * as vscode from 'vscode';
import { Bin, PastebinLib } from './lib';


export class PastebinDataProvider implements vscode.TreeDataProvider<Pastebin> {
	private _onDidChangeTreeData: vscode.EventEmitter<Pastebin | undefined | null | void> = new vscode.EventEmitter<Pastebin | undefined | null | void>();
	readonly onDidChangeTreeData: vscode.Event<Pastebin | undefined | null | void> = this._onDidChangeTreeData.event;

	constructor(private pastebin_lib : PastebinLib) {}

	refresh() : void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: Pastebin) : vscode.TreeItem {
		return element;
	}

	getChildren(element?: Pastebin) : Thenable<Pastebin[]> {
		if( ! element ) {
			return Promise.resolve(
				this.getPastebins()
			);
		}

		return Promise.resolve([]);
	}

	getPastebins() : Pastebin[] {
		let bin_strings = this.pastebin_lib.getBinList();
		let result = [];
		for (let i = 0; i < bin_strings.length; i++) {
			result.push(
				new Pastebin(bin_strings[i], vscode.TreeItemCollapsibleState.None)
			)
		}
		return result;
	}
}


class Pastebin extends vscode.TreeItem {
	constructor(
		public readonly bin: Bin,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState
	) {
		let label = `${bin.id}. ${bin.content}`;
		super(label, collapsibleState);

		let description = "Empty Pastebin";
		if (! bin.empty)
			description = "$";
		this.description = description;
	}
}