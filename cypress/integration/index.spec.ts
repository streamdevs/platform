describe('/', () => {
	beforeEach(() => {
		cy.visit('/');
	});

	it("find the text 'We're in a closed beta'", () => {
		cy.findByText("We're in a closed beta");
		cy.url().should('contains', '/login');
	});

	it('shows the GitHub webhook URL', () => {
		cy.findByText("We're in a closed beta");
		cy.findByText(/Login with GitHub/i).click();
		cy.findByText('GitHub webhook URL:');

		cy.url().should('eq', 'http://localhost:3000/');
	});
});
