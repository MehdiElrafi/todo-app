describe('template spec', () => {
  it('passes', () => {
    cy.visit("/");
    cy.location('pathname').should('eq', '/');
  })
})