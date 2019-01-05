import $ from 'jquery';
import {parseCode,Starter,GenerateHtmlCode} from './code-analyzer';
import * as escodegen from 'escodegen';
$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        // let array = [];
        let codeToParse = $('#codePlaceholder').val();
        let input2 = $('#Input').val();
        // Input = $('#Input').val();
        let parsedCode = parseCode(codeToParse);
        //Substitue(parsedCode);
        // Starter(parsedCode,array);
        // console.log(parseCode(codeToParse));
        let x = Starter(parsedCode);
        let y = GenerateHtmlCode(x,input2);
        // console.log(x);
        $('#Input').val(escodegen.generate(x));
        document.write(y);
        //$('#Input').val(escodegen.generate(parsedCode));
    });
});
