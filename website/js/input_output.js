const inputObj = document.getElementById('reaction-input');
const outputObj = document.getElementById('output');

function output(a){
    console.log(JSON.stringify(a));
}

function isAlphaOrParen(str) {
    if (/^[a-zA-Z()]+$/.test(str)) {
        return str;
    }
}

class LGS {
    constructor(length) {
        this.unknownCount = length
        this.equations = [];

        this.toSolve = [];
        this.sollutions = [];
    }

    addEquation(index, value) {
        this.equations.push(Array(this.unknownCount).fill(0));
        this.equations[this.equations.length-1][index] = value;
    }

    editEquation(index, value) {
        this.equations[this.equations.length-1][index] = value;
    }

    static uniq(a) {
        for (let i = 0; i < a.length; i++) {
            for (let n = 0; n < a.length; n++) {
                if (n !== i) {
                    let bigger;
                    let smaller;
                    if (a[i] > a[n]) {
                        bigger = a[i];
                        smaller = a[n];
                    } else {
                        bigger = a[n];
                        smaller = a[i];
                    }

                    let isMultiple = true;
                    let prevVal = bigger[0] / smaller[0]
                    for (let e = 0; e < bigger.length; e++) {
                        let currentVal = bigger[e] / smaller[e];
                        if (!(Number.isInteger(currentVal))) {
                            isMultiple = false
                            break
                        }
                        if (currentVal !== prevVal) {
                            isMultiple = false;
                            break;
                        }
                        prevVal = currentVal;
                    }

                    if (isMultiple) {
                        if (a[i] > a[n]) {
                            a[i] = a[n];
                        } else {
                            a[n] = a[i];
                        }
                    }
                }
            }
        }

        const unique = (value, index, self) => {
            const findIndex = (element) => element[0] === value[0];
            return self.findIndex(findIndex) === index;
        };

        a = a.filter(unique);

        return a;
    }

    static SolveLinEQ(m) {
        function findNotZeroRow(r) {
            for (let nzr = r + 1; nzr < d; nzr++) {
                if (m[nzr][r] !== 0) return nzr;
            }
            return -1;
        }

        function swapRows(r1, r2) {
            for (let c = 0; c <= d; c++) {
                let tmp = m[r1][c];
                m[r1][c] = m[r2][c];
                m[r2][c] = tmp;
            }
        }

        function normRow(r) {
            // require m[r][r] != 0
            let a = m[r][r];
            if (a === 1) return;
            m[r][r] = 1;
            for (let c = r + 1; c <= d; c++) {
                m[r][c] /= a;
            }
        }

        function zeroCell(zr, zc) {
            let a = m[zr][zc];
            if (a === 0) return;
            m[zr][zc] = 0;
            for (let c = zc + 1; c <= d; c++) {
                m[zr][c] -= a * m[zc][c];
            }
        }

        let d = m.length;
        for (let r = 0; r < d; r++) {
            if (m[r][r] === 0) {
                let nzr = findNotZeroRow(r);
                if (nzr === -1) return false;
                swapRows(r, nzr);
            }
            // assert m[r][r] != 0
            normRow(r);
            for (let zr = 0; zr < d; zr++) {
                if (zr !== r) {
                    zeroCell(zr, r);
                }
            }
        }
        return true;
    }

    prepareEquation(possibleConstants) {
        this.toSolve = [];


        for (let n = 0; n < this.equations.length; n++) {
            this.toSolve.push([]);

            let constant = 0
            for (let i = 0; i < this.equations[n].length; i++) {
                if (i < possibleConstants.length) {
                    constant += this.equations[n][i] * possibleConstants[i];
                    output([this.equations[n][i], possibleConstants[i]])
                    console.log(i)
                    console.log(constant)
                } else {
                    this.toSolve[n].push(this.equations[n][i]);
                }

            }
            this.toSolve[n].push(constant);
        }

        this.toSolve = LGS.uniq(this.toSolve);
        output(possibleConstants)
        output(this.toSolve)

        this.sollutions = [];
        LGS.SolveLinEQ(this.toSolve)
        output(this.toSolve)

        let len = 0
        for (let i = 0; i < this.toSolve.length; i++) {
            for (let n = 0; n < this.toSolve[i].length; n++) {
                if(!Number.isNaN(this.toSolve[i][n])) {
                    if (n > len) {
                        len = n;
                    }
                }
            }
        }

        len++

        let finalList = [];
        for (let i = 0; i < len-1; i++) {
            finalList.push([]);

            for (let n = 0; n < len; n++) {
                output(this.toSolve)
                finalList[i].push(this.toSolve[i][n]);
            }
        }

        this.toSolve = finalList;

        console.log(len)
        output(this.toSolve);

        for (let i = 0; i < this.toSolve.length; i++) {
            if (Number.isInteger(this.toSolve[i][this.toSolve[i].length - 1]) && this.toSolve[i][this.toSolve[i].length - 1] > 0) {
                this.sollutions.push(this.toSolve[i][this.toSolve[i].length - 1]);
            } else {
                return false;
            }
        }

        console.log('successful')
        return true;
    }
}

