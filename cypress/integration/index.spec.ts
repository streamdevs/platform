describe('/', () => {
	beforeEach(() => {
		cy.visit('/');
	});

	describe('without a logged user', () => {
		it("redirects the user to '/login'", () => {
			cy.findByText("We're in a closed beta");
			cy.url().should('contains', '/login');
		});
	});

	describe('with a logged user', () => {
		it('shows the GitHub webhook URL', () => {
			cy.findByText("We're in a closed beta");
			cy.findByText(/Login with GitHub/i).click();
			cy.findByText('GitHub webhook URL:');

			cy.url().should('eq', 'http://localhost:3000/');
		});
	});
});
