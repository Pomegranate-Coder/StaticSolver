
var forceList = {
	forces: [],

	//functions
	convertForceToNewtons: function(forceMagnitudeInput, forceMagUnitInput) {
		//to be written
	},

	getDegreesClockwiseFromRight: function(forceDirectionInput, forceDirectionNumberInput, forceDirectionUnitInput) {
		//to be written
	},

	getVectorI: function(forceMagnitudeInput, forceMagUnitInput, forceDirectionInput, forceDirectionNumberInput, forceDirectionUnitInput) {
		//to be written
		//will use convertForceToNewtons first
	},

	getVectorJ: function(forceMagnitudeInput, forceMagUnitInput, forceDirectionInput, forceDirectionNumberInput, forceDirectionUnitInput) {
		//to be written
		//will use convertForceToNewtons first
	},

	addForce: function(forceMagnitudeInput, forceMagUnitInput, forceDirectionInput, forceDirectionNumberInput, forceDirectionUnitInput) {
		this.forces.push({
			forceMagnitudeN: convertForceToNewtons(forceMagnitudeInput, forceMagUnitInput),
			degreesClockwiseFromRight: getDegreesClockwiseFromRight(forceDirectionInput, forceDirectionNumberInput, forceDirectionUnitInput),
			vectorI: getVectorI (forceMagnitudeInput, forceMagUnitInput, forceDirectionInput, forceDirectionNumberInput, forceDirectionUnitInput),
			getVectorJ: getVectorJ(forceMagnitudeInput, forceMagUnitInput, forceDirectionInput, forceDirectionNumberInput, forceDirectionUnitInput)
		});
	},

}
