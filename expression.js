/*
Fōrmulæ diagramming package. Module for expression definition & visualization.
Copyright (C) 2015-2025 Laurence R. Ugalde

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

'use strict';

export class Diagramming extends Formulae.Package {}

Diagramming.horizontalTree = true;

Diagramming.Tree = class extends Expression {
	constructor() {
		super();
		this.expanded = true;
	}

	getTag() { return "Diagramming.Tree"; }
	getName() { return Diagramming.messages.nameTree; }
	canHaveChildren(count)  { return count > 0; }

	set(name, value) {
		if (name =="Expanded") {
			this.expanded = value;
			return;
		}

		super.set(name, value);
	}
	
	get(name) {
		if (name == "Expanded") return this.expanded;
		super.get(name);
	}
	
	getSerializationNames() {
		return [ "Expanded" ];
	}
	
	async getSerializationStrings() {
		return [ this.expanded ? "True" : "False" ];
	}
	
	setSerializationStrings(strings, promises) {
		if (strings[0] != "True" && strings[0] != "False") {
			throw "Invalid expansion state";
		}
		
		this.set("Expanded", strings[0] == "True");
	}
	
	prepareDisplay(context) {
		if (Diagramming.horizontalTree) {
			this.prepareDisplayHorizontal(context);
		}
		else {
			this.prepareDisplayVertical(context);
		}
	}

	prepareDisplayHorizontal(context) {
		let child = this.children[0];

		child.prepareDisplay(context);
		child.x = child.y = 10;
		
		this.width = 10 + child.width + 10;
		this.height = 10 + child.height + 10;
		
		let n = this.children.length;
		if (n > 1 && this.get("Expanded")) {
			this.height += 2 * 10;
			
			let i, w = 0;
			let maxHeight = 0;
			
			for (i = 1; i < n; ++i) {
				(child = this.children[i]).prepareDisplay(context);
				if (i > 1) w += 10;
				
				child.x = w;
				child.y = this.height;
				
				w += child.width;
				maxHeight = Math.max(maxHeight, child.height);
			}
			
			if (this.width > w) { // root is wider
				let excess = Math.round((this.width - w) / 2);
				for (i = 1; i < n; ++i) {
					this.children[i].x += excess;
				}
			}
			else { // root is thinner
				this.width = w;
				
				child = this.children[0];
				child.x = Math.round((this.width - child.width) / 2);
			}
			
			this.height += maxHeight;
		}
		
		this.horzBaseline = Math.round(this.height / 2);
		this.vertBaseline = Math.round(this.width / 2);
	}

	prepareDisplayVertical(context) {
		let child;
		(child = this.children[0]).prepareDisplay(context);
		child.x = child.y = 10;
		
		this.width = 10 + child.width + 10;
		this.height = 10 + child.height + 10;
		this.horzBaseline = 10 + child.horzBaseline; 
		
		let n = this.children.length;
		if (n > 1 && this.get("Expanded")) {
			for (let i = 1; i < n; ++i) {
				(child = this.children[i]).prepareDisplay(context);
				
				this.height += 10;
				
				child.x = 10 + 10;
				child.y = this.height;
				
				if (10 + 10 + child.width > this.width) {
					this.width = 10 + 10 + child.width;
				}
				
				this.height += child.height;
			}
		}
		
		this.vertBaseline = Math.round(this.width / 2);
	}
	
	display(context, x, y) {
		if (Diagramming.horizontalTree) {
			this.displayHorizontal(context, x, y);
		}
		else {
			this.displayVertical(context, x, y);
		}
	}

	displayHorizontal(context, x, y) {
		let child = this.children[0];
		let expanded = this.get("Expanded");
		let n = this.children.length;
		
		let xxx = this.vertBaseline;
		let yyy = 10 + child.height + 10;
		let w = child.width;
		let sx = xxx - Math.round(w / 2);
		
		if (!expanded && n > 1) {
			let bkpFillStyle = context.fillStyle;
			context.fillStyle = "orange";
			context.fillRect(x + sx - 10, y, w + (2 * 10), yyy);
			context.fillStyle = bkpFillStyle;
		}
		
		context.strokeRect(x + sx - 10, y, w + (2 * 10), yyy);
		
		child.display(context, x + child.x, y + child.y);
		
		if (!expanded) {
			return;
		}
		
		context.beginPath();

		children: for (let i = 1; i < n; ++i) {
			child = this.children[i];
			
			if (i == 1) {
				if (n == 2) {
					context.moveTo (x + xxx, y + yyy);            // preventing obfuscation
					context.lineTo (x + xxx, y + yyy + (2 * 10)); // preventing obfuscation
					break children;
				}
				
				context.moveTo (x + xxx, y + yyy);      // preventing obfuscation
				context.lineTo (x + xxx, y + yyy + 10); // preventing obfuscation
				
				if (n > 1) {
					let tmp = this.children[n - 1].x + this.children[n - 1].vertBaseline;
					context.moveTo (x + child.x + child.vertBaseline, y + yyy + 10); // preventing obfuscation
					context.lineTo (x + tmp, y + yyy + 10);                          // preventing obfuscation
				}
			}
			
			context.moveTo (x + child.x + child.vertBaseline, y + yyy + 10);       // preventing obfuscation
			context.lineTo (x + child.x + child.vertBaseline, y + yyy + (2 * 10)); // preventing obfuscation
		}

		context.stroke();

		for (let i = 1; i < n; ++i) {
			(child = this.children[i]).display(context, x + child.x, y + child.y);
		}
	}

	displayVertical(context, x, y) {
		let child = this.children[0];
		let expanded = this.get("Expanded");
		let n = this.children.length;
		
		if (!expanded && n > 1) {
			let bkpFillStyle = context.fillStyle;
			context.fillStyle = "orange";
			context.fillRect(x, y, 10 + child.width + 10, 10 + child.height + 10);
			context.fillStyle = bkpFillStyle;
		}
		
		context.strokeRect(x, y, 10 + child.width + 10, 10 + child.height + 10);
		child.display(context, x + child.x, y + child.y);
		
		if (!expanded) {
			return;
		}
		
		context.beginPath();

		for (let i = 1; i < n; ++i) {
			child = this.children[i];
			
			if (i == 1) {
				let last = this.children[n - 1];
				context.moveTo (x + 10, y + child.y - 10);               // preventing obfuscation
				context.lineTo (x + 10, y + last.y + last.horzBaseline); // preventing obfuscation
			}
			
			context.moveTo (x + 10,      y + child.y + child.horzBaseline); // preventing obfuscation
			context.lineTo (x + 10 + 10, y + child.y + child.horzBaseline); // preventing obfuscation
		}

		context.stroke();

		for (let i = 1; i < n; ++i) {
			(child = this.children[i]).display(context, x + child.x, y + child.y);
		}
	}
	
	moveAcross(index, direction) {
		return Diagramming.horizontalTree ? this.moveAcrossHorizontal(index, direction) : this.moveAcrossVertical(index, direction);
	}

	moveAcrossHorizontal(index, direction) {
		if (direction == Expression.PREVIOUS) {
			if (index > 1) {
				return this.children[index - 1].moveTo(direction);
			}
		}
		else if (direction == Expression.NEXT) {
			if (index > 0 && index < this.children.length - 1) {
				return this.children[index + 1].moveTo(direction);
			}
		}
		else if (direction == Expression.UP) {
			if (index > 0) {
				return this.children[0].moveTo(direction);
			}
		}
		else { // DOWN
			if (index == 0 && this.children.length > 1) {
				return this.children[1].moveTo(direction);
			}
		}
		
		return this.moveOut(direction);
	}

	moveAcrossVertical(index, direction) {
		if (direction == Expression.UP) {
			if (index > 0) {
				return this.children[index - 1].moveTo(direction);
			}
		}
		else if (direction == Expression.DOWN) {
			if (index < this.children.length - 1) {
				return this.children[index + 1].moveTo(direction);
			}
		}
		else if (direction == Expression.PREVIOUS) {
			if (index > 0) {
				return this.children[index - 1].moveTo(direction);
			}
		}
		else { // NEXT:
			if (index < this.children.length - 1) {
				return this.children[index + 1].moveTo(direction);
			}
		}
		
		return this.moveOut(direction);
	}
	
	moveTo(direction) {
		return Diagramming.horizontalTree ? this.moveToHorizontal(direction) : this.moveToVertical(direction);
	}

	moveToHorizontal(direction) {
		if (!this.get("Expanded")) {
			return this;
		}
		
		return this.children[0].moveTo(direction);
	}

	moveToVertical(direction) {
		if (!this.get("Expanded")) {
			return this;
		}
		
		if (direction == Expression.UP) {
			return this.children[this.children.length - 1].moveTo(direction);
		}
		else {
			return this.children[0].moveTo(direction);
		}
	}
}

Diagramming.setExpressions = function(module) {
	Formulae.setExpression(module, "Diagramming.Tree", Diagramming.Tree);
	
	Formulae.setExpression(module, "Diagramming.ToTree", {
		clazz:       Expression.Function,
		getTag:      () => "Diagramming.ToTree",
		getMnemonic: () => Diagramming.messages.mnemonicToTree,
		getName:     () => Diagramming.messages.nameToTree
	});
};

Diagramming.isConfigurable = () => true;

Diagramming.onConfiguration = () => {
	let table = document.createElement("table");
	table.classList.add("bordered");
	let row = table.insertRow();
	let th = document.createElement("th"); th.setAttribute("colspan", "2"); th.appendChild(document.createTextNode(Formulae.messages.labelTrees)); row.appendChild(th);
	row = table.insertRow();
	let col = row.insertCell();
	col.appendChild(document.createTextNode(Formulae.messages.labelTreeOrientation));
	col = row.insertCell();
	
	let radio = document.createElement("input"); radio.type = "radio"; radio.addEventListener("click", () => Diagramming.onChangeOrientationStyle(true));
	col.appendChild(radio);
	col.appendChild(document.createTextNode(Formulae.messages.labelOrientationHorizontal));
	
	col.appendChild(document.createElement("br"));
	
	radio = document.createElement("input"); radio.type = "radio"; radio.addEventListener("click", () => Diagramming.onChangeOrientationStyle(false));
	col.appendChild(radio);
	col.appendChild(document.createTextNode(Formulae.messages.labelOrientationVertical));
	
	Formulae.setModal(table);
};

Diagramming.onChangeOrientationStyle = function(horizontal) {
	Formulae.resetModal();
	
	Diagramming.horizontalTree = horizontal;
	Formulae.refreshHandlers();
};
