describe("Todo App", () => {

    it("There should be an error when I clicked button with empty text", () => {
        cy.server();

        cy.route(
            {
                method:"POST",
                url:"api/todos/create",
                response: {"errors":[{"value":"","msg":"todo is required.","param":"todo","location":"body"}]},
                status:400
            }
        ).as("todoRequired");

        cy.visit("/");

        cy.get("button#addTodo").click();

        cy.wait("@todoRequired");

        cy.get("h3#error", {timeout: 20000}).should(
            "have.text",
            "todo is required."
        );
    });

    it("There should be todo in list that I wrote", () => {
        cy.server();
        cy.route(
            "POST",
            "api/todos/create",
            {
                _id: "23423432423",
                todo: "buy some milk"
            }
        ).as('createTodo');

        cy.visit("/");

        cy.get("input")
            .type("buy some milk")
            .should("have.value", "buy some milk");

        cy.get('button').click().wait(["@createTodo"]);

        cy.get("ul.list-group", {timeout: 20000}).contains(
            "li.todo-list",
            "buy some milk"
        );

        cy.get("h3#error", {timeout: 20000}).should("be.empty");
    });
});
