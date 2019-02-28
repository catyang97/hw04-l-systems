// An ExpansionRule class to represent the result of mapping a particular character 
// to a new set of characters during the grammar expansion phase of the L-System. 
// By making a class to represent the expansion, you can have a single character 
// expand to multiple possible strings depending on some probability by querying 
// a Map<string, ExpansionRule>.


// The expansion rule class is like a container for all the possible outcomes of 
// expanding a character. We then create a map from a character to an expansion rule, 
// instead of a fixed character result. 
// This allows us to have probability and randomness when interpreting the L-system grammar

export default class ExpansionRule {
    before: string;
    expansions: Map<string, number>;
    
    constructor(before: string, expansions: Map<string, number>) {
        this.before = before;
        this.expansions = expansions;
    }

    getExp() : string {
        let sum: number = 0.0;
        let random: number = Math.random();

        for(let [newValue, prob] of this.expansions) {
            sum += prob;
            if (random < sum) {
                // console.log(newValue);
                return newValue;
            }
        }
        return "";
    }

}