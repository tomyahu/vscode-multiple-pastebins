import fs from 'fs';

export type Bin = {
	id: number;
	content: string;
	empty: boolean;
}


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

	refresh() {
		this.storage_dict = JSON.parse(
			fs.readFileSync(this.storage_path).toString()
		);
	}

	copy(id : number, content : string) {
		this.storage_dict["pb_" + id] = content;
		fs.writeFileSync(this.storage_path, JSON.stringify(this.storage_dict));
	}

	paste(id : number) : string | undefined {
		this.refresh();
		return this.storage_dict["pb_" + id];
	}

	getBinList() : Bin[] {
		let result : Bin[] = [];
		for (let i = 1; i < 10; i++) {
			let text : string = this.paste(i) || "";
			let empty : boolean = text == "";

			result.push(
				{
					id: i,
					content: text,
					empty: empty 
				}
			)
		}
		let text : string = this.paste(0) || "";
		let empty : boolean = text == "";

		result.push(
			{
				id: 0,
				content: text,
				empty: empty 
			}
		)

		return result;
	}
}