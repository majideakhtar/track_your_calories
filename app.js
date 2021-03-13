//Storage Controller

const StorageCtrl = (function(){

	//Public methods
	return{
		storeItem: function(item){
			let items;

			//check if any item in LS
			if(localStorage.getItem('items') === null){
				items = [];
				items.push(item);

				// set in LS
				localStorage.setItem('items', JSON.stringify(items));

			} else{
				items = JSON.parse(localStorage.getItem('items'));

				//push new item
				items.push(item);

				//reset local storage
				localStorage.setItem('items', JSON.stringify(items));
			}
		},

		//get items from storage
		getItemsFromStorage: function(){
			let items;
			if(localStorage.getItem('items') === null){
				items = [];
			}else {
				items = JSON.parse(localStorage.getItem('items'));
			}
			return items;
		},

		//Update Item Storage
		updateItemStorage: function(updatedItem){
			let items = JSON.parse(localStorage.getItem('items'));
			items.forEach(function(item, index){
				if(updatedItem.id === item.id){
					items.splice(index,1,updatedItem);
				}
			});
			//reset local storage
			localStorage.setItem('items', JSON.stringify(items));
		},
		deleteItemFromStorage: function(id){
			let items = JSON.parse(localStorage.getItem('items'));
			items.forEach(function(item, index){
				if(id === item.id){
					items.splice(index,1);
				}
			});
			//reset local storage
			localStorage.setItem('items', JSON.stringify(items));
		},
		clearItemsFromStorage: function(){
			localStorage.removeItem('items');
		}
	}
})();

//Item Controller
const ItemCtrl = (function(){
	//Item Constructor
	const Item = function(id, name, calories){
		this.id = id;
		this.name = name;
		this.calories = calories;
	}


	//Data Structure
	const data = {
		// items: [
		// 	// {id:0, name: "Steak dinner", calories: 1200},
		// 	// {id:1, name: "Eggs", calories: 400},
		// 	// {id:2, name: "Cookies", calories: 250}
		// ],
		items: StorageCtrl.getItemsFromStorage(),
		currentItem:  null,
		totalCalories: 0
	}

	//public methods
	return {

		getItems: function(){
			return data.items;
		},
		addItem: function(name, calories){
			//Create ID

			let ID;
			if(data.items.length>0){
				ID = data.items[data.items.length - 1].id + 1;
			}else{
				ID = 0;
			}
			calories = parseInt(calories);

			//Create new item
			newItem = new Item(ID,name,calories);
			data.items.push(newItem);
			return newItem;
		},
		updateItem: function(name, calories){
			let found = null;
			calories = parseInt(calories);
			// data.currentItem.name = name;
			// data.currentItem.calories = parseInt(calories);
			data.items.forEach(function(item){
				if(item.id === data.currentItem.id){
					item.name = name;
					item.calories = calories;
					found = item;
				}
			});
			return found;
		},
		getItemById: function(id){
			let found = null;
			data.items.forEach(function(item){
				if(item.id === id){
					found = item;
				}
			})
			return found;
		},
		setCurrentItem: function(item){
			data.currentItem = item;
		},
		getCurrentItem: function(){
			return data.currentItem;
		},
		getTotalCalories: function () {
			let totalCalories=0;
			data.items.forEach(function(item){
				totalCalories += parseInt(item.calories);
			});

			// set total calories in DS
			data.totalCalories = totalCalories;
			return data.totalCalories;
		},
		deleteItem: function(id){

			const ids = data.items.map(function(item){
				return item.id;
			});
			const index = ids.indexOf(id);
			data.items.splice(index,1);
		},

		clearAllItems: function(){
			data.items = [];
		},

		logData: function() {
			return data;
		}
	}

})();

