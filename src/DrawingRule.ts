// A DrawingRule class to represent the result of mapping a character to an 
// L-System drawing operation (possibly with multiple outcomes depending on a probability)

export default class DrawingRule {
    char: string;
    drawRules: Map<any, number>;
    
    constructor(char: string, drawRules: Map<any, number>) {
        this.char = char;
        this.drawRules = drawRules;
    }

    getDraw() : any {
        let sum: number = 0.0;
        let random: number = Math.random();

        for(let [func, prob] of this.drawRules) {
            sum += prob;
            if (random < sum) {
                // console.log(newValue);
                return func;
            }
        }
        return null;
    }
    
}