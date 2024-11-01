import FormFieldTestWrapper from 'components/global/FormFieldTestWrapper.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import {
  httpSuccessfullStatus,
  interceptOrganizationsApi,
} from '../../../test/cypress/support/commonTests';

describe('<FormFieldCompany>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelCompany',
        'labelCompanyShort',
        'messageFieldRequired',
        'messageNoCompany',
      ],
      'form',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['buttonAddCompany', 'titleAddCompany'],
      'form.company',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['buttonAddCompany'],
      'register.challenge',
      i18n,
    );
    cy.testLanguageStringsInContext(['discard'], 'navigation', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      interceptOrganizationsApi(rideToWorkByBikeConfig, i18n);
      // mount component
      cy.mount(FormFieldTestWrapper, {
        props: {
          component: 'FormFieldCompany',
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders input with label', () => {
      // input wrapper
      cy.dataCy('form-company')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
      // input label
      cy.dataCy('form-company')
        .find('label')
        .should('be.visible')
        .and('contain', i18n.global.t('form.labelCompany'));
      // input
      cy.dataCy('form-company').find('input').should('be.visible');
    });

    it('allows user to select option', () => {
      testCompanyApiResponse();

      cy.dataCy('form-company').find('input').click();
      // select option
      cy.get('.q-menu')
        .should('be.visible')
        .within(() => {
          cy.get('.q-item').first().click();
        });
      // test selected option
      cy.dataCy('form-company')
        .find('input')
        .invoke('val')
        .should('eq', 'Company 1');
    });

    it('allows to search through options', () => {
      testCompanyApiResponse();

      // search for option
      cy.dataCy('form-company').find('input').focus();
      cy.dataCy('form-company').find('input').type('2');
      // select option
      cy.get('.q-menu')
        .should('be.visible')
        .within(() => {
          cy.get('.q-item').first().click();
        });
      // test selected option
      cy.dataCy('form-company')
        .find('input')
        .invoke('val')
        .should('eq', 'Company 2');
    });

    it('validates company field correctly', () => {
      cy.dataCy('form-company').find('input').focus();
      cy.dataCy('form-company').find('input').blur();
      cy.dataCy('form-company')
        .find('.q-field__messages')
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('form.messageFieldRequired', {
            fieldName: i18n.global.t('form.labelCompanyShort'),
          }),
        );
      cy.dataCy('form-company').find('input').click();
      // select option
      cy.get('.q-menu')
        .should('be.visible')
        .within(() => {
          cy.get('.q-item').first().click();
        });
      cy.dataCy('form-company').find('.q-field__messages').should('not.exist');
    });

    it('renders input and button in a column layout', () => {
      cy.testElementsSideBySide('col-input', 'col-button');
    });

    it('allows to add a new company', () => {
      cy.fixture('formFieldCompanyCreateRequest').then(
        (formFieldCompanyCreateRequest) => {
          cy.fixture('formFieldCompanyCreate').then(
            (formFieldCompanyCreateResponse) => {
              cy.dataCy('button-add-company').click();
              // dialog
              cy.dataCy('dialog-add-company').should('be.visible');
              cy.dataCy('dialog-add-company')
                .find('h3')
                .should('be.visible')
                .and('have.css', 'font-size', '20px')
                .and('have.css', 'font-weight', '500')
                .and('contain', i18n.global.t('form.company.titleAddCompany'));
              cy.dataCy('dialog-button-cancel')
                .should('be.visible')
                .and('have.text', i18n.global.t('navigation.discard'));
              cy.dataCy('dialog-button-submit')
                .should('be.visible')
                .and(
                  'have.text',
                  i18n.global.t('form.company.buttonAddCompany'),
                );
              // fill form
              cy.dataCy('form-add-company-name')
                .find('input')
                .type(formFieldCompanyCreateRequest.name);
              cy.dataCy('form-add-company-vat-id')
                .find('input')
                .type(formFieldCompanyCreateRequest.vatId);
              // submit form
              cy.dataCy('dialog-button-submit').click();
              // test response
              cy.wait('@createOrganization').then((interception) => {
                expect(interception.request.headers.authorization).to.include(
                  'Bearer',
                );
                expect(interception.response.statusCode).to.equal(
                  httpSuccessfullStatus,
                );
                expect(interception.request.body).to.deep.equal({
                  name: formFieldCompanyCreateRequest.name,
                  vatId: formFieldCompanyCreateRequest.vatId,
                });
                expect(interception.response.body).to.deep.equal(
                  formFieldCompanyCreateResponse,
                );
              });
              // test selected option
              cy.dataCy('form-company')
                .find('input')
                .invoke('val')
                .should('eq', formFieldCompanyCreateResponse.name);
            },
          );
        },
      );
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      interceptOrganizationsApi(rideToWorkByBikeConfig, i18n);
      // mount component
      cy.mount(FormFieldTestWrapper, {
        props: {
          component: 'FormFieldCompany',
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders input and button in a stacked layout', () => {
      cy.testElementPercentageWidth(cy.dataCy('col-input'), 100);
      cy.testElementPercentageWidth(cy.dataCy('col-button'), 100);
    });
  });

  function testCompanyApiResponse() {
    cy.fixture('formFieldCompany').then((formFieldCompanyResponse) => {
      cy.wait('@getOrganizations').then((interception) => {
        expect(interception.request.headers.authorization).to.include('Bearer');
        expect(interception.response.statusCode).to.equal(
          httpSuccessfullStatus,
        );
        expect(interception.response.body).to.deep.equal(
          formFieldCompanyResponse,
        );
      });
    });
  }
});
