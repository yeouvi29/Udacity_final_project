import { checkForDate } from "../src/client/js/dateChecker"

describe("Validating date", () => {
    test("Valid input(The departure date is earlier than the end date)", () => {
        const startDate = "07/05/2011";
        const endDate = "07/06/2011";
        expect(checkForDate(startDate, endDate)).toBe(true);
    });

    test("Invalid input(The departure date is later than the end date)", () => {
        const startDate = "07/06/2011";
        const endDate = "07/05/2011";
        expect(checkForDate(startDate, endDate)).toBe(false);
    });

    test("Invalid input(The departure date is same as the end date)", () => {
        const startDate = "07/05/2011";
        const endDate = "07/05/2011";
        expect(checkForDate(startDate, endDate)).toBe(false);
    });
});