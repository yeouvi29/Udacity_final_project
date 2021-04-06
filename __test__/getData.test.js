import { getData } from "../src/client/js/app"


describe("Testing the async function working properly", () => { 
    test("Testing the getData() function", () => {

           expect(getData).toBeDefined();
    })

});