describe('SourceSelect', () => {
  it('renders the source select dropdown on click', () => {
    // visit the app
    cy.visit('http://localhost:3000/');
    // click the dropdown modal
    cy.get('[data-test-id=cf-ui-dropdown').click();
    // ensure it rendered more than 1 item
    cy.get('[data-test-id=cf-ui-dropdown-list')
      .children()
      .should('have.length.gte', 2);
  });
  it('renders the selected source assets on click', () => {
    // click on a source name
    cy.get('[data-test-id=cf-ui-dropdown-list').contains('sdk-test').click();
    // ensure it's set at the button text
    cy.get('[data-test-id=cf-ui-button').first().contains('sdk-test');
    // ensure placeholder isn't rendered when source is selected
    cy.get('.ix-grid-item-placeholder').should('not.exist');
  });
});
