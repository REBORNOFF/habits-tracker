'use strict';

const HABIT_KEY = 'HABIT_KEY';
let habits = [];
let globalActiveHabitId;

const page = {
	menu: document.querySelector('.menu__list'),
	header: {
		headerTitle: document.querySelector('.header__title'),
		progressPercent: document.querySelector('.progress__percent'),
		progressCoverBar: document.querySelector('.progress__cover-bar')
	},
	content: {
		wrapper: document.querySelector('.main__wrapper'),
		nextDay: document.querySelector('.habit__day')
	},
	form: {
		habitForm: document.querySelector('.habit__form')
	}
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

function rerenderHeader(activeHabit) {
	page.header.headerTitle.innerText = activeHabit.name;
	const progress =
		activeHabit.days.length / activeHabit.target > 1
			? 100
			: (activeHabit.days.length / activeHabit.target) * 100;
	page.header.progressPercent.innerText = progress.toFixed(0) + '%';
	page.header.progressCoverBar.style.width = `${progress}%`;
}

function rerenderContent(activeHabit) {
	page.content.wrapper.innerHTML = '';

	for (const index in activeHabit.days) {
		const element = document.createElement('div');
		element.classList.add('habit');
		element.innerHTML = `
			<div class="habit__day">День ${Number(index) + 1}</div>
      		<div class="habit__comment">${activeHabit.days[index].comment}</div>
        	<button class="habit__remove" onclick="removeDays(${index})">
        		<img class="habit__remove-button" src="/images/delete.svg" alt="Удалить комментарий">
        	</button>
		`;
		page.content.nextDay.innerText = `День ${activeHabit.days.length + 1}`;
		page.content.wrapper.appendChild(element);
	}
}

function rerender(activeHabitId) {
	const activeHabit = habits.find(habit => habit.id === activeHabitId);
	globalActiveHabitId = activeHabitId;

	if (!activeHabit) {
		return;
	}

	rerenderMenu(activeHabit);
	rerenderHeader(activeHabit);
	rerenderContent(activeHabit);
}

function addDays(event) {
	event.preventDefault();

	const form = event.target;
	const data = new FormData(form);
	const comment = data.get('comment');

	form['comment'].classList.remove('error');

	if (!comment) {
		form['comment'].classList.add('error');
	}

	habits = habits.map(habit => {
		if (habit.id === globalActiveHabitId) {
			return {
				...habit,
				days: habit.days.concat([{ comment }])
			};
		}
		return habit;
	});

	saveData();
	form['comment'].value = '';
	rerender(globalActiveHabitId);
}

page.form.habitForm.addEventListener('submit', addDays);

function removeDays(activeIndex) {
	habits = habits.map(habit => {
		if (habit.id === globalActiveHabitId) {
			habit.days.splice(activeIndex, 1);
			return {
				...habit,
				days: habit.days
			};
		}
		return habit;
	});
	saveData();
	rerender(globalActiveHabitId);
}

(() => {
	loadData();
	rerender(habits[0].id);
})();
