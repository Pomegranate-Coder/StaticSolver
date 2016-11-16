
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

	getVectors: function(forceMagnitudeInput, forceMagUnitInput, forceDirectionInput, forceDirectionNumberInput, forceDirectionUnitInput, angleRelativeInput) {
		
		var forceInNewtons = this.convertForceToNewtons(forceMagnitudeInput, forceMagUnitInput);
		var angleInDegrees = this.convertAngleToDegrees(forceDirectionNumberInput, forceDirectionUnitInput);
		var angleInRads = angleInDegrees / 180 * Math.PI;
		var directionAndRelative = forceDirectionInput + angleRelativeInput;

		switch (directionAndRelative) {
			case "UpRightHorizontal":
				return {i: Math.cos(angleInRads) * forceInNewtons, j: Math.sin(angleInRads) * forceInNewtons};
			case "UpRightVertical":
				return {i: Math.sin(angleInRads) * forceInNewtons, j: Math.cos(angleInRads) * forceInNewtons};
			case "UpLeftVertical":
				return {i: Math.sin(angleInRads) * forceInNewtons * -1, j: Math.cos(angleInRads) * forceInNewtons};
			case "UpLeftHorizontal":
				return {i: Math.cos(angleInRads) * forceInNewtons * -1, j: Math.sin(angleInRads) * forceInNewtons};
			case "DownLeftHorizontal":
				return {i: Math.cos(angleInRads) * forceInNewtons * -1, j: Math.sin(angleInRads) * forceInNewtons * -1};
			case "DownLeftVertical":
				return {i: Math.sin(angleInRads) * forceInNewtons * -1, j: Math.cos(angleInRads) * forceInNewtons * -1};
			case "DownRightVertical":
				return {i: Math.sin(angleInRads) * forceInNewtons, j: Math.cos(angleInRads) * forceInNewtons * -1};
			case "DownRightHorizontal":
				return {i: Math.cos(angleInRads) * forceInNewtons, j: Math.sin(angleInRads) * forceInNewtons * -1};
			default: console.log("Unrecognized input in getVectors");
		}
	},

	addForce: function(forceMagnitudeInput, forceMagUnitInput, forceDirectionInput, forceDirectionNumberInput, forceDirectionUnitInput, angleRelativeInput) {
		this.forces.push({
			"forceMagnitudeN": this.convertForceToNewtons(forceMagnitudeInput, forceMagUnitInput),
			"forceDirection": forceDirectionInput,
			"angleInDegrees": this.convertAngleToDegrees(forceDirectionNumberInput, forceDirectionUnitInput),
			"angleRelative": angleRelativeInput,
			"vectors": this.getVectors (forceMagnitudeInput, forceMagUnitInput, forceDirectionInput, forceDirectionNumberInput, forceDirectionUnitInput, angleRelativeInput),
			"degreesClockwiseFromRight": this.getDegreesClockwiseFromRight(forceDirectionInput, forceDirectionNumberInput, forceDirectionUnitInput, angleRelativeInput)
		});
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
	displayForces: function() {
		var forceDisplayList = document.querySelector("#force-display-list");
		forceDisplayList.innerHTML = "";

		for (var i = 0; i <= forceList.forces.length; i++) {
			
			var forceMagnitudeN = forceList.forces[i]["forceMagnitudeN"];
			var forceDirection = forceList.forces[i]["forceDirection"];
			var angleInDegrees = forceList.forces[i]["angleInDegrees"];
			var angleRelative = forceList.forces[i]["angleRelative"];
			var forceDisplayText = "Force " + i + " has magnitude " + forceMagnitudeN.toFixed(1) + " and acts " + forceDirection + " at " + angleInDegrees.toFixed(1)	+ " degrees from the " + angleRelative;

			var forceToDisplay = document.createElement("li");
			forceToDisplay.className = "displayed-force";
			forceToDisplay.textContent = forceDisplayText;
			forceDisplayList.appendChild(forceToDisplay);
		}
	}
}