describe('Game action', () => {
    beforeEach(() => {
    cy.visit('/'); 
    });
    
    it('another player join the first to a room and we join later', () => {
        cy.get('[data-testid="start-btn"]').click();

        // Confirm the success message appears
        cy.get('[data-testid="gameRunning-h5"]').contains('PARTIDA EN CURSO ...');
        cy.get('[data-testid="gameTurn-h5"]').contains('Turno otro Jugador');
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