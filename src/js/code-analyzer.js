import * as esprima   from 'esprima';
import * as escodegen from 'escodegen';

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,{loc: true});
};

function Splice_body (program_tree)
{
    let body = program_tree['body'];
    var i=0;
    while(i<body.length){
        var j=Starter(body[i]);
        if(j==-1){body.splice(i,1);}
        else i++;
    }
}
function FunctionDEC_PARSER(program_tree){
    let parameters = program_tree['params'];
    for(var i=0; i<parameters.length;i++){Starter(parameters[i]);}
    let body = program_tree['body'];
    Splice_body(body);
}
// function LITERAL_PARSER(program_tree){ if(program_tree=='nothing') return 0; else return 0;}

function Identifier_PARSER(){  return 0; }
//if(program_tree!='nothing')
//==
// else return 0 ;

let dont_remove = false;

function identifier(val) {
    if (while_mod && left_vars.includes(val.name))
        dont_remove = true;
    if (current_env.get(val.name) != null) {
        return find_identifier_and_replace(current_env.get(val.name));
    }
    else hasIdentifiers = false;
    return val;
}

function find_identifier_and_replace(val){

    if(val.type ==='BinaryExpression') {
        if(val.left.type==='Identifier') val.left = identifier(val.left);
        else val.left = find_identifier_and_replace(val.left);
        if(val.right.type==='Identifier') val.right = identifier(val.right);
        else val.right = find_identifier_and_replace(val.right);
    }
    return val;
}

function clone_map(arr){
    let arr2 = new Map();
    for(var [key,val] of arr) {
        arr2.set(key,JSON.parse(JSON.stringify(val)));
    }// console.log("cloned");
    // console.log(arr2);
    return arr2;
}
var hasIdentifiers;
function VarDEC_PARSER(program_tree) {
    let declarations_extract = program_tree['declarations'];
    for(var j=0; j<declarations_extract.length;j++) {
        hasIdentifiers = true;
        declarations_extract[j].init = find_identifier_and_replace(declarations_extract[j].init);
        if (hasIdentifiers)
            declarations_extract[j].init = esprima.
                parseScript(eval(escodegen.generate(declarations_extract[j].init))+';').body[0].expression;
        current_env.set(declarations_extract[j].id.name, declarations_extract[j].init);
    }
    return -1;
}

// function VariableDeclarator() {}
function ExpState(program_tree) {
    let exp=program_tree ['expression'];
    //  console.log(exp);
    return Starter(exp);
}
function AssExp(program_tree) {
    hasIdentifiers = true;
    program_tree.right = find_identifier_and_replace(program_tree.right);
    if (hasIdentifiers) {
        let right_gen_string = escodegen.generate(program_tree.right);
        if(!isNaN(right_gen_string)) program_tree.right = esprima.parseScript(eval(right_gen_string) + ';').body[0].expression;
    }
    //console.log(program_tree.right);
    current_env.set(program_tree.left.name, program_tree.right);
    return -1;
}
function IfStatement_PARSER(program_tree)
{

    let body=program_tree['consequent'];
    program_tree['test'] = find_identifier_and_replace(program_tree['test']);

    clones.push(current_env);
    current_env = clone_map(current_env);
    Starter(body);
    current_env = clones.pop();

    if(program_tree['alternate']!==null)
        Starter(program_tree['alternate']);
    return 0;
}

let left_vars = [], while_mod = false;
function WhileExp_PARSER(program_tree) {
    let body = program_tree.body.body;
    program_tree.test = find_identifier_and_replace(program_tree.test);
    clones.push(current_env);
    current_env = clone_map(current_env);
    left_vars = []; while_mod = true;
    for(var i=0;i<body.length;i++)
    {
        // if(body[i].type=='ExpressionStatement')
        left_vars.push(body[i].expression.left.name);
    }
    Starter( program_tree.body); while_mod = false;
    current_env = clones.pop();
    return 0;
}
// function BinaryExpression(program_tree){
//     Starter(program_tree.right);
//     Starter(program_tree.left);
//     return 0;
// }

