import { getData } from "../src/client/js/app"


describe("Testing the submit functionality", () => { 
    test("Testing the getData() function", () => {

           expect(getData).toBeDefined();
    })

});