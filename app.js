'use strict';

let habits = [];
const HABIT_KEY = 'HABIT_KEY';

const page = {
	menu: document.querySelector('.menu__list')
};

function loadData() {
	const habitsString = localStorage.getItem(HABIT_KEY);
	const habitArray = JSON.parse(habitsString);

	if (Array.isArray(habitArray)) {
		habits = habitArray;
	}
}

function saveData() {
	localStorage.setItem(HABIT_KEY, JSON.stringify(habits));
}

function rerenderMenu(activeHabit) {
	if (!activeHabit) {
		return;
	}

	for (const habit of habits) {
		const existed = document.querySelector(`[menu-habit-id="${habit.id}"]`);

		if (!existed) {
			//create
			const element = document.createElement('button');
			element.setAttribute('menu-habit-id', habit.id);
			element.classList.add('menu__list-item');
			element.innerHTML = `<img src="/images/${habit.icon}.svg" alt=${habit.name}>`;
			element.addEventListener('click', () => rerender(habit.id));

			if (activeHabit.id === habit.id) {
				element.classList.add('menu__list-item_active');
			}

			page.menu.appendChild(element);

			continue;
		}

		if (activeHabit.id === habit.id) {
			existed.classList.add('menu__list-item_active');
		} else {
			existed.classList.remove('menu__list-item_active');
		}
	}
}

function rerender(activeHabitId) {
	const activeHabit = habits.find(habit => habit.id === activeHabitId);
	rerenderMenu(activeHabit);
}

(() => {
	loadData();
	rerender(habits[0].id);
})();