class Atom {
    constructor(label) {
        this.label = label;
        this.subscript = 1;

        this.changed = false;
    }

    changeSubscript(number) {
        if (!this.changed) {
            this.subscript = number;
            this.changed = true;
            return;
        }

        let subscriptStr = this.subscript.toString();
        subscriptStr += number.toString();
        this.subscript = parseInt(subscriptStr);
    }

    addToLabel(toAdd) {
        this.label += toAdd;
    }
}

class Molecule {
    constructor() {
        this.coefficient = 1;
        this.atoms = [];
    }

    get atomDict() {
        let returnAtomDict = {};

        for (let i = 0; i < this.atoms.length; i++) {
            if (this.atoms[i].label in returnAtomDict) {
                returnAtomDict[this.atoms[i].label] += this.atoms[i].subscript * this.coefficient;
            } else {
                returnAtomDict[this.atoms[i].label] = this.atoms[i].subscript * this.coefficient;
            }
        }
        return returnAtomDict;
    }

    addAtom(atom) {
        this.atoms.push(new Atom(atom));
    }

    changeLastSubscript(subscript) {
        this.atoms[this.atoms.length - 1].changeSubscript(subscript);
    }

    changeLastName(name) {
        this.atoms[this.atoms.length - 1].addToLabel(name);
    }

    getAtomCount(label) {
        let count = 0
        for (let atom of this.atoms) {
            if (atom.label === label) {
                count += atom.subscript;
            }
        }

        return count;
    }

    static subOneDigit(n) {
        switch(n){
            case "1": return '\u2081';
            case "2": return '\u2082';
            case "3": return '\u2083';
            case "4": return '\u2084';
            case "5": return '\u2085';
            case "6": return '\u2086';
            case "7": return '\u2087';
            case "8": return '\u2088';
            case "9": return '\u2089';
            case "0": return '\u2080';
        }
    }

    static intToSubStr(n){
        if(n === undefined) return undefined;

        let result = "";

        const nStr = n.toString();
        for(let i = 0; i < nStr.length; i++) {
            result += this.subOneDigit(nStr[i]);
        }

        return result;
    }

    get moleculeStr() {
        let molStr = ""

        for (let i = 0; i < this.atoms.length; i++) {
            molStr += this.atoms[i].label;
            if (this.atoms[i].subscript !== 1) {
                molStr += Molecule.intToSubStr(this.atoms[i].subscript)
            }
        }

        return molStr;
    }
}

class Equation {
    constructor() {
        this.educt = [new Molecule()];
        this.eductCoefficients = [];

        this.product = [];
        this.productCoefficients = [];
    }

    getSide(isEduct) {
        if (isEduct) {
            return this.educt;
        } else {
            return this.product;
        }
    }

    static getCombinationList(max, len) {

        let refList = [];
        let newList = [];

        for (let i = 1; i <= max; i++) {
            newList.push([i]);
        }


        for (let depth = 1; depth < len; depth++) {
            refList = newList.slice();
            newList = [];

            for (let refInd = 0; refInd < refList.length; refInd++) {
                const refElem = refList[refInd];

                for (let i = 1; i <= max; i++) {
                    let tempList = refElem.slice();
                    tempList.push(i);
                    newList.push(tempList);
                }
            }
        }

        for (let i = 0; i < newList.length; i++) {
            let minInd = i;
            let minWeight = 100000;
            for (let n = i; n < newList.length; n++) {
                let currentWeight = 0;
                for (let m = 0; m < newList[n].length; m++) {
                    currentWeight += newList[n][m];
                }

                if (currentWeight < minWeight) {
                    minWeight = currentWeight;
                    minInd = n;
                }
            }

            const smaller = newList[minInd];
            const bigger = newList[i];

            newList[i] = smaller;
            newList[minInd] = bigger;
        }

        console.log(newList);

        return newList;
    }

