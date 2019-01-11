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

	// making a private fn to loop over either inc or exp array and find total
	var calculateTotal = function(type) {
		var sum = 0;
		data.allItems[type].forEach(function(current) {
			sum += current.value;
		});
		data.totals[type] = sum;
	};


	// making a data structure for storing input values 	
	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1 // setting as -1 to signify non-existent
	};


	return { // public access object

		// adds items to our data structure
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

		// calculates overall budget
		calculateBudget: function() {
			// calculate total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');

			// calculate total budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp;

			// calculate the percentage of income that we spent
			if(data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
		},

		// simply returns the OVERALL budget (top part of page), making a separate fn to do this: specific tasks to fns 
		getBudget: function() {
			return { // making an object to return 4 values
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			};
		},

		testing: function() {
			console.log(data);
		}
	};

})();










































/****************************************************************** UI CONTROLLER - MODULE 2  **********************************************************************************************/
var UIController = (function() {

	// creating an object having all DOM classes, to make code cleaner and organised. Later on we can change CSS class just inside this object!
	var DOMstrings = { 
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expenseContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expenseLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container'
	}

	return {
		getInput: function() {
			return { // an object is returned with all 3 variables instead of returning them one by one, seperately

				type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp (from HTML <select> tag)
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value) // we convert string value to decimal number
			};
		},

		addListItem: function(obj, type) { // here, obj is ctrlAddItem() method's newItem object (GLOBAL APP CONTROLLER)
			var html, newHtml, element;

			// Create HTML string with placeholder text
			if(type === 'inc') {
				element = DOMstrings.incomeContainer;

				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if(type === 'exp') {
				element = DOMstrings.expenseContainer;	

				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			// Replace the placeholder text with actual input data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);


			// Insert HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

		},

		clearFields: function() { // clearing previously filled data from input fields: this was coded using OOPs concepts for scalability
			var fields, fieldsArray;

			fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue); // querySelectorAll returns a Node List, we use slice method to convert it into array

			fieldsArray = Array.prototype.slice.call(fields); // using call on Array object

			fieldsArray.forEach(function(current, index, array) { // forEach method accepts a callback fn and calls it for every element of array
				current.value = ""; // put empty string at current element's value
			});

			fieldsArray[0].focus(); // bring focus back on description
		},

		displayBudget: function(obj) {
			document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
			document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
			document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;

			if(obj.percentage > 0) {
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';
			}
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

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem); // using event bubbling here (reason: we have loads of childs & these are not present initially)
	};

	// step no 5. of ctrAddItem method
	var updateBudget = function() { // called each time a new item is added

		// 1. Calculate the budget
		budgetCtrl.calculateBudget();

		// 2. Return the budget
		var budget = budgetCtrl.getBudget();

		// 3. Display budget on the UI
		UICtrl.displayBudget(budget);
	}


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
		}
	};

	var ctrlDeleteItem = function(event) { // we'll click the 'close-icon' which will delete entire content from the UI, upto 4 parents

		var itemID, splitID, type, ID;
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; // target the element to be attached with event and DOM traversing to reach parent class of items
		if(itemID) {
			// var s = 'inc-1'
			// s.split('-') gives an array ['inc', '-1']

			//inc-1
			splitID = itemID.split('-');
			type = splitID[0];
			ID = splitID[1];

			// 1. delete the item from the DS


			// 2. delete item from UI


			// 3. update and show new budget
		}
	};

	return { // a public fn which will be called outside our controllers to start the app. 
		init: function() {
			console.log('Application has started.');
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