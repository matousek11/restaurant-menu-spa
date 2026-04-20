import {
  WEEKLY_MENU_ARCHIVED,
  WEEKLY_MENU_DRAFT,
  WEEKLY_MENU_PUBLISHED,
  WEEKLY_MENU_READY,
} from '../../constants.js';

export function canDisplayStateChangeButtons(weeklyMenuState, buttonStateToChange) {
  if (weeklyMenuState === WEEKLY_MENU_DRAFT) {
    switch (buttonStateToChange) {
      case WEEKLY_MENU_READY:
        return true;
      default:
        return false;
    }
  }

  if (weeklyMenuState === WEEKLY_MENU_READY) {
    switch (buttonStateToChange) {
      case WEEKLY_MENU_DRAFT:
        return true;
      case WEEKLY_MENU_PUBLISHED:
        return true;
      default:
        return false;
    }
  }

  if (weeklyMenuState === WEEKLY_MENU_PUBLISHED) {
    switch (buttonStateToChange) {
      case WEEKLY_MENU_DRAFT:
        return true;
      case WEEKLY_MENU_ARCHIVED:
        return true;
      default:
        return false;
    }
  }

  if (weeklyMenuState === WEEKLY_MENU_ARCHIVED) {
    return false;
  }
}

export function canUpdateWeeklyMenu(weeklyMenuState) {
  return weeklyMenuState === WEEKLY_MENU_DRAFT
}