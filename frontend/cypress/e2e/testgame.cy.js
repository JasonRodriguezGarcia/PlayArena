describe('Game action', () => {
    beforeEach(() => {
    cy.visit('/'); 
    });
    
    it('starts wait state for next player to join room', () => {
        cy.get('[data-testid="start-btn"]').click();

        // Confirm the success message appears
        cy.get('[data-testid="waitMessage-h5"]').contains('Esperando otro jugador ...');
    });
  


//     it('Visits the app and checks the title', () => {
//     cy.title().should('eq', 'Vite + React');
//   });

//   it('Visits the app and checks that Hola exists', () => {
//     cy.visit('/');
//     cy.get('h1').contains('Hola');
//   });


//   it('displays an h1 with "User List"', () => {
//     cy.visit('/'); // Adjust if UserList is on another route
//     cy.get('h1').contains('User List');
//   });

//   it('displays a text component with "Second test"', () => {
//     cy.visit('/'); // Adjust if UserList is on another route
//     cy.get('[data-testid="page-title"]').should('have.text', 'Second test');
//   });


});