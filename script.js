
var forceList = {
	forces: [],

	//utilities

	forceConversions: { //how many Newtons in each unit?
		"N": 1,
		"lbf": 4.4482216152605,
		"dyn": 0.00001,
		"pdl": 0.138254954376

	},

	angleConversions: {
		"deg": 1,
		"rad": (180 / Math.PI),
		"grad": 0.9
	},

	//functions
	convertForceToNewtons: function(forceMagnitudeInput, forceMagUnitInput) {
		return forceMagnitudeInput * this.forceConversions[forceMagUnitInput];
	},

	convertAngleToDegrees: function(forceDirectionNumberInput, forceDirectionUnitInput) {
		return forceDirectionNumberInput * this.angleConversions[forceDirectionUnitInput];
	},

	giveQuadrantAndAngleToInput: function(forceDirectionInput, forceDirectionNumberInput, forceDirectionUnitInput, angleRelativeInput) {
		if ((forceDirectionInput === "UpRight") || (forceDirectionInput === "UpLeft") || (forceDirectionInput === "DownLeft") || (forceDirectionInput === "DownRight")) {
			return {"forceDirectionInput": forceDirectionInput, "forceDirectionNumberInput": forceDirectionNumberInput, "forceDirectionUnitInput": forceDirectionUnitInput, "angleRelativeInput": angleRelativeInput}
		}

		switch (forceDirectionInput) {
			case "StraightUp":
				return {"forceDirectionInput": "UpRight", "forceDirectionNumberInput": 0, "forceDirectionUnitInput": "deg", "angleRelativeInput": "Vertical"};
			case "StraightLeft":
				return {"forceDirectionInput": "UpLeft", "forceDirectionNumberInput": 0, "forceDirectionUnitInput": "deg", "angleRelativeInput": "Horizontal"};
			case "StraightDown":
				return {"forceDirectionInput": "DownLeft", "forceDirectionNumberInput": 0, "forceDirectionUnitInput": "deg", "angleRelativeInput": "Vertical"};
			case "StraightRight":
				return {"forceDirectionInput": "DownRight", "forceDirectionNumberInput": 0, "forceDirectionUnitInput": "deg", "angleRelativeInput": "Horizontal"};
		} 
	},

	getDegreesClockwiseFromRight: function(forceDirectionInput, forceDirectionNumberInput, forceDirectionUnitInput, angleRelativeInput) {

		var directionAndRelative = forceDirectionInput + angleRelativeInput;
		var angleInDegrees = this.convertAngleToDegrees(forceDirectionNumberInput, forceDirectionUnitInput);

		switch (directionAndRelative) {

			case "UpRightHorizontal":
				return angleInDegrees;
			case "UpRightVertical":
				return 90 - angleInDegrees;
			case "UpLeftVertical":
				return 90 + angleInDegrees;
			case "UpLeftHorizontal":
				return 180 - angleInDegrees;
			case "DownLeftHorizontal":
				return 180 + angleInDegrees;
			case "DownLeftVertical":
				return 270 - angleInDegrees;
			case "DownRightVertical":
				return 270 + angleInDegrees;
			case "DownRightHorizontal":
				return 360 - angleInDegrees;
			default: console.log("Unrecognized input in getDegreesClockwiseFromRight");
		}
	},

	getComponents: function(forceMagnitudeInput, forceMagUnitInput, forceDirectionInput, forceDirectionNumberInput, forceDirectionUnitInput, angleRelativeInput) {
		
		var forceInNewtons = this.convertForceToNewtons(forceMagnitudeInput, forceMagUnitInput);
		var angleInDegrees = this.convertAngleToDegrees(forceDirectionNumberInput, forceDirectionUnitInput);
		var angleInRads;

		if (forceDirectionUnitInput === "rad") { 
			angleInRads = forceDirectionNumberInput;
		}
		else { 
			angleInRads = angleInDegrees / 180 * Math.PI;
		}

		var directionAndRelative = forceDirectionInput + angleRelativeInput;

		switch (directionAndRelative) {
			case "UpRightHorizontal":
				return {"i": Math.cos(angleInRads) * forceInNewtons, "j": Math.sin(angleInRads) * forceInNewtons};
			case "UpRightVertical":
				return {"i": Math.sin(angleInRads) * forceInNewtons, "j": Math.cos(angleInRads) * forceInNewtons};
			case "UpLeftVertical":
				return {"i": Math.sin(angleInRads) * forceInNewtons * -1, "j": Math.cos(angleInRads) * forceInNewtons};
			case "UpLeftHorizontal":
				return {"i": Math.cos(angleInRads) * forceInNewtons * -1, "j": Math.sin(angleInRads) * forceInNewtons};
			case "DownLeftHorizontal":
				return {"i": Math.cos(angleInRads) * forceInNewtons * -1, "j": Math.sin(angleInRads) * forceInNewtons * -1};
			case "DownLeftVertical":
				return {"i": Math.sin(angleInRads) * forceInNewtons * -1, "j": Math.cos(angleInRads) * forceInNewtons * -1};
			case "DownRightVertical":
				return {"i": Math.sin(angleInRads) * forceInNewtons, "j": Math.cos(angleInRads) * forceInNewtons * -1};
			case "DownRightHorizontal":
				return {"i": Math.cos(angleInRads) * forceInNewtons, "j": Math.sin(angleInRads) * forceInNewtons * -1};
			default: console.log("Unrecognized input in getComponents");
		}
	},

	addForce: function(forceMagnitudeInput, forceMagUnitInput, forceDirectionInput, forceDirectionNumberInput, forceDirectionUnitInput, angleRelativeInput) {

		var quadrantedAngles = this.giveQuadrantAndAngleToInput(forceDirectionInput, forceDirectionNumberInput, forceDirectionUnitInput, angleRelativeInput);

		forceDirectionInput = quadrantedAngles["forceDirectionInput"];
		forceDirectionNumberInput = quadrantedAngles["forceDirectionNumberInput"];
		forceDirectionUnitInput = quadrantedAngles["forceDirectionUnitInput"];
		angleRelativeInput = quadrantedAngles["angleRelativeInput"];


		this.forces.push({
			"forceMagnitudeN": this.convertForceToNewtons(forceMagnitudeInput, forceMagUnitInput),
			"forceDirection": forceDirectionInput,
			"angleInDegrees": this.convertAngleToDegrees(forceDirectionNumberInput, forceDirectionUnitInput),
			"angleRelative": angleRelativeInput,
			"components": this.getComponents (forceMagnitudeInput, forceMagUnitInput, forceDirectionInput, forceDirectionNumberInput, forceDirectionUnitInput, angleRelativeInput),
			"degreesClockwiseFromRight": this.getDegreesClockwiseFromRight(forceDirectionInput, forceDirectionNumberInput, forceDirectionUnitInput, angleRelativeInput)
		});
	},

	calculateNetComponents: function(forces) {
		var netI = 0; 
		var netJ = 0;

		for (var x = forces.length - 1; x >= 0; x--) {
			netI += (forces[x]["components"])["i"];
			netJ += (forces[x]["components"])["j"];
		}

		return {"i": netI, "j": netJ};
	},

	calculateOppositeComponents: function(components) {
		return {
			"i": components["i"] * -1, 
			"j": components["j"] * -1
		}
	},

	calculateForceFromComponents: function(components) {
		var i = components["i"];
		var j = components["j"];

		var forceMagnitudeN = Math.sqrt((i * i) + (j * j));
		var angleFromHorizontalRad = Math.acos( Math.abs(i) / forceMagnitudeN);
		var angleFromHorizontalDeg = this.convertAngleToDegrees(angleFromHorizontalRad, "rad");
		var degreesClockwiseFromRight;
		var forceDirection;

		//UpRight

		if (i > 0 && j > 0) {
			forceDirection = "UpRight";
			degreesClockwiseFromRight = this.getDegreesClockwiseFromRight(forceDirection, angleFromHorizontalRad, "rad", "Horizontal");
		}

		//StraightUp

		if (i === 0 && j > 0) {

			degreesClockwiseFromRight = 90;

		}

		//UpLeft

		if (i < 0 && j > 0) {
			forceDirection = "UpLeft";
			degreesClockwiseFromRight = this.getDegreesClockwiseFromRight(forceDirection, angleFromHorizontalRad, "rad", "Horizontal");

		}

		//StraightLeft

		if (i < 0 && j === 0) {

			degreesClockwiseFromRight = 180;
		}

		//DownLeft

		if (i < 0 && j < 0) {
			forceDirection = "DownLeft";
			degreesClockwiseFromRight = this.getDegreesClockwiseFromRight(forceDirection, angleFromHorizontalRad, "rad", "Horizontal");

		}

		//StraightDown

		if (i === 0 && j < 0) {

			degreesClockwiseFromRight = 270;

		}

		//DownRight

		if (i > 0 && j < 0) {
			forceDirection = "DownRight";
			degreesClockwiseFromRight = this.getDegreesClockwiseFromRight(forceDirection, angleFromHorizontalRad, "rad", "Horizontal");
		}
		
		//StraightRight

		if (i > 0 && j === 0) {

			degreesClockwiseFromRight = 0;

		}

		return {
			"forceMagnitudeN": forceMagnitudeN,
			"forceDirection": forceDirection,
			"angleInDegrees": angleFromHorizontalDeg,
			"angleRelative": "Horizontal",
			"components": components,
			"degreesClockwiseFromRight": degreesClockwiseFromRight
		}

	},
	
}