//UI Controller
const UICtrl = (function(){

	//UI Selectors
	const UISelectors = {
		itemList: '#item-list',
		listItems: '#item-list li',
		addBtn: '.add-btn',
		updateBtn: '.update-btn',
		deleteBtn: '.delete-btn',
		backBtn: '.back-btn',
		itemNameInput: '#item-name',
		itemCaloriesInput: '#item-calories',
		totalCalories: '.total-calories',
		clearBtn: '.clear-btn'
	}

	
//public methods
	return {
		populateItemList: function(items){
			let html = '';
			items.forEach(function(item){
				html += `<li class="collection-item" id="item-${item.id}" >
				<strong>${item.name}</strong>
				<em>${item.calories} Calories</em>
				<a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
			</li>`
			});

			//Insert list items
			document.querySelector(UISelectors.itemList).innerHTML = html;
		},
		getSelectors: function(){
			return UISelectors;
		},
		getItemInput: function(){
			return {
				name: document.querySelector(UISelectors.itemNameInput).value,
				calories: document.querySelector(UISelectors.itemCaloriesInput).value
			}
		},
		addListItem: function(item){
			//show the list
			document.querySelector(UISelectors.itemList).style.display = 'block';
			//create li element
			const li = document.createElement('li');
			li.className = 'collection-item';
			//Add id
			li.id = `item-${item.id}`;

			//Add html
			li.innerHTML = `<strong>${item.name}</strong>
				<em>${item.calories} Calories</em>
				<a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;

			//insert item
			document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
		},
		//Update List iem
		updateListItem: function(item){
			let listItems = document.querySelectorAll(UISelectors.listItems);
			//Convert NodeList into Array to loop
			listItems = Array.from(listItems);

			listItems.forEach(function(listItem){
				// if(item.id === listItem.id)
				const itemID = listItem.getAttribute('id');

				if(itemID === `item-${item.id}`){
					document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}</strong>
				<em>${item.calories} Calories</em>
				<a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
				}
			})
		},

		// Delete List item
		deleteListItem: function(id){
			const itemID = `#item-${id}`;
			const item = document.querySelector(itemID);
			item.remove();
		},

		removeItems: function(){
			let listItems = document.querySelectorAll(UISelectors.listItems);
			//Convert NodeList into Array to loop
			listItems = Array.from(listItems);

			listItems.forEach(function(listItem){
				listItem.remove();	
			});

			// document.querySelector(UISelectors.itemList).innerHTML = '';
			// UICtrl.hideList();
			// //Calculate total Calories
			// const totalCalories = ItemCtrl.getTotalCalories();

			// // Add total calories to UI
			// UICtrl.showTotalCalories(totalCalories);


			// UICtrl.clearEditState();

		},
		showTotalCalories: function(totalCalories){
			document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
		},
		clearInput: function(){
			document.querySelector(UISelectors.itemNameInput).value = '';
			document.querySelector(UISelectors.itemCaloriesInput).value = '';
		},
		addItemToForm: function(){
			document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
			document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
			UICtrl.showEditState();
		},
		hideList: function(){
			document.querySelector(UISelectors.itemList).style.display = 'none';
		},
		clearEditState: function(){
			UICtrl.clearInput();
			document.querySelector(UISelectors.addBtn).style.display = 'inline';
			document.querySelector(UISelectors.updateBtn).style.display = 'none';
			document.querySelector(UISelectors.deleteBtn).style.display = 'none';
			document.querySelector(UISelectors.backBtn).style.display = 'none';
		},
		showEditState: function(){
			document.querySelector(UISelectors.addBtn).style.display = 'none';
			document.querySelector(UISelectors.updateBtn).style.display = 'inline';
			document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
			document.querySelector(UISelectors.backBtn).style.display = 'inline';
		}
	}
})()


