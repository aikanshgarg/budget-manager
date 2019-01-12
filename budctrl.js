

// Using IIFE for following Module Pattern to write cleaner, well organised and encapsulated code


/*********************************************************************** BUDGET CONTROLLER - MODULE 1: for adding items  *********************************************************************/

var BudgetController = (function() {

	// fn constructor for expenses
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1; // to signify not defined
	};

	// adding a method to Expense object using prototype chain
	Expense.prototype.calcPercentage = function(totalIncome) {

		if(totalIncome > 0) {
			this.percentage = Math.round((this.value / totalIncome) * 100);	
		} else {
			this.percentage = -1;
		}
	};

	Expense.prototype.getPercentage = function() {
		return this.percentage;
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

		deleteItem: function(type, id) { // type will be either exp/inc to tell which array the item belongs to 

			var ids, index;

			// let's say id = 6
			// then we want, ids = [1 2 3 4 6 8]
			// index = 3
			// data.allItems[type][id]: this won't work as all id's are not in order always

			// loop over all elements in inc or exp array and return new array with current ID's, using map 
			ids = data.allItems[type].map(function(current) {
				return current.id;
			});

			index = ids.indexOf(id);

			if(index !== -1) { // splice method takes first argument as index from which deletion begins and second argument is no. of items to be deleted
				data.allItems[type].splice(index, 1);
			}

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

		calculatePercentages: function() {
			data.allItems.exp.forEach(function(current) { // callback fn of forEach method calulating percentages for each element fo exp array
				current.calcPercentage(data.totals.inc);
			});
		},

		getPercentages: function() {
			var percs;
			percs = data.allItems.exp.map(function(current) {// callback fn of map method calulating & returning an array containing percentages, for each element fo exp array
				return current.getPercentage();	
			});	
			return percs;
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
