import $ from 'jquery';
import {parseCode,Starter} from './code-analyzer';

function html_t_s(array){
    let html = '<table border = 1>';
    html += '<tr> <td> Line </td>  <td> Type </td> <td> Name </td> <td> Condition </td> <td> Value </td> </tr>';
    for (var i=0;i<array.length;i++) {
        html += '<tr>';
        for (var k in array[i]) {
            if(array[i].hasOwnProperty(k)) html += '<td>' + array[i][k] + '</td>';
        }
        html += '</tr>';
    }
    html+='</table>';

    return html;
}

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let array = [];
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        Starter(parsedCode,array);
        //   $('#parsedCode').val(JSON.stringify(array, null, 2));
        document.write(html_t_s(array));
    });
});
