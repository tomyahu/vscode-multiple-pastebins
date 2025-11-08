import fs from 'fs';
import * as vscode from 'vscode';


export class PastebinLib {
	storage_path : string;
	storage_dict;

	constructor(storage_path : string) {
		this.storage_path = storage_path;
		if( ! fs.existsSync(this.storage_path) )
			fs.writeFileSync(storage_path, '{}');

		this.storage_dict = JSON.parse(
			fs.readFileSync(storage_path).toString()
		);
	}

	copy(id : number, content : string) {
		this.storage_dict["pb_" + id] = content
		fs.writeFileSync(this.storage_path, JSON.stringify(this.storage_dict));
	}

	paste(id : number) : string {
		return this.storage_dict["pb_" + id]
	}
}