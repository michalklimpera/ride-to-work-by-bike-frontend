import RoutesCalendar from 'components/routes/RoutesCalendar.vue';
import { i18n } from '../../boot/i18n';

// selectors
const classSelectorCurrentDay = '.q-current-day';
const classSelectorFutureDay = '.q-future-day';
const classSelectorHeadWeekday = '.q-calendar-month__head--weekday';
const classSelectorOutsideDay = '.q-outside';
const classSelectorPastDay = '.q-past-day';
const dataSelectorItemFromWork = '[data-cy="calendar-item-display-from-work"]';
const dataSelectorItemFromWorkActive = '[data-cy="calendar-item-icon-fromwork-active"]';
const dataSelectorItemFromWorkEmpty = '[data-cy="calendar-item-icon-fromwork-empty"]';
const dataSelectorItemToWork = '[data-cy="calendar-item-display-to-work"]';
const dataSelectorItemToWorkActive = '[data-cy="calendar-item-icon-towork-active"]';
const dataSelectorItemToWorkEmpty = '[data-cy="calendar-item-icon-towork-empty"]';
const selectorCalendarTitle = 'calendar-title';

const dayNames = [
  i18n.global.t('time.mondayShort'),
  i18n.global.t('time.tuesdayShort'),
  i18n.global.t('time.wednesdayShort'),
  i18n.global.t('time.thursdayShort'),
  i18n.global.t('time.fridayShort'),
  i18n.global.t('time.saturdayShort'),
  i18n.global.t('time.sundayShort'),
];

describe('<RoutesCalendar>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      // set default date
      const now = new Date(2024, 5, 17);
      cy.clock(now);
      cy.wrap(now).as('now');
      cy.mount(RoutesCalendar, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  // TODO: Responsive version (option to use mini-mode) https://qcalendar.netlify.app/developing/qcalendarmonth-minimode/minimode-getting-started
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('routes-calendar').should('be.visible');
  });

  it('renders top title with month and year', () => {
    cy.get('@now').then((now) => {
      const locale = i18n.global.locale;
      const month = now.toLocaleString(locale, { month: 'long' });
      const year = now.toLocaleString(locale, { year: 'numeric' });
      const title = `${month} ${year}`;

      cy.dataCy(selectorCalendarTitle)
        .should('be.visible')
        .and('have.css', 'font-size', '24px')
        .and('have.css', 'font-weight', '700')
        .and('contain', title);
    });
  });

  it('renders localized day names', () => {
    cy.get(classSelectorHeadWeekday)
      .should('be.visible')
      .each((element, index) => {
        cy.wrap(element).should('contain', dayNames[index]);
      });
  });

  // Each calendar day contains two routes
  it('renders two routes for each past day', () => {
    // check dates in the past
    cy.get(classSelectorPastDay)
      .find(dataSelectorItemToWork)
      .should('be.visible');
    cy.get(classSelectorPastDay)
      .find(dataSelectorItemFromWork)
      .should('be.visible');
    // no routes for future dates
    cy.get(classSelectorFutureDay)
      .find(dataSelectorItemToWork)
      .should('not.exist');
  });

  // First route of the current date is active
  it('renders default active route', () => {
    // check for active background
    checkTodayToWorkActive();
  });

  it('allows to enable multiple active routes', () => {
    // enable today's "from work" route
    cy.get(classSelectorCurrentDay)
      .find(dataSelectorItemFromWork)
      .click();
    // both today's routes are active
    checkTodayFromWorkActive();
    checkTodayToWorkActive();
    // enable a past day's to work route
    cy.get(classSelectorPastDay)
      .first()
      .find(dataSelectorItemFromWork)
      .click();
    // from work is active
    checkTodayToWorkActive();
    checkTodayFromWorkActive();
    checkPastDayToWorkActive();
    // disable today's "to work" route
    cy.get(classSelectorCurrentDay)
      .find(dataSelectorItemToWork)
      .click();
    checkTodayToWorkInactive();
    checkTodayFromWorkActive();
    checkPastDayToWorkActive();
    // disable today's "from work" route
    cy.get(classSelectorCurrentDay)
      .find(dataSelectorItemFromWork)
      .click();
    checkTodayToWorkInactive();
    checkTodayFromWorkInactive();
    checkPastDayToWorkActive();
    // distable a past day's to work route
    cy.get(classSelectorPastDay)
      .first()
      .find(dataSelectorItemFromWork)
      .click();
    checkTodayToWorkInactive();
    checkTodayFromWorkInactive();
    checkPastDayToWorkInactive();
  });

  it('does not allow to select a day outside current month', () => {
    // click on outside date
    cy.get(classSelectorOutsideDay)
      .find(dataSelectorItemToWork)
      .first()
      .click();
    // date should not be active
    cy.get(classSelectorOutsideDay)
      .find(dataSelectorItemToWork)
      .first()
      .find(dataSelectorItemToWorkActive)
      .should('not.exist');
  })
}

function checkTodayToWorkActive() {
  cy.get(classSelectorCurrentDay)
    .find(dataSelectorItemToWork)
    .find(dataSelectorItemToWorkActive)
    .should('be.visible');
}

function checkTodayFromWorkActive() {
  cy.get(classSelectorCurrentDay)
    .find(dataSelectorItemFromWork)
    .find(dataSelectorItemFromWorkActive)
    .should('be.visible');
}

function checkPastDayToWorkActive() {
  cy.get(classSelectorPastDay)
    .first()
    .find(dataSelectorItemFromWork)
    .find(dataSelectorItemFromWorkActive)
    .should('be.visible');
}

function checkTodayToWorkInactive() {
  cy.get(classSelectorCurrentDay)
    .find(dataSelectorItemToWork)
    .find(dataSelectorItemToWorkEmpty)
    .should('be.visible');
}

function checkTodayFromWorkInactive() {
  cy.get(classSelectorCurrentDay)
    .find(dataSelectorItemFromWork)
    .find(dataSelectorItemFromWorkEmpty)
    .should('be.visible');
}

function checkPastDayToWorkInactive() {
  cy.get(classSelectorPastDay)
    .first()
    .find(dataSelectorItemToWork)
    .find(dataSelectorItemToWorkEmpty)
    .should('be.visible');
}
