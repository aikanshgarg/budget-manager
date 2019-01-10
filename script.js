// Using IIFE for following Module Pattern to write cleaner, well organised and encapsulated code

/*********************************************************************** BUDGET CONTROLLER - MODULE 1: for adding items  *********************************************************************/
var BudgetController = (function() {

	// fn constructor for expenses
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	// fn constructor for incomes
	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};


	var totalExpenses = 0;	
	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		}
	};


	return { // public access object, to create an item
		addItem: function(type, des, val) {
			var newItem, ID;
			
			// [1 2 3 4 5], next ID = 6
			// [1 2 4 6 8], next ID = 9
			// ID = last ID + 1

			if(data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length-1].id + 1;
			} else {
				ID = 0;
			}

			if(type === 'exp') {
				newItem = new Expense(ID, des, val);
			} else if(type === 'inc') {
				newItem = new Income(ID, des, val);
			}

			data.allItems[type].push(newItem); //  newItem object is pushed to exp/inc array, of data object, depending on 'type' provided under addItem method
			return newItem;
		},

		testing: function() {
			console.log(data);
		}
	};

})();









/****************************************************************** UI CONTROLLER - MODULE 2  **********************************************************************************************/
var UIController = (function() {

	// creating an object. having all DOM classes, to make code cleaner and organised. Later on we can change CSS class just inside this object!
	var DOMstrings = { 
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expenseContainer: '.expenses__list'
	}

	return {
		getInput: function() {
			return { // an object is returned with all 3 variables instead of returning them one by one, seperately
				type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp (from HTML <select> tag)
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: document.querySelector(DOMstrings.inputValue).value
			};
		},

		addListItem: function(obj, type) { // here, obj is ctrlAddItem() method's newItem object
			var html, newHtml, element;

			// Create HTML string with placeholder text
			if(type === 'inc') {
				element = DOMstrings.incomeContainer;

				html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if(type === 'exp') {
				element = DOMstrings.expenseContainer;	

				html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			// Replace the placeholder text with actual input data
			newHtml = html.replace('%id%', obj.ID);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);


			// Insert HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

		},

		getDOMstrings: function() { // an object containing all DOM strings/CSS classes is returned in public scope 
			return DOMstrings;
		}
	};

})();









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
	};


	// ----------------------------- main controller method telling what to do ------------------------------------------  
	var ctrlAddItem = function() { 
		var input, newItem;


		// 1. Get the filled input data
		input = UICtrl.getInput(); // UICtrl contains our UIController and has access to getInput() method as it's public

		// 2. Add the item to budget controller
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);


		// 3. Add the item to UI
		UICtrl.addListItem(newItem, input.type);


		// 4. Calculate the budget


		// 5. Display the budget

	};

	return { // a public fn which will be called outside our controllers to start the app. 
		init: function() {
			console.log('Application has started.');
			setupEventListeners();
		}
	};

})(BudgetController, UIController);



/******************************************* INITIALISATION FUNCTION ***********************************************************************************************************************/
// App initialisation fn: This is the only line of code outside our controller modules! It'll start the entire process, fire up events which will further call other fns.
Controller.init();