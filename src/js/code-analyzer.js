import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,{loc: true});
};

function FunctionDEC_PARSER(program_tree,array){
    array.push({line: program_tree['loc']['start']['line'], type:program_tree['type'],name:program_tree['id']['name'],condition:'',value:''});
    let parameters = program_tree['params'];
    for(var i=0; i<parameters.length;i++){Starter(parameters[i],array);}
    let body = program_tree['body'];
    Starter(body,array);
}
function For_PARSER(program_tree,array)
{
    let s= escodegen.generate(program_tree['init'])+escodegen.generate(program_tree['test'])+';'+escodegen.generate(program_tree['update']);
    array.push({line:program_tree['loc']['start']['line'], type:'For Statement',name:'',condition:s,value:''});
    Starter(program_tree['body'],array);

}
function Identifier_PARSER(program_tree,array){
    array.push({line:program_tree['loc']['start']['line'], type:'Variable Declaration',name:program_tree['name'],condition:'',Value:''});
}
function VarDEC_PARSER(program_tree,array) {
    let declarations_extract = program_tree['declarations'];
    for(var j=0; j<declarations_extract.length;j++) Starter(declarations_extract[j],array);
}

function VariableDeclarator(program_tree,array) {
    if(program_tree['init'] !== null) array.push({line:program_tree['loc']['start']['line'], type:'Variable Declaration',name:program_tree['id']['name'],condition:'', Value:escodegen.generate(program_tree['init'])});
    else array.push({line:program_tree['loc']['start']['line'], type:'Variable Declaration',name:program_tree['id']['name'],condition:'', Value:'null'});
}
function ExpState(program_tree,array) {
    let exp=program_tree ['expression'];
    Starter(exp,array);
}

function AssExp(program_tree,array) {
    array.push({line:program_tree['loc']['start']['line'], type:'Assignment Expression',name:program_tree['left']['name'],condition:'', Value:escodegen.generate(program_tree['right'])});
}
function IfStatement_PARSER(program_tree,array,value)
{
    if(value === 7)
        array.push({line:program_tree['loc']['start']['line'], type:'else if statement',name:'',condition:escodegen.generate(program_tree['test']),value:''});
    else array.push({line:program_tree['loc']['start']['line'], type:'if statement',name:'',condition:escodegen.generate(program_tree['test']),value:''});
    let body=program_tree['consequent'];
    Starter(body,array);
    if(program_tree['alternate']!==null)
        Starter(program_tree['alternate'],array,7);


}
function WhileExp_PARSER(program_tree,array){
    array.push({line:program_tree['loc']['start']['line'], type:'while statement',name:'',condition:escodegen.generate(program_tree['test']),value:''});
    let body= program_tree['body'];
    Starter(body,array);
}
function BlockSt_PARSER(program_tree,array){
    let body=program_tree['body'];
    for(var i=0;i<body.length;i++)
        Starter(body[i],array);
}
function Return_PARSER(program_tree,array)
{
    array.push({line:program_tree['loc']['start']['line'], type:'return statement',name:'',condition:'',value:escodegen.generate(program_tree['argument'])});
}
function Update_EXP(program_tree,array)
{array.push({line:program_tree['loc']['start']['line'], type:'Update Expression',name:'',condition:'',value:escodegen.generate(program_tree['argument'])});
}
const TYPE_MAP_FUNC = {FunctionDeclaration: FunctionDEC_PARSER, Identifier:Identifier_PARSER, VariableDeclaration:VarDEC_PARSER,UpdateExpression:Update_EXP,
    VariableDeclarator:VariableDeclarator, ExpressionStatement: ExpState, AssignmentExpression: AssExp,WhileStatement: WhileExp_PARSER,IfStatement: IfStatement_PARSER, ReturnStatement: Return_PARSER, BlockStatement: BlockSt_PARSER,ForStatement :For_PARSER};

function Starter(program_tree,array,value){

    let type = program_tree['type'];
    if(type === 'Program') Starter(program_tree['body'][0],array);
    else if(type === 'IfStatement') IfStatement_PARSER(program_tree,array,value);
    else TYPE_MAP_FUNC[type](program_tree,array);
}

export {parseCode, Starter};
