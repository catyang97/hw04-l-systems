import {vec3, vec4, mat4, quat} from 'gl-matrix';
import Turtle from './Turtle';
import ExpansionRule from './ExpansionRule';
import DrawingRule from './DrawingRule';

export default class LSystem {
    turtle: Turtle = new Turtle(vec3.fromValues(0.0, 0.0, 0.0), vec4.fromValues(0.0, 1.0, 0.0, 0.0), vec4.fromValues(1.0, 0.0, 0.0, 0.0), vec4.fromValues(0.0, 0.0, 1.0, 0.0));
    turtleStack: Turtle[];
    grammar: string;
    iterations: number;
    expRules: Map<string, ExpansionRule> = new Map();
    drawRules: Map<string, DrawingRule> = new Map();
    transforms: mat4[] = [];

    drawForward : DrawingRule;
    drawSave : DrawingRule;
    drawReset : DrawingRule;
    drawRotPosX : DrawingRule;
    drawRotNegX : DrawingRule;
    drawRotPosY : DrawingRule;
    drawRotNegY : DrawingRule;
    drawRotPosZ : DrawingRule;
    drawRotNegZ : DrawingRule;
    drawEnd : DrawingRule;
    drawB : DrawingRule;

    constructor(axiom: string, iterations: number) {
        this.grammar = axiom;
        this.turtleStack = [];
        this.setExpansionRules();
        this.iterations = iterations;
        this.expandGrammar();
        console.log(this.grammar);
    }

    setExpansionRules() {
        let expansions: Map<string, number> = new Map();
        expansions.set("ABAB[b]", 0.5);
        expansions.set("ABAB[c]", 0.5);
        this.expRules.set("A", new ExpansionRule("A", expansions));

        let expansions2: Map<string, number> = new Map();
        expansions2.set("BB[a]AB]", 1.0);
        this.expRules.set("B", new ExpansionRule("B", expansions2));

        let expansionsSave: Map<string, number> = new Map();
        expansionsSave.set("[", 1.0);
        this.expRules.set("[", new ExpansionRule("[", expansionsSave));

        let expansionsReset: Map<string, number> = new Map();
        expansionsReset.set("]", 1.0);
        this.expRules.set("]", new ExpansionRule("]", expansionsReset));

        let expansionsa: Map<string, number> = new Map();
        expansionsa.set("a", 1.0);
        this.expRules.set("a", new ExpansionRule("a", expansionsa));

        let expansionsb: Map<string, number> = new Map();
        expansionsb.set("b", 1.0);
        this.expRules.set("b", new ExpansionRule("b", expansionsb));

        let expansionsc: Map<string, number> = new Map();
        expansionsc.set("c", 1.0);
        this.expRules.set("c", new ExpansionRule("c", expansionsc));

        let expansionsd: Map<string, number> = new Map();
        expansionsd.set("d", 1.0);
        this.expRules.set("d", new ExpansionRule("d", expansionsd));

        let expansionse: Map<string, number> = new Map();
        expansionse.set("e", 1.0);
        this.expRules.set("e", new ExpansionRule("e", expansionse));

        let expansionsf: Map<string, number> = new Map();
        expansionsf.set("f", 1.0);
        this.expRules.set("f", new ExpansionRule("f", expansionsf));
    }

    expandGrammar() : string {
        let out = this.grammar;
        for (let i = 0; i < this.iterations; i++) {
            let exp = "";
            for (let char of out) {
                let expansion = this.expRules.get(char).getExp();
                // TODO: error check??
                exp += expansion;
            }
            out = exp;
        }
        this.grammar = out;
        return out;
    }

    line() {
        // console.log("hi");
        console.log(this.turtle);
        // console.log(this.grammar);
        this.transforms.push(this.turtle.getTransformMatrix());
        this.turtle.moveForward(1.5);
    }

    save() {
        this.turtleStack.push(this.turtle);
    }

    reset() {
        this.turtle = this.turtleStack.pop();
    }

    rotatePosX() {
        this.turtle.rightRotate(25.0);
    }

    rotateNegX() {
        this.turtle.rightRotate(-25.0);
    }

    rotatePosY() {
        this.turtle.forwardRotate(25.0);
    }

    rotateNegY() {
        this.turtle.forwardRotate(-25.0);
    }

    rotatePosZ() {
        this.turtle.upRotate(25.0);
    }

    rotateNegZ() {
        this.turtle.upRotate(-25.0);
    }

    end() {
        
    }

    blankB() {
        console.log("blank");
    }

    setDrawRules() {
        let mapForward: Map<string, number> = new Map();
        mapForward.set(this.line.bind(this), 1.0);
        this.drawForward = new DrawingRule("A", mapForward);
        this.drawRules.set("A", this.drawForward);

        let mapSave: Map<string, number> = new Map();
        mapSave.set(this.save.bind(this), 1.0);
        this.drawSave = new DrawingRule("[", mapSave);
        this.drawRules.set("[", this.drawSave);

        let mapReset: Map<string, number> = new Map();
        mapReset.set(this.reset.bind(this), 1.0);
        this.drawReset = new DrawingRule("]", mapReset);
        this.drawRules.set("]", this.drawReset);

        let mapRotX1: Map<string, number> = new Map();
        mapRotX1.set(this.rotatePosX.bind(this), 1.0);
        this.drawRotPosX = new DrawingRule("a", mapRotX1);
        this.drawRules.set("a", this.drawRotPosX);

        let mapRotX2: Map<string, number> = new Map();
        mapRotX2.set(this.rotateNegX.bind(this), 1.0);
        this.drawRotNegX = new DrawingRule("b", mapRotX2);
        this.drawRules.set("b", this.drawRotNegX);

        let mapRotY1: Map<string, number> = new Map();
        mapRotY1.set(this.rotatePosY.bind(this), 1.0);
        this.drawRotPosY = new DrawingRule("c", mapRotY1);
        this.drawRules.set("c", this.drawRotPosY);

        let mapRotY2: Map<string, number> = new Map();
        mapRotY2.set(this.rotateNegY.bind(this), 1.0);
        this.drawRotNegY = new DrawingRule("d", mapRotY2);
        this.drawRules.set("d", this.drawRotNegY);

        let mapRotZ1: Map<string, number> = new Map();
        mapRotZ1.set(this.rotatePosZ.bind(this), 1.0);
        this.drawRotPosZ= new DrawingRule("e", mapRotZ1);
        this.drawRules.set("c", this.drawRotPosZ);

        let mapRotZ2: Map<string, number> = new Map();
        mapRotZ2.set(this.rotateNegZ.bind(this), 1.0);
        this.drawRotNegZ = new DrawingRule("f", mapRotZ2);
        this.drawRules.set("f", this.drawRotNegZ);

        let mapEnd: Map<string, number> = new Map();
        mapEnd.set(this.end.bind(this), 1.0);
        this.drawEnd = new DrawingRule("x", mapEnd);
        this.drawRules.set("x", this.drawEnd);

        let mapBlank: Map<string, number> = new Map();
        mapBlank.set(this.blankB.bind(this), 1.0);
        this.drawB = new DrawingRule("B", mapBlank);
        this.drawRules.set("B", this.drawB);
    }

    turtlePop() {

    }

    turtlePush() {

    }

    draw() {
        console.log(this.grammar);

        for (let i = 0; i < this.grammar.length; i++) {
            let curr = this.grammar.charAt(i);
            console.log(curr);
            let rule = this.drawRules.get(curr).getDraw();
            if (rule) {
                rule();
            }

        }
    }
}