var acceleration = {

	massConversions: {
		"kg": 1,
		"gram": 1000,
		"lb": 0.45359237,
		"stone": 6.35029,
		"ounce": 0.0283495
	},

	distanceConversions: {
		"metres": 1,
		"inches": 0.0254,
		"feet": 0.3048,
		"yards": 0.9144,
		"kilometres": 1000,
		"miles": 1609.34

	},

	timeConversions: {
		"second": 1,
		"minute": 60,
		"hour": 3600,
	},

	convertMassToKg(massMag, massUnit) {
		var massInKg = massMag * this.massConversions[massUnit];
		return massInKg;
	},

	calculateAccelerationMetresPerSecondSq(force, massInKg) {
		var accelerationInMetresPerSecondSq = force["forceMagnitudeN"] / massInKg;
		return accelerationInMetresPerSecondSq;
	},

	setAccelerationFigures(accelerationInMetresPerSecondSq, requiredDistanceUnit, requiredFirstTimeUnit, requiredSecondTimeUnit) {
		var requiredAcceleration = accelerationInMetresPerSecondSq / this.distanceConversions[requiredDistanceUnit] * this.timeConversions[requiredFirstTimeUnit] * this.timeConversions[requiredSecondTimeUnit];
		return requiredAcceleration;
	}

}


