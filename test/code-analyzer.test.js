import assert from 'assert';
import {allNodes, hirracy, init, parseCode, Starter} from '../src/js/code-analyzer';


// describe('The javascript parser',() => {
//     it('is parsing an empty function correctly', () => {
//         assert.equal(
//             JSON.stringify(parseCode('')),
//             '{"type":"Program","body":[],"sourceType":"script"}'
//         );
//     });
//
//     it('is parsing a simple variable declaration correctly', () => {
//         assert.equal(
//             JSON.stringify(parseCode('let a = 1;')),
//             '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a"},"init":{"type":"Literal","value":1,"raw":"1"}}],"kind":"let"}],"sourceType":"script"}'
//         );
//     });
//
// });

describe('TEST',() => {
    it('TEST1', () => {
        init();
        let s='';
        let code = 'function foo(x, y, z){\n' + '    let a = x + 1;\n' + '    let b = a + y;\n' + '    let c = 0;\n' + '    \n' + '    if (b < z) {\n' + '        c = c + 5;\n' + '    } else if (b < z * 2) {\n' + '        c = c + x + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n';
        let parse = parseCode(code);
        Starter(parse);
        for(let i=0;i<allNodes.length;i++) s=s+allNodes[i];s=s+'\n';
        for(let i=0;i<hirracy.length;i++) s=s+hirracy[i];
        assert.equal(s,'st=>start: Start\nop1=>operation: **1**\na=x + 1\n\nop2=>operation: **2**\nb=a + y\n\nop3=>operation: **3**\nc=0\n\ncond1=>condition: **4**\nb < z\nop4=>operation: **' +
            '5**\nc = c + 5\ncond2=>condition: **6**\nb < z * 2\nop5=>operation: **7**\nc = c + x + 5\nop6=>operation: **8**\nc = c + z + 5\nop7=>operation: **9**return c\nundefined->op1->op2->op3->' +
            'cond1\ncond1(yes,right)->op4\ncond1(no,left)->cond2\ncond2(yes,right)->op5\ncond2(no,left)->op6->op7');
    });
});
describe('TEST',() => {
    it('TEST2', () => {
        init();
        let s='';
        let code = 'function foo(x, y, z){\n' +
             'if(x>y)\n' +
             '{a=a+1;}\n' +
             'return z;}';
        let parse = parseCode(code);
        Starter(parse);
        for(let i=0;i<allNodes.length;i++) s=s+allNodes[i];s=s+'\n';
        for(let i=0;i<hirracy.length;i++) s=s+hirracy[i];
        assert.equal(s,'st=>start: Start\ncond1=>condition: **1**\nx > y\nop1=>operation: **2**\na = a + 1\nop2=>operation: **3**return z\nundefined->cond1\ncond1(yes,right)->op1->op2');
    });
});
describe('TEST',() => {
    it('TEST3', () => {
        init();
        let code = 'function foo(x, y, z){\n' +
            'while(x>y)\n' +
            '{a=a+1;}\n' +
            'return z;}';
        let parse = parseCode(code);
        Starter(parse);
        let s='';
        for(let i=0;i<allNodes.length;i++) s=s+allNodes[i];s=s+'\n';
        for(let i=0;i<hirracy.length;i++) s=s+hirracy[i];
        assert.equal(s,'st=>start: Start\ncond0=>condition: **1**\nx > y\nop2=>operation: **2**\na = a + 1\nop3=>operation: **3**return z\nundefined->cond0\n cond0(yes)->op2->cond0\n cond0(n' +
            'o)->op3');
    });
});
describe('TEST',() => {
    it('TEST4', () => {
        init();
        let code='function foo(x, y, z){\n' + 'let a=x+1;\n' + 'let b=b+1;\n' + 'let c=3;\n' + '}';
        let parse = parseCode(code);
        Starter(parse);
        let s='';
        for(let i=0;i<allNodes.length;i++) s=s+allNodes[i];s=s+'\n';
        for(let i=0;i<hirracy.length;i++) s=s+hirracy[i];
        assert.equal(s,'st=>start: Start\nop1=>operation: **1**\na=x + 1\n\nop2=>operation: **2**\nb=b + 1\n\nop3=>operation: **3**\nc=3\n\n\nundefined->op1->op2->op3');
    });
});
describe('TEST',() => {
    it('TEST5', () => {
        init();
        let code = 'function f(x,z){\n' +
            'if(x>y)\n' +
            '{c=c+5;}\n' +
            'else{c=c+2;}\n' +
            'return z;\n' +
            '}';
        let parse = parseCode(code);
        Starter(parse);
        let s='';
        for(let i=0;i<allNodes.length;i++) s=s+allNodes[i];s=s+'\n';
        for(let i=0;i<hirracy.length;i++) s=s+hirracy[i];
        assert.equal(s,'st=>start: Start\ncond1=>condition: **1**\nx > y\nop1=>operation: **2**\nc = c + 5\nop2=>operation: **3**\nc = c + 2\nop3=>operation: **4**return z\nundefined->cond1\n' +
            'cond1(yes,right)->op1\ncond1(no,left)->op2->op3');
    });
});
describe('TEST',() => {
    it('TEST7', () => {
        init();
        let code = 'function f(x,z){\n' +
            'if(x>y)\n' +
            '{c=c+5;}\n' +
            'else if(x>2)\n' +
            '{c=2;}\n' +
            'return z;\n' +
            '}';
        let parse = parseCode(code);
        Starter(parse);
        let s='';
        for(let i=0;i<allNodes.length;i++) s=s+allNodes[i];s=s+'\n';
        for(let i=0;i<hirracy.length;i++) s=s+hirracy[i];
        assert.equal(s,'st=>start: Start\ncond1=>condition: **1**\nx > y\nop1=>operation: **2**\nc = c + 5\ncond2=>condition: **3**\nx > 2\nop2=>operation: **4**\nc = 2\nop3=>operation: **5*' +
            '*return z\nundefined->cond1\ncond1(yes,right)->op1\ncond1(no,left)->cond2\ncond2(yes,right)->op2->op3');});
});
describe('TEST',() => {
    it('TEST8', () => {
        init();
        let code = 'function x(y) {y = 4; return y;}';
        let parse = parseCode(code);
        Starter(parse);
        let s='';
        for(let i=0;i<allNodes.length;i++) s=s+allNodes[i];s=s+'\n';
        for(let i=0;i<hirracy.length;i++) s=s+hirracy[i];
        assert.equal(s,'st=>start: Start\nop1=>operation: **1**\ny = 4\nop2=>operation: **2**return y\nundefined->op1->op2');

    });
});
describe('TEST',() => {
    it('TEST7', () => {
        init();
        let code = 'function foo(x, y, z){\n' + '   let a = x + 1;\n' + '   let b = a + y;\n' + '   let c = 0;\n' + '   \n' +
            '   while (a < z) {\n' +
            '       c = a + b;\n' + '       z = c * 2;\n' +
            '       a=a+1;\n' +
            '   }\n' +
            '   \n' +
            '   return z;\n' +
            '}\n';
        let parse = parseCode(code);
        Starter(parse);
        let s='';
        for(let i=0;i<allNodes.length;i++) s=s+allNodes[i];s=s+'\n';
        for(let i=0;i<hirracy.length;i++) s=s+hirracy[i];
        assert.equal(s,'st=>start: Start\nop1=>operation: **1**\na=x + 1\n\nop2=>operation: **2**\nb=a + y\n\nop3=>operation: **3**\nc=0\n\ncond0=>condition: **4**\na < z\nop5=>operation: **' +
            '5**\nc = a + b\nop6=>operation: **6**\nz = c * 2\nop7=>operation: **7**\na = a + 1\nop8=>operation: **8**return z\nundefined->op1->op2->op3->cond0\n cond0(yes)->op5->op6->op7->cond0\n c' +
            'ond0(no)->op8');});
});
describe('TEST',() => {
    it('TEST10', () => {
        init();
        let code = '{x=x+1;\n' +
            'l=l=1;}';
        let parse = parseCode(code);
        Starter(parse);
        let s='';
        for(let i=0;i<allNodes.length;i++) s=s+allNodes[i];s=s+'\n';
        for(let i=0;i<hirracy.length;i++) s=s+hirracy[i];
        assert.equal(s,'st=>start: Start\nop1=>operation: **1**\nx = x + 1\nop2=>operation: **2**\nl = l = 1\n\nundefined->op1->op2');
    });
});
describe('TEST',() => {
    it('TEST11', () => {

        init();
        let code = 'let x=1;';
        let parse = parseCode(code);
        Starter(parse);
        let s='';
        for(let i=0;i<allNodes.length;i++) s=s+allNodes[i];s=s+'\n';
        for(let i=0;i<hirracy.length;i++) s=s+hirracy[i];
        assert.equal(s,'st=>start: Start\nop1=>operation: **1**\nx=1\n\n\nundefined->op1');
    });
});
describe('TEST',() => {
    it('TEST12', () => {
        init();
        let code = 'function x(x)\n' +
            '{let x=a+1;}';
        let parse = parseCode(code);
        Starter(parse);
        let s='';
        for(let i=0;i<allNodes.length;i++) s=s+allNodes[i];s=s+'\n';
        for(let i=0;i<hirracy.length;i++) s=s+hirracy[i];
        assert.equal(s,'st=>start: Start\nop1=>operation: **1**\nx=a + 1\n\n\nundefined->op1');
    });
});
describe('TEST',() => {
    it('TEST13', () => {
        init();
        let code='function foo(x, y, z){\n' + '    let a = x + 1;\n' + '    let b = a + y;\n' + '    let c = 0;\n' +
            '    \n' + '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '        b=b+1}\n' +
            'return z;}\n';
        let parse = parseCode(code);
        Starter(parse);
        let s='';
        for(let i=0;i<allNodes.length;i++) s=s+allNodes[i];s=s+'\n';
        for(let i=0;i<hirracy.length;i++) s=s+hirracy[i];
        assert.equal(s,'st=>start: Start\nop1=>operation: **1**\na=x + 1\n\nop2=>operation: **2**\nb=a + y\n\nop3=>operation: **3**\nc=0\n\ncond1=>condition: **4**\nb < z\nop4=>operation: **' +
            '5**\nc = c + 5\ncond2=>condition: **6**\nb < z * 2\nop5=>operation: **7**\nc = c + x + 5\nop6=>operation: **8**\nb = b + 1\nop7=>operation: **9**return z\nundefined->op1->op2->op3->cond' +
            '1\ncond1(yes,right)->op4\ncond1(no,left)->cond2\ncond2(yes,right)->op5->op6->op7');
    });
});
describe('TEST',() => {
    it('TEST14', () => {
        init();
        let code='function foo(x, y, z){\n' +
            '    let a;\n' +
            '    let b=1;\n' +
            '    return c;\n' +
            '}\n';
        let parse = parseCode(code);
        Starter(parse);
        let s='';
        for(let i=0;i<allNodes.length;i++) s=s+allNodes[i];s=s+'\n';
        for(let i=0;i<hirracy.length;i++) s=s+hirracy[i];
        assert.equal(s,'st=>start: Start\nop1=>operation: **1**\na\n\nop2=>operation: **2**\nb=1\n\nop3=>operation: **3**return c\nundefined->op1->op2->op3');
    });
});
describe('TEST',() => {
    it('TEST15', () => {
        init();
        let code='a=1;';
        let parse = parseCode(code);
        Starter(parse);
        let s='';
        for(let i=0;i<allNodes.length;i++) s=s+allNodes[i];s=s+'\n';
        for(let i=0;i<hirracy.length;i++) s=s+hirracy[i];
        assert.equal(s,'st=>start: Start\nop1=>operation: **1**\na = 1\n\nundefined->op1');
    });
});