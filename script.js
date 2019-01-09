// making IIFE var, for following Module Pattern

// MODULE-1: for adding items
var budgetController = (function() {

	var x = 23;

	var add = function(a) {
		return x + a;
	}

	return {
		publicTest: function(b) {
			console.log(add(b));
		}
	}
	

})();


// MODULE-2: for UI
var UIController = (function() {



})();


// MODULE-3: for connecting modules 1 and 2
var constroller = (function(budgetCtrl, UICtrl) {

	var z = budgetCtrl.publicTest(5);
	
	return {
		anotherPublic: function() {
			console.log(z);
		}
	}

})(budgetController, UIController);