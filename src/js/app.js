import $ from 'jquery';
import {parseCode,Starter,allNodes,hirracy,init} from './code-analyzer';
//json-summary
$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        const flowchart = require('flowchart.js');
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);init();Starter(parsedCode);
        let s='';
        for(let i=0;i<allNodes.length;i++) s=s+allNodes[i];s=s+'\n';
        for(let i=0;i<hirracy.length;i++) s=s+hirracy[i];
        init();
        var diagram = flowchart.parse(s);
        diagram.drawSVG('diagram', {'x': 0, 'y': 0, 'line-width': 3,
            'line-length': 50, 'text-margin': 10,
            'font-size': 14, 'font-color': 'black',
            'line-color': 'black', 'element-color': 'black',
            'fill': 'white', 'yes-text': 'T',
            'no-text': 'F', 'arrow-end': 'block',
            'scale': 1, 'symbols': {'start': {'font-color': 'black', 'element-color': 'red', 'fill': 'white', 'font-size': 16, 'line-width': 4}, 'end': { 'class': 'end-element'}},
            'flowstate': {'color': {'fill': 'green', 'font-size': 14},}});
    });
});