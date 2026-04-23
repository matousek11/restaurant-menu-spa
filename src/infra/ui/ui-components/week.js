import { createHeader } from './header.js';
import { createDay } from './day.js';
import { createParagraph } from './paragraph.js';
import { createButton } from './button.js';
import { getMondayDateOfWeek } from '../../../app/helpers/dateManipulation.js';
import {
    WEEKLY_MENU_ARCHIVED,
    WEEKLY_MENU_DRAFT,
    WEEKLY_MENU_PUBLISHED,
    WEEKLY_MENU_READY,
} from '../../../constants.js';

/**
 * Creates a week element with the given week.
 *
 * @param week week to display.
 *
 * @returns {HTMLDivElement} created week element.
 */
export function createWeek(
    week,
    canDisplayStateChangeButtons,
    canUpdateWeeklyMenu = () => false,
    canShowAdminDetail = false,
    buildSaveRoute = null,
    buildDateChangeRoute = null,
    skipDaysList = false,
) {
    const weekElement = document.createElement('div');
    if (week === undefined) {
        weekElement.appendChild(createParagraph('Menu pro aktuální týden neexistuje.'));
        return weekElement;
    }

    const allowMoveToDraft = canDisplayStateChangeButtons(week.state, WEEKLY_MENU_DRAFT);
    const allowMoveToReady = canDisplayStateChangeButtons(week.state, WEEKLY_MENU_READY);
    const allowMoveToPublished = canDisplayStateChangeButtons(week.state, WEEKLY_MENU_PUBLISHED);
    const allowMoveToArchived = canDisplayStateChangeButtons(week.state, WEEKLY_MENU_ARCHIVED);

    if (allowMoveToDraft || allowMoveToReady || allowMoveToPublished || allowMoveToArchived) {
        weekElement.appendChild(createParagraph('Přepnutí stavu:'));
    }

    if (allowMoveToDraft) {
        weekElement.appendChild(createButton('Put to draft', () => {
            window.location.hash = `#/weekly-menu-state/${week.weekStartId}/${WEEKLY_MENU_DRAFT}`
        }));
    }
    if (allowMoveToReady) {
        weekElement.appendChild(createButton('Put to ready', () => {
            window.location.hash = `#/weekly-menu-state/${week.weekStartId}/${WEEKLY_MENU_READY}`
        }));
    }
    if (allowMoveToPublished) {
        weekElement.appendChild(createButton('Publish', () => {
            window.location.hash = `#/weekly-menu-state/${week.weekStartId}/${WEEKLY_MENU_PUBLISHED}`
        }));
    }
    if (allowMoveToArchived) {
        weekElement.appendChild(createButton('Archive', () => {
            window.location.hash = `#/weekly-menu-state/${week.weekStartId}/${WEEKLY_MENU_ARCHIVED}`
        }));
    }

    weekElement.appendChild(createHeader(week.weekStartId));
    if (canShowAdminDetail) {
        weekElement.appendChild(createParagraph(`Stav: ${week.state}`));
    }

    if (canUpdateWeeklyMenu(week.state)) {
        const dateRow = document.createElement('div');
        dateRow.className = 'week-start-date';

        const dateLabel = document.createElement('label');
        dateLabel.htmlFor = 'week-start-id-input';
        dateLabel.textContent = 'Týden: ';

        const dateInput = document.createElement('input');
        dateInput.id = 'week-start-id-input';
        dateInput.type = 'date';
        dateInput.name = 'weekStartId';
        if (week.weekStartId) {
            dateInput.value = getMondayDateOfWeek(week.weekStartId);
        }
        if (buildDateChangeRoute !== null) {
            dateInput.addEventListener('change', (event) => {
                const updatedWeekStartId = event.target.value;
                if (!updatedWeekStartId) {
                    return;
                }
                const normalizedWeekStartId = getMondayDateOfWeek(updatedWeekStartId);
                dateInput.value = normalizedWeekStartId;
                window.location.hash = buildDateChangeRoute(
                    week.weekStartId,
                    normalizedWeekStartId,
                );
            });
        }

        dateLabel.appendChild(dateInput);
        dateRow.appendChild(dateLabel);
        weekElement.appendChild(dateRow);

        if (buildSaveRoute !== null) {
            weekElement.appendChild(
                createButton('Uložit změnu', () => {
                    const currentDateValue = getMondayDateOfWeek(
                        dateInput.value || week.weekStartId,
                    );
                    dateInput.value = currentDateValue;
                    window.location.hash = buildSaveRoute(
                        week.weekStartId,
                        currentDateValue,
                    );
                }),
            );
        }
    }

    if (!skipDaysList) {
        for (let i = 0; i < 7; i++) {
            const day = week.days.find((day) => day.dayId === i);
            if (day) {
                weekElement.append(createDay(day));
                continue;
            }

            weekElement.append(createDay({ dayId: i, meals: [] }));
        }
    }

    return weekElement;
}