//DOM manipulation

var handlers = {

	addForce: function() {
		var forceMagnitudeInput = document.getElementById("force-magnitude-input").value;
		var forceMagUnitInput = document.getElementById("force-mag-unit-input").value;
		var forceDirectionInput = document.getElementById("force-direction-input").value;
		var forceDirectionNumberInput = document.getElementById("force-direction-number-input").value;
		var forceDirectionUnitInput = document.getElementById("force-direction-unit-input").value;
		var angleRelativeInput = document.getElementById("angle-relative-input").value;

		forceList.addForce(forceMagnitudeInput, forceMagUnitInput, forceDirectionInput, forceDirectionNumberInput, forceDirectionUnitInput, angleRelativeInput);

		view.displayEverything();


	},

	deleteForce: function(forceNumber) {
		forceList.forces.splice(forceNumber, 1);
		view.displayEverything();
	}
}

var view = {

	prettifyDirection: function(forceDirectionInput, components) {

		if (components["i"] === 0) {
			if (components["j"] < 0) {
				return "straight down";
			}
			else {
				return "straight up";
			}
		} else if (components["j"] === 0 ) {
			if (components["i"] < 0) {
				return "straight to the left";
			} else {
				return "straight to the right";
			}
		} else {

			switch(forceDirectionInput) {
				case "UpRight":
					return "up and to the right";
				case "UpLeft":
					return "up and to the left";
				case "DownLeft":
					return "down and to the left";
				case "DownRight":
					return "down and to the right";
			}
		}

	},

	prettifyAngleUnit: function(angleUnit) {
		switch(angleUnit) {
			case "deg": 
				return "degrees";
			case "rad": 
				return "radians";
			case "grad": 
				return "gradians";
		}
	},

	prettifyForceUnit: function(forceUnit) {
		switch(forceUnit) {
			case"N": 
				return "newtons";
			case "lbf":
				return "units of pound-force";
			case "dyn":
				return "dynes";
			case "pdl":
				return "poundals";
		}
	},


	setForceFigures: function(forceMagnitudeN, requiredForceUnit)  {
		
		var forceToDisplay = forceMagnitudeN / (forceList.forceConversions[requiredForceUnit]);
		return forceToDisplay;
	},

	setAngleFigures: function(angleInDegrees, requiredAngleUnit) {
		var angleToDisplay = angleInDegrees / (forceList.angleConversions[requiredAngleUnit]);
		return angleToDisplay;
	},

	generateAngleDescription: function(force, requiredAngleUnit) {

		var angleInDegrees = force["angleInDegrees"];
		var angleRelative = force["angleRelative"];
		var forceDirection = force["forceDirection"];
		var components = force["components"];

		var angleToDisplay = this.setAngleFigures(angleInDegrees, requiredAngleUnit);
		var prettifiedDirection = this.prettifyDirection(forceDirection, components);

		//using prettifiedDirection because it's already deconverting vertical/horizontal 
		if (prettifiedDirection === "straight to the right" || prettifiedDirection === "straight up" || prettifiedDirection === "straight to the left" || prettifiedDirection === "straight down") {
			return "";
		} else {		
			return " at " + angleToDisplay.toFixed(1) + " " + this.prettifyAngleUnit(requiredAngleUnit) + " from the " + angleRelative.toLowerCase();}
	},

	generateForceDisplayText: function(forceToTextify, forceName) {
			var requiredForceUnit = document.getElementById("required-force-unit").value;
			var requiredAngleUnit = document.getElementById("required-angle-unit").value;

			var forceMagnitudeN = forceToTextify["forceMagnitudeN"];
			var forceDirection = forceToTextify["forceDirection"];
			var components = forceToTextify["components"];
			var forceDirectionToDisplay = this.prettifyDirection(forceDirection, components);
			var forceToDisplay = this.setForceFigures(forceMagnitudeN, requiredForceUnit);
			
			var angleDescription = this.generateAngleDescription(forceToTextify, requiredAngleUnit);
			
			var forceDisplayText = forceName + " has magnitude " + forceToDisplay.toFixed(1) + " " + this.prettifyForceUnit(requiredForceUnit) + " and acts " + forceDirectionToDisplay + angleDescription;

			return forceDisplayText;

	},

	createDeleteButton: function() {
		var deleteButton = document.createElement("button");
		deleteButton.textContent = "X";
		deleteButton.className = "delete-button";
		return deleteButton;
	},

	displayForces: function() {
		var forceDisplayList = document.querySelector("#force-display-list");
		forceDisplayList.innerHTML = "";
		
		for (var x = 0; x < forceList.forces.length; x++) {
			//Display forces themselves
			var forceName = "Force " + (x+1);
			var forceDisplayText = this.generateForceDisplayText(forceList.forces[x], forceName);

			var forceToDisplay = document.createElement("li");

			forceToDisplay.id = x;
			forceToDisplay.className = "displayed-force";
			forceToDisplay.textContent = forceDisplayText;
			forceToDisplay.appendChild(this.createDeleteButton());
			forceDisplayList.appendChild(forceToDisplay);

		}

		
	},

		displayOpposite: function() {
		var oppositeForce = forceList.calculateForceFromComponents(forceList.calculateOppositeComponents((forceList.calculateNetComponents(forceList.forces))));
		var forceDisplayText = this.generateForceDisplayText(oppositeForce, "The force required to put the partice in equilibrium");

		var oppositeDisplayPlace = document.getElementById("opposite-display-place");
		oppositeDisplayPlace.innerHTML = "";
		if (forceList.forces.length > 0 ) {
		var forceToDisplay = document.createElement("p");
		forceToDisplay.className = "opposing-force";
		forceToDisplay.textContent = forceDisplayText;
		oppositeDisplayPlace.appendChild(forceToDisplay);

		}
	},

	displayComponents: function() {

		var requiredForceUnit = document.getElementById("required-force-unit").value;
		var componentDisplayList = document.querySelector("#component-display-list");
		componentDisplayList.innerHTML = "";

		for (var x = 0; x < forceList.forces.length; x++) {
			var components = forceList.forces[x]["components"];
			var componentI = this.setForceFigures(components["i"], requiredForceUnit);
			var componentJ = this.setForceFigures(components["j"], requiredForceUnit);
			var componentsToDisplay = document.createElement("li");
			componentsToDisplay.className = "components-display-individual";
			componentsToDisplay.innerHTML = "Force " + (x + 1) + " has components <span class='component-numbers'>" + componentI.toFixed(1) + "</span> <span class='unit-vector'>i</span> and <span class='component-numbers'>" + componentJ.toFixed(1) + "</span> <span class='unit-vector'>j</span>";
			componentDisplayList.appendChild(componentsToDisplay);

		}

	},

	displayAcceleration: function() {
		var netForce = forceList.calculateForceFromComponents(forceList.calculateNetComponents(forceList.forces));
		var accelerationDisplayPlace = document.getElementById("acceleration-display-place");

		var requiredDistanceUnit = document.getElementById("required-distance").value;
		var requiredTimeUnitOne = document.getElementById("required-time-one").value;
		var requiredTimeUnitTwo = document.getElementById("required-time-two").value;
		var massInputNumber = document.getElementById("mass-input-number").value;
		var massInputUnit = document.getElementById("mass-input-unit").value;
		var requiredAngleUnit = document.getElementById("required-angle-unit").value;
		accelerationDisplayPlace.innerHTML = "";
		
		if (forceList.forces.length > 0 ) {
		var accelerationInMetresPerSecondSq = acceleration.calculateAccelerationMetresPerSecondSq(netForce, acceleration.convertMassToKg(massInputNumber, massInputUnit));
		var accelerationMagToDisplay = acceleration.setAccelerationFigures(accelerationInMetresPerSecondSq, requiredDistanceUnit, requiredTimeUnitOne, requiredTimeUnitTwo);
		var angleDescription = this.generateAngleDescription(netForce, requiredAngleUnit);
		var accelerationDirectionToDisplay = this.prettifyDirection(netForce["forceDirection"], netForce["components"]);

		var accelerationDisplayText = "The acceleration of the particle has magnitude " + accelerationMagToDisplay.toFixed(1) + " " + requiredDistanceUnit + " per " + requiredTimeUnitOne + " per " + requiredTimeUnitTwo + " and accelerates " + accelerationDirectionToDisplay + angleDescription;

				var accelerationToDisplay = document.createElement("p");
				accelerationToDisplay.className = "opposing-force";
				accelerationToDisplay.textContent = accelerationDisplayText;
				accelerationDisplayPlace.appendChild(accelerationToDisplay);
		}
	},

	displayEverything: function() {
		this.displayForces();
		this.displayOpposite();
		this.displayComponents();
		this.displayAcceleration();
	}

}

document.addEventListener("DOMContentLoaded", function(event) { 

var forceDisp = document.querySelector("#force-display-list");

forceDisp.addEventListener("click", function(event) {

	var elementClicked = event.target;
	if (elementClicked.className === "delete-button") {
		handlers.deleteForce(event.target.parentNode.id);
	}
});


});