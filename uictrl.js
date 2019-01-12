
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
		container: '.container',
		expensesPercLabel: '.item__percentage',
		dateLabel: '.budget__title--month'
	}

	var formatNumber = function(num, type) { // format numbers for better UX
			num = Math.abs(num);
			num = num.toFixed(2);

			var numSplit = num.split('.');

			int = numSplit[0];
			dec = numSplit[1];

			// Another Number formatter
			var counter = 1;
			var new_num = '';
			 
			for (var i = int.length -1; i > -1; i-- ){
			  new_num = int[i].concat(new_num);
			  if (counter % 3 === 0 && i !== 0) {
			    new_num = ','.concat(new_num);
			  }
			  counter++;
			}
			
			return (type === 'exp' ? '-' : '+') + ' ' + new_num + '.' + dec;
		};

	// making our own forEach fn for Node List! ------------only the fns in this module can use it, as it's a private fn/method-------------------------------------------------------
	var nodeListForEach = function(list, callback) {
		for (var i = list.length - 1; i >= 0; i--) {
			callback(list[i], i);
		}
	};

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
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));


			// Insert HTML into the DOM (DOM API)
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

		},

		deleteListItem: function(selectorID) { // deleting by removing child of parent element (DOM API)
			var el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);
		},

		clearFields: function() { // clearing previously filled data from input fields: this was coded using OOPs concepts for scalability
			var fields, fieldsArray;

			fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue); // querySelectorAll returns a Node List, we use slice method to convert it into array

			fieldsArray = Array.prototype.slice.call(fields); // using slice method with call on Array object

			fieldsArray.forEach(function(current, index, array) { // forEach method accepts a callback fn and calls it for every element of array
				current.value = ""; // put empty string at current element's value
			});

			fieldsArray[0].focus(); // bring focus back on description
		},

		displayBudget: function(obj) { // display of top part of page : global/overall budget
			var type;
			obj.budget >= 0 ? type = 'inc' : type = 'exp';		
			document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
			document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');

			if(obj.percentage > 0) {
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';
			}
		},

		displayPercentages: function(percentages) { // display % labels of expenses
			var fields = document.querySelectorAll(DOMstrings.expensesPercLabel); // Node list is returned by querySelectorAll

			nodeListForEach(fields, function(current, index) {
				if(percentages[index] > 0) {
					current.textContent = percentages[index] + '%';
				} else {
					current.textContent = '---';
				}
			});
		},

		displayMonth: function() { 
			var now, year, month, months;
			now = new Date(); // today's date from Date object (year, month, day)
			year = now.getFullYear();
			months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			month = now.getMonth();
			document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
		},

		changedType: function() { // fields is again a Node List, we traverse over it using our own method we made
			var fields = document.querySelectorAll(
				DOMstrings.inputType + ',' +
				DOMstrings.inputDescription + ',' +
				DOMstrings.inputValue);

			nodeListForEach(fields, function(current) {
				current.classList.toggle('red-focus');
			});

			document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
		},

		getDOMstrings: function() { // an object containing all DOM strings/CSS classes is returned in public scope 
			return DOMstrings;
		}
	};

})();

