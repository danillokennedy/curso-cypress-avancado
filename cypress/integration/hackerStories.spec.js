describe('Hacker Stories', () => {
  
  //Exercicio 1 Aula2 - no berforeeach estou interceptando a requisição de loading para
  //garantir que a pagina abriu. Objetivo: Refatorando o codigo e deixando mais robusto.

  beforeEach(() => {

   //cy.intercept('GET', '**/search?query=React&page=0').as('loading_ok')
   //Extra 1 Aula 02. Codigo acima (como inteiro) ou abaixo (como objeto) faz a mesma coisa, porem, o de cima é mais rapido.
    
   cy.intercept({
      method: 'GET',
      pathname: '**/search',
      query: {
        query: 'React',
        page: '0'
      }
    }).as('loading_ok')
    
    cy.visit('/')
    cy.wait('@loading_ok')
  })

  it('Mostra o rodapé', () => {
    
    cy.get('footer')
      .should('be.visible')
      .and('contain', 'Icons made by Freepik from www.flaticon.com')
  })

  context('Lista de stories', () => {
    // Since the API is external,
    // I can't control what it will provide to the frontend,
    // and so, how can I assert on the data?
    // This is why this test is being skipped.
    // TODO: Find a way to test it out.
    it.skip('Mostra os dados corretos para todas as histórias renderizadas', () => {})

    it('Mostrar 20 histórias, depois de clicar em "More", mostrar mais 20', () => {
      cy.get('.item').should('have.length', 20)
      cy.contains('More').click()
      cy.assertLoadingIsShownAndHidden()
      cy.get('.item').should('have.length', 40)
    })

    it('Mostra apenas dezenove histórias depois de descartar a primeira história', () => {
      cy.get('.button-small')
        .first()
        .click()

      cy.get('.item').should('have.length', 19)
    })

    // Since the API is external,
    // I can't control what it will provide to the frontend,
    // and so, how can I test ordering?
    // This is why these tests are being skipped.
    // TODO: Find a way to test them out.
    context.skip('Order by', () => {
      it('orders by title', () => {})

      it('orders by author', () => {})

      it('orders by comments', () => {})

      it('orders by points', () => {})
    })

    // Hrm, how would I simulate such errors?
    // Since I still don't know, the tests are being skipped.
    // TODO: Find a way to test them out.
    context.skip('Errors', () => {
      it('shows "Something went wrong ..." in case of a server error', () => {})

      it('shows "Something went wrong ..." in case of a network error', () => {})
    })
  })

  context('Search', () => {
    const initialTerm = 'React'
    const newTerm = 'Cypress'

    beforeEach(() => {
      cy.get('#search')
        .clear()
    })

    it('Digita e aperta ENTER', () => {
      cy.get('#search')
        .type(`${newTerm}{enter}`)

      cy.assertLoadingIsShownAndHidden()

      cy.get('.item').should('have.length', 20)
      cy.get('.item')
        .first()
        .should('contain', newTerm)
      cy.get(`button:contains(${initialTerm})`)
        .should('be.visible')
    })

    it('Digita e clica no botão enviar', () => {
      cy.get('#search')
        .type(newTerm)
      cy.contains('Submit')
        .click()

      cy.assertLoadingIsShownAndHidden()

      cy.get('.item').should('have.length', 20)
      cy.get('.item')
        .first()
        .should('contain', newTerm)
      cy.get(`button:contains(${initialTerm})`)
        .should('be.visible')
    })

    context('Last searches', () => {
      it('Pesquisas por meio do último termo pesquisado', () => {
        cy.get('#search')
          .type(`${newTerm}{enter}`)

        cy.assertLoadingIsShownAndHidden()

        cy.get(`button:contains(${initialTerm})`)
          .should('be.visible')
          .click()

        cy.assertLoadingIsShownAndHidden()

        cy.get('.item').should('have.length', 20)
        cy.get('.item')
          .first()
          .should('contain', initialTerm)
        cy.get(`button:contains(${newTerm})`)
          .should('be.visible')
      })

      it('Mostrar no máximo de 5 botões para os últimos termos pesquisados', () => {
        const faker = require('faker')

        Cypress._.times(6, () => {
          cy.get('#search')
            .clear()
            .type(`${faker.random.word()}{enter}`)
        })

        cy.assertLoadingIsShownAndHidden()

        cy.get('.last-searches button')
          .should('have.length', 5)
      })
    })
  })
})