//App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
	//Load Event listeners
	const loadEventListeners = function(){
		//Get UI Selectors
		const UISelectors = UICtrl.getSelectors();

		//Add Item Event 
		document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

		//Disable submit on Enter key
		document.addEventListener('keypress', function(e){
			if(e.keyCode ===13 || e.which ===13){
				e.preventDefault();
				return false;
			}
		})

		//Edit Item Event 
		document.querySelector(UISelectors.itemList).addEventListener('click', itemEdit);

		//Item Update Submit
		document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

		//Back Button clicked
		document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

		//Item Delete Submit
		document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

		//Clear All list
		document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
	}
	//Item Add Submit
	const itemAddSubmit = function(e){

		//Get Form Inputs from UI
		const input = UICtrl.getItemInput();

		//Check for name and calories input
		if(input.name !=='' && input.calories !==''){
			//Add item
			const newItem = ItemCtrl.addItem(input.name, input.calories);
		}

		// Add item to UI
		UICtrl.addListItem(newItem);

		//Calculate total Calories
		const totalCalories = ItemCtrl.getTotalCalories();

		// Add total calories to UI
		UICtrl.showTotalCalories(totalCalories);

		//store in localStorage
		StorageCtrl.storeItem(newItem);

		//clear fields
		UICtrl.clearInput();
		e.preventDefault();
	}

	//Item Edit click
	const itemEdit = function(e){
		if(e.target.classList.contains('edit-item')){
			//Get list item id
			const id = parseInt(e.target.parentNode.parentNode.id.split('-')[1]);
			//Get item
			const itemToEdit = ItemCtrl.getItemById(id);

			//set currentItem
			ItemCtrl.setCurrentItem(itemToEdit);

			//Add item to form
			UICtrl.addItemToForm();
		}
		e.preventDefault();
	}

	//Item update Submit
	const itemUpdateSubmit = function(e){
		//Get Item input
		const input = UICtrl.getItemInput();

		//update item

		const updatedItem = ItemCtrl.updateItem(input.name,input.calories);

		//update item in UI
		UICtrl.updateListItem(updatedItem);

		//Calculate total Calories
		const totalCalories = ItemCtrl.getTotalCalories();

		// Add total calories to UI
		UICtrl.showTotalCalories(totalCalories);

		//update LS
		StorageCtrl.updateItemStorage(updatedItem);

		UICtrl.clearEditState();
		e.preventDefault()
	}

	//Item delete
	const itemDeleteSubmit = function(e){

		const currentItem = ItemCtrl.getCurrentItem();
		ItemCtrl.deleteItem(currentItem.id);

		//delete from UI
		UICtrl.deleteListItem(currentItem.id);

		//Calculate total Calories
		const totalCalories = ItemCtrl.getTotalCalories();

		// Add total calories to UI
		UICtrl.showTotalCalories(totalCalories);

		//Delete from local Storage
		StorageCtrl.deleteItemFromStorage(currentItem.id);


		UICtrl.clearEditState();

		e.preventDefault();
	}

	//Clear item list
	const clearAllItemsClick = function(e){
		// delete items from DS
		ItemCtrl.clearAllItems();

		//Calculate total Calories
		const totalCalories = ItemCtrl.getTotalCalories();

		// Add total calories to UI
		UICtrl.showTotalCalories(totalCalories);
		//remove item list from UI
		UICtrl.removeItems();

		//Clear items from local storage
		StorageCtrl.clearItemsFromStorage();

		UICtrl.hideList();


		UICtrl.clearEditState();

		e.preventDefault();
	}

//public methods
	return {
		init: function(){
			//clear edit state
			UICtrl.clearEditState();

			//Fetch Items from DS
			const items = ItemCtrl.getItems();

			//check if any items 
			if(items.length===0){
				UICtrl.hideList();
			} else {
				//populate list with items
				UICtrl.populateItemList(items);
			}

			//Calculate total Calories
			const totalCalories = ItemCtrl.getTotalCalories();

			// Add total calories to UI
			UICtrl.showTotalCalories(totalCalories);

			//loadEventListeners
			loadEventListeners();
		}
	}
	
})(ItemCtrl, StorageCtrl, UICtrl)

App.init();