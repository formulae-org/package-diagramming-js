/*
Fōrmulæ diagramming package. Module for edition.
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

Diagramming.treeExpandCollapseAction = {
	isAvailableNow: () => true,
	getDescription: () => "Expand/collapse tree",
	doAction: () => {
		Formulae.sExpression.expanded = !Formulae.sExpression.expanded;
		
		Formulae.sHandler.prepareDisplay();
		Formulae.sHandler.display();
		Formulae.setSelected(Formulae.sHandler, Formulae.sExpression, false);
	}
};

Diagramming.setEditions = function() {
	Formulae.addEdition(Diagramming.messages.pathDiagramming, null, Diagramming.messages.leafTree,   () => Expression.wrapperEdition("Diagramming.Tree"));
	Formulae.addEdition(Diagramming.messages.pathDiagramming, null, Diagramming.messages.leafToTree, () => Expression.wrapperEdition("Diagramming.ToTree"));
};

Diagramming.setActions = function() {
	Formulae.addAction("Diagramming.Tree", Diagramming.treeExpandCollapseAction);
};