    saveStr(inputStr) {
        this.educt = [new Molecule()];
        this.product = [];

        let addToEduct = true;
        let currentInd = 0;

        for (const c of inputStr) {
            switch (c) {
                case ' ':
                    break;
                case '+':
                    currentInd++;
                    this.getSide(addToEduct).push(new Molecule());
                    break;

                case isAlphaOrParen(c.toLowerCase()):
                    this.getSide(addToEduct)[currentInd].changeLastName(c);
                    break;

                case isAlphaOrParen(c.toUpperCase()):
                    this.getSide(addToEduct)[currentInd].addAtom(c);
                    break;

                case parseInt(c).toString():
                    this.getSide(addToEduct)[currentInd].changeLastSubscript(parseInt(c));
                    break;

                case '=':
                    addToEduct = false;
                    currentInd = 0;
                    this.getSide(addToEduct)[currentInd] = new Molecule();
                    break;
            }
        }

        return this.LGS();
    }


    equationStr() {
        let solutionStr = '';

        for (let i = 0; i < this.educt.length; i++) {
            if (i !== 0) {
                solutionStr += ' + '
            }
            if (this.eductCoefficients[i] !== 1) {
                solutionStr +=  this.eductCoefficients[i].toString();
            }

            solutionStr += this.educt[i].moleculeStr;
        }

        if (this.product.length > 0) {
            solutionStr += ' → ';
        } else {
            // #636466
            return '';
        }

        for (let i = 0; i < this.product.length; i++) {
            if (i !== 0) {
                solutionStr += ' + '
            }
            if (this.productCoefficients[i] !== 1) {
                solutionStr +=  this.productCoefficients[i].toString();
            }

            solutionStr += this.product[i].moleculeStr;
        }

        return solutionStr;
    }


    saveCoefficients(coefficients, isEduct) {
        if (isEduct) {
            for (let  i = 0; i < coefficients.length; i++) {
                this.educt[i].coefficient = coefficients[i];
            }
        } else {
            for (let  i = 0; i < coefficients.length; i++) {
                this.product[i].coefficient = coefficients[i];
            }
        }
    }

    get isPossible() {
        let eductDict = {};
        for (let i = 0; i < this.educt.length; i++) {
            const tempDict = this.educt[i].atomDict;
            console.log(tempDict);

            for (let n = 0; n < Object.keys(tempDict).length; n++) {
                const key = Object.keys(tempDict)[n];
                if (key in eductDict) {
                    eductDict[key] += tempDict[key];
                } else {
                    eductDict[key] = tempDict[key];
                }
            }
        }

        let productDict = {};
        for (let i = 0; i < this.product.length; i++) {
            const tempDict = this.product[i].atomDict;
            console.log(tempDict);

            for (let n = 0; n < Object.keys(tempDict).length; n++) {
                const key = Object.keys(tempDict)[n];
                if (key in productDict) {
                    productDict[key] += tempDict[key];
                } else {
                    productDict[key] = tempDict[key];
                }
            }
        }

        console.log(eductDict, productDict);

        if (Object.keys(eductDict).length !== Object.keys(productDict).length) {
            return false;
        }

        for (let i = 0; i < Object.keys(eductDict).length; i++) {
            const key = Object.keys(eductDict);

            if (!(eductDict[key] === productDict[key])) {
                return false;
            }
        }
        return true;
    }

    LGS() {
        let merged = this.educt.concat(this.product);
        let lgs = new LGS(merged.length);

        console.log(merged)

        for (let askInd = 0; askInd < this.educt.length; askInd++) {
            const atomList = this.educt[askInd].atoms;

            for (let a = 0; a < atomList.length; a++) {
                const atom = atomList[a];

                lgs.addEquation(askInd, atom.subscript);

                for (let i = 0; i < merged.length; i++) {
                    if (i !== askInd) {
                        if (i < this.educt.length) {
                            lgs.editEquation(i, merged[i].getAtomCount(atom.label));
                        } else {
                            lgs.editEquation(i, merged[i].getAtomCount(atom.label));
                        }
                    }
                }
            }
        }

        // get a list for all trys of the left side
        const possibleCombinations = Equation.getCombinationList(25, this.educt.length);

        let isInvalid = true;

        for (let i = 0; i < possibleCombinations.length; i++) {
            if (lgs.prepareEquation(possibleCombinations[i])) {
                this.eductCoefficients = possibleCombinations[i];
                this.saveCoefficients(possibleCombinations[i], true);
                isInvalid = false;
                break;
            }
        }

        if (isInvalid) {
            return 'invalid';
        }

        this.productCoefficients = lgs.sollutions;
        this.saveCoefficients(lgs.sollutions, false);
        console.log(this.eductCoefficients);
        console.log(this.productCoefficients);

        if (!this.isPossible) {
            return "weights don't match";
        }

        return this.equationStr();
    }
}

inputEqu = new Equation();

inputObj.value = '';
updateEquation();

inputObj.addEventListener('change', updateEquation);
function updateEquation() {
    outputObj.value = inputEqu.saveStr(inputObj.value)
}
