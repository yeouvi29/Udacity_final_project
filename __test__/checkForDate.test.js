import { checkForDate } from "../src/client/js/dateChecker"

describe("Validating date", () => {
    test("Check if / is included and total length of string is 10", () => {
        const date = "07/05/2011";
        expect(checkForDate(date)).toBe(true);
    });

    test("Invalid text(use different character)", () => {
        const string = "07-05-2011";
        expect(checkForDate(string)).toBe(false);
    });

    test("Invalisd text(no number in tens place)", () => {
        const string = "7/5/2011";
        expect(checkForDate(string)).toBe(false);
    });
});