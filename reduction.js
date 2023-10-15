/*
Fōrmulæ diagramming package. Module for reduction.
Copyright (C) 2015-2023 Laurence R. Ugalde

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

Diagramming.toTree = toTree => {
	let tree = Formulae.createExpression("Diagramming.Tree");
	
	let n = toTree.children.length;
	if (n == 0) {
		tree.addChild(toTree.clone());
	}
	else {
		let stringExpression = Formulae.createExpression("String.String");
		stringExpression.set("Value", toTree.getTag());
		tree.addChild(stringExpression);
		
		for (let i = 0; i < n; ++i) {
			tree.addChild(Diagramming.toTree(toTree.children[i]));
		}
	}
	
	return tree;
};

Diagramming.toTreeReducer = async (toTree, session) => {
	toTree.replaceBy(Diagramming.toTree(toTree.children[0]));
	return true;
};

Diagramming.setReducers = () => {
	ReductionManager.addReducer("Diagramming.ToTree", Diagramming.toTreeReducer, "Diagramming.toTreeReducer");
};
