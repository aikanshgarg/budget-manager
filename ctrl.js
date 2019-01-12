
/******************************************* GLOBAL APP CONTROLLER - MODULE 3: for connecting modules 1 and 2  *******************************************************************************/


var Controller = (function(budgetCtrl, UICtrl) {

	// again, to keep the code clean we made a function having all the event listeners inside it
	var setupEventListeners = function() {
		var DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

		document.addEventListener('keypress', function(event) {
			if(event.key === 13 || event.which === 13) {
				ctrlAddItem();
				event.preventDefault();
			}
		});

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem); // using event bubbling here (reason: we have loads of childs & these are not present initially)

		document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
	};

	// step no 5. of ctrAddItem method
	var updateBudget = function() { // called each time a new item is added

		// 1. Calculate the budget
		budgetCtrl.calculateBudget();

		// 2. Return the budget
		var budget = budgetCtrl.getBudget();

		// 3. Display budget on the UI
		UICtrl.displayBudget(budget);
	};

	// updating percentages on label of expenses list items
	var updatePercentages = function() {

		// 1. Calculate percentages
		budgetCtrl.calculatePercentages();

		// 2. Read the percentages from budget controller (an array is returned by getPercentages)
		var percentages = budgetCtrl.getPercentages();

		// 3. Update the UI
		UICtrl.displayPercentages(percentages);
	};


	// ----------------------------- main controller method telling what to do ------------------------------------------  
	var ctrlAddItem = function() { 
		var input, newItem;

		// 1. Get the filled input data
		input = UICtrl.getInput(); // UICtrl contains our UIController and has access to getInput() method as it's public

		if(input.description !== "" && !isNaN(input.value) && input.value > 0){

			// 2. Add the item to budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			// 3. Add the item to UI
			UICtrl.addListItem(newItem, input.type);

			// 4. Clear the fields
			UICtrl.clearFields();

			// 5. Calculate and update budget
			updateBudget();

			// 6. Calculate & Update percentages
			updatePercentages();
		}
	};

	var ctrlDeleteItem = function(event) { // we'll click the 'close-icon' which will delete entire content from the UI, upto 4 parents

		var itemID, splitID, type, ID;
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; // target the element to be attached with event and DOM traversing to reach parent class of items
		if(itemID) {
			// var s = 'inc-1'
			// s.split('-') gives an array ['inc', '1']

			//inc-1
			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);

			// 1. delete the item from the DS
			budgetCtrl.deleteItem(type, ID);

			// 2. delete item from UI
			UICtrl.deleteListItem(itemID);

			// 3. update and show new budget
			updateBudget();

			// 4. Calculate & Update percentages
			updatePercentages();
		}
	};

	return { // a public fn which will be called outside our controllers to start the app. 
		init: function() {
			console.log('Application has started.');
			UICtrl.displayMonth();
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: 0

			});
			setupEventListeners();
		}
	};

})(BudgetController, UIController);



/******************************************* INITIALISATION FUNCTION ***********************************************************************************************************************/
// App initialisation fn: This is the only line of code outside our controller modules! It'll start the entire process, fire up events which will further call other fns.
Controller.init();