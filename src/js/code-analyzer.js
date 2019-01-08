import * as esprima   from 'esprima';
import * as escodegen from 'escodegen';
let opIndex=0;
let conIndex=0;
let arrIndex=0;
let allNodes=[];
allNodes[0]='st=>start: Start' + '\n';
let hirrIndex=0;
let hirracy=[];
hirracy[0] = 'st';
const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,{loc: true});
};
function init()
{
    opIndex=0;
    conIndex=0;
    arrIndex=0;
    allNodes=[];
    allNodes[0]='st=>start: Start' + '\n';
    hirrIndex=0;
    hirracy=[];
}
function Splice_body(program_tree)
{   let body = program_tree['body'];
    let i=0;
    while(i<body.length){
        Starter(body[i]);i++;}
}
function Return_PARSER(program_tree) {
    opIndex++;
    arrIndex++;
    allNodes[arrIndex]='op'+opIndex + '=>operation: '+'**'+arrIndex+'**'+'return ' + escodegen.generate(program_tree.argument);
    hirrIndex++;
    hirracy[hirrIndex] ='->op'+opIndex;
}
function Consequent_PARSER(program_tree)
{
    // if(program_tree.type==='BlockStatement')
    Splice_body(program_tree);
    // else {
    //     if(program_tree.type==='ReturnStatement')
    //         Return_PARSER(program_tree);
    // else if(program_tree.type==='AssignmentExpression')
    //     AssExp(program_tree);
}
function IfStatement_PARSER(program_tree) {
    conIndex++;
    arrIndex++;
    let test = escodegen.generate(program_tree['test']);
    let cond = 'cond' + conIndex+'=>condition: '+'**'+arrIndex+'**'+'\n'+ test+'\n';
    allNodes[arrIndex] = cond;
    hirrIndex++;
    hirracy[hirrIndex]='->cond'+conIndex;
    hirrIndex++;
    hirracy[hirrIndex] ='\n'+'cond'+conIndex+'(yes,right)';
    Consequent_PARSER(program_tree['consequent']);
    if (program_tree['alternate'] !== null) {
        hirrIndex++;
        hirracy[hirrIndex]='\n'+'cond' +conIndex+ '(no,left)';
        AltOfIf(program_tree['alternate']);   }}
function AltOfIf(program_tree) {
    if(program_tree.type==='IfStatement')
        IfStatement_PARSER(program_tree);
    if (program_tree.type === 'BlockStatement') {
        Splice_body(program_tree);
    }
}
function WhileExp_PARSER(program_tree) {// arrIndex++;
    opIndex++;// allNodes[arrIndex] = 'op' + opIndex + '=>operation: '+'**'+arrIndex+'\n'+'**'+ 'NULL' + '\n';
    hirrIndex++;
    hirracy[hirrIndex] = '->op' + opIndex;
    arrIndex++;
    let cond = 'cond' + conIndex + '=>condition: '+'**'+arrIndex+'**'+'\n' + escodegen.generate(program_tree['test']) + '\n';
    let temp = conIndex;
    hirrIndex;
    hirracy[hirrIndex]='->cond' + conIndex;
    // arrIndex++;
    allNodes[arrIndex] = cond;hirrIndex++;
    hirracy[hirrIndex] = '\n cond' + conIndex + '(yes)';
    Splice_body(program_tree['body']);
    hirrIndex++;
    hirracy[hirrIndex] = '->cond' + temp;
    hirrIndex++;
    hirracy[hirrIndex] = '\n cond' + conIndex + '(no)';
    conIndex++;
}
function AssExp(program_tree) {
    arrIndex++;
    opIndex++;
    allNodes[arrIndex]= 'op' + opIndex + '=>operation: '+'**'+arrIndex+'**'+'\n'+ program_tree['left']['name'] + ' = ' +  escodegen.generate(program_tree['right'])+ '\n';
    hirrIndex++;
    hirracy[hirrIndex] = '->'+'op' + opIndex;
}
function DEC_PARSER(program_tree) {
    let val = '';
    let data = '';
    let variable =program_tree.declarations[0]['id']['name'];
    if (program_tree.declarations[0]['init'] != null) {
        val = escodegen.generate(program_tree['declarations'][0].init);
        data = data + variable + '=' + val + '\n';}
    else
        data = data + variable + '\n';
    arrIndex++;
    opIndex++;
    allNodes[arrIndex] = 'op' + opIndex + '=>operation: '+'**'+arrIndex+'**'+'\n' + data + '\n';
    hirrIndex++;
    hirracy[hirrIndex] = '->' + 'op' + opIndex;
}
function ExpState(program_tree) {
    let exp=program_tree ['expression'];
    Starter(exp);}//AssExp(exp)
function typetest(program_tree)
{
    let type=program_tree.type;
    if(type === 'FunctionDeclaration') Splice_body(program_tree.body);
    else if(type === 'WhileStatement') WhileExp_PARSER(program_tree);
    else if(type === 'BlockStatement') Splice_body(program_tree);
    else if(type === 'IfStatement') IfStatement_PARSER(program_tree);     }
function  typedef2(program_tree)
{ let type=program_tree.type;
    if(type === 'ExpressionStatement') ExpState(program_tree);
    else if(type === 'ReturnStatement') Return_PARSER(program_tree);
    else if(type === 'AssignmentExpression') AssExp(program_tree);
    else if(type === 'VariableDeclaration') DEC_PARSER(program_tree);
}
function Starter(program_tree) {
    let type = program_tree['type'];
    if (type === 'Program') {
        Splice_body(program_tree);
    }
    typedef2(program_tree) ;
    typetest(program_tree) ;

}
export {Starter,allNodes,hirracy,parseCode,init};