function Return_PARSER(program_tree){
    program_tree.argument = find_identifier_and_replace(program_tree.argument);
}
// function Update_EXP(program_tree) {
//     //let operator = program_tree['operator'];
//     //let s = escodegen.generate(program_tree['argument']);
//     //let final_value = s + operator;
//     if(program_tree=='nothing') return 0; else return 0 ;
//     //   array.push({line:program_tree['loc']['start']['line'], type:'Update Expression',name:'',condition:'',value:final_value});
// }
// const TYPE_MAP_FUNC = {FunctionDeclaration: FunctionDEC_PARSER, VariableDeclaration:VarDEC_PARSER,Identifier:Identifier_PARSER,AssignmentExpression: AssExp,Literal:LITERAL_PARSER,BinaryExpression: BinaryExpression,
//     ExpressionStatement: ExpState,WhileStatement: WhileExp_PARSER,IfStatement: IfStatement_PARSER,
//     BlockStatement: Splice_body,VariableDeclarator:VariableDeclarator, ReturnStatement: Return_PARSER, UpdateExpression:Update_EXP};

const TYPE_MAP_FUNC = {FunctionDeclaration: FunctionDEC_PARSER, VariableDeclaration:VarDEC_PARSER,Identifier:Identifier_PARSER,AssignmentExpression: AssExp,
    ExpressionStatement: ExpState,WhileStatement: WhileExp_PARSER,IfStatement: IfStatement_PARSER,
    BlockStatement: Splice_body, ReturnStatement: Return_PARSER};

function Starter(program_tree){

    let type = program_tree['type'];
    if(type === 'Program') {
        Splice_body(program_tree);
    }
    else if(type === 'IfStatement') IfStatement_PARSER(program_tree);
    else {
        let x = TYPE_MAP_FUNC[type](program_tree);
        if(dont_remove){
            dont_remove = false;
        }
        else if(x == -1) return-1;
    }
    return program_tree;
}
let clones = [], current_env = new Map();


// --------------------------------------------------------------------------------------------------------------------------------------







function KingOfTheTraversals(string,expression,table){
    if(expression !== null) {
        let typeo = expression['type'];
        if (typeo === 'BlockStatement')
        {

            for(let h = 0 ; h<expression['body'].length; h++){
                KingOfTheTraversals(string,expression['body'][h],table);
            }



        }
        else if (typeo === 'IfStatement') EvaluationOfIfStatment(string,expression,table);
    }
}





function extract_function(subtitutedFunction){
    let body = subtitutedFunction['body'];
    for(let y = 0; y<body.length ; y++)  return body[y];

}

//if(body[y]['type'] === 'FunctionDeclaration')
//return null



function GenerateHtmlCode(subtitutedFunction, InputVector){
    let TableOfParameters = [];

    let CommaSplitting = InputVector.split(',');
    let fu = extract_function(subtitutedFunction);
    let parms = fu['params'];

    for(let j = 0; j<parms.length; j++) TableOfParameters.push(new Objectable(escodegen.generate(parms[j]),CommaSplitting[j],'parameter'));
    fu = parseCode(escodegen.generate(fu));

    let string = (escodegen.generate(fu)).split('\n');
    KingOfTheTraversals(string,fu['body'][0]['body'],TableOfParameters);

    let CODE = '<pre>';
    for(let y = 0; y<string.length; y++) {
        CODE += string[y] + '\n';
    }
    return CODE + '</pre>';

}



function Substiution(string,table){
    let commaspliter = string.split(' ');
    let stringsubber = '';


    for(let j = 0; j<commaspliter.length; j++){
        let value = valuextracter(commaspliter[j],table);
        //if(value !== null && value.length>1) stringsubber = stringsubber + '(' + value + ')' + ' ';
        if(value!== null) stringsubber = stringsubber + value + ' '; //else
        else stringsubber = stringsubber + commaspliter[j] + ' ';
    }
    return stringsubber.slice(0,stringsubber.length-1);
}
function EvaluationOfIfStatment(string,expression,table){

    let testo = escodegen.generate(expression['test']);

    let Evaluation = eval(Substiution(testo,table));
    let line = expression['loc']['start']['line']-1;
    if(Evaluation) string[line] = '<strong style="color:green">' + string[line] + '</strong>';
    else string[line] = '<strong style="color:red">' + string[line] + '</strong>';

    let con = expression['consequent'];
    KingOfTheTraversals(string,con,table);
    if(!Evaluation) KingOfTheTraversals(string,expression['alternate'],table);
}
function valuextracter(name,table){
    for(let y = 0; y<table.length; y++) {
        if(table[y]['variable'] === name) return table[y]['value'];
    }
    return null;
}
function Objectable(variable, value, type){
    this.variable = variable;
    this.value = value;
    this.type = type;
}
export {parseCode, Starter,GenerateHtmlCode};