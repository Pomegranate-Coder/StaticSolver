
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

		if (i > 0 && j === 0) {

			degreesClockwiseFromRight = 90;

		}

		//UpLeft

		if (i > 0 && j < 0) {
			forceDirection = "UpLeft";
			degreesClockwiseFromRight = this.getDegreesClockwiseFromRight(forceDirection, angleFromHorizontalRad, "rad", "Horizontal");

		}

		//StraightLeft

		if (i === 0 && j < 0) {

			degreesClockwiseFromRight = 180;
		}

		//DownLeft

		if (i < 0 && j < 0) {
			forceDirection = "DownLeft";
			degreesClockwiseFromRight = this.getDegreesClockwiseFromRight(forceDirection, angleFromHorizontalRad, "rad", "Horizontal");

		}

		//StraightDown

		if (i < 0 && j === 0) {

			degreesClockwiseFromRight = 270;

		}

		//DownRight

		if (i < 0 && j > 0) {
			forceDirection = "DownRight";
			degreesClockwiseFromRight = this.getDegreesClockwiseFromRight(forceDirection, angleFromHorizontalRad, "rad", "Horizontal");
		}
		
		//StraightRight

		if (i === 0 && j > 0) {

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

		view.displayForces();


	}
}

var view = {

	prettifyDirection: function(forceDirectionInput) {
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

	setDisplayFigures: function(forceMagnitudeN, requiredForceUnit, angleInDegrees, requiredAngleUnit) {
		
		var forceToDisplay = forceMagnitudeN / (forceList.forceConversions[requiredForceUnit]);
		var angleToDisplay = angleInDegrees / (forceList.angleConversions[requiredAngleUnit]);

		return {"angleToDisplay": angleToDisplay, "forceToDisplay": forceToDisplay};
	},

	displayForces: function() {
		var forceDisplayList = document.querySelector("#force-display-list");
		forceDisplayList.innerHTML = "";
		var componentDisplayList = document.querySelector("#component-display-list");
		componentDisplayList.innerHTML = "";

		var requiredForceUnit = document.getElementById("required-force-unit").value;
		var requiredAngleUnit = document.getElementById("required-angle-unit").value;
		
		for (var x = 0; x < forceList.forces.length; x++) {
			//Display forces themselves
			var forceMagnitudeN = forceList.forces[x]["forceMagnitudeN"];
			var angleInDegrees = forceList.forces[x]["angleInDegrees"];
			var modifiedForceAngle = this.setDisplayFigures(forceMagnitudeN, requiredForceUnit, angleInDegrees, requiredAngleUnit);
			var forceToDisplay = modifiedForceAngle["forceToDisplay"];
			var angleToDisplay = modifiedForceAngle["angleToDisplay"];

			var forceDirection = view.prettifyDirection(forceList.forces[x]["forceDirection"]);
			var angleRelative = forceList.forces[x]["angleRelative"];
			var forceDisplayText = "Force " + (x + 1) + " has magnitude " + forceToDisplay.toFixed(1) + " " + this.prettifyForceUnit(requiredForceUnit) + " and acts " + forceDirection + " at " + angleToDisplay.toFixed(1) + " " + this.prettifyAngleUnit(requiredAngleUnit) + " from the " + angleRelative.toLowerCase();

			var forceToDisplay = document.createElement("li");
			forceToDisplay.className = "displayed-force";
			forceToDisplay.textContent = forceDisplayText;
			forceDisplayList.appendChild(forceToDisplay);

			//Display components

			var componentI = (forceList.forces[x]["components"])["i"];
			var componentJ = (forceList.forces[x]["components"])["j"];
			var componentsToDisplay = document.createElement("li");
			componentsToDisplay.className = "components-display-individual";
			componentsToDisplay.innerHTML = "Force " + (x + 1) + " has components <span class='component-numbers'>" + componentI.toFixed(1) + "</span> <span class='unit-vector'>i</span> and <span class='component-numbers'>" + componentJ.toFixed(1) + "</span> <span class='unit-vector'>j</span>";
			componentDisplayList.appendChild(componentsToDisplay);

		}

		console.log(forceList.calculateForceFromComponents(forceList.calculateOppositeComponents((forceList.calculateNetComponents(forceList.forces)))));
	}
}