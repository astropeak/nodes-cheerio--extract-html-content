var fs = require('fs');
var cheerio = require('cheerio');

var iconv = require('iconv-lite');  
// Unit_3-3-1（1）.html


function parseFile (file, RST) {
    var myHtml = fs.readFileSync(file);
    var $ = cheerio.load(iconv.decode(myHtml, 'gbk'));

    var t = $('html').find('hr');
    var t2 = t.nextAll();

    console.log('####### processing '+file);
    t2.each(function(i, elem) {
        getContent($(this));
    });

    // console.log('hr length: '+ t.length);
    function getContent(node){
        var a = node.contents();
        if (a.length == 0) {
            if (node.is('input')){
                var t ='';
                for(var i=0;i<node.attr('size');i++){
                    t+='_';
                }
                // console.log("input: "+t);
                RST+=t;
            } else if (node.is('br')){
                RST+='\n';
            } else if (node.parent().is('span.STYLE4')){
                RST+=' '+node.text().trim()+' ';
            }
            else {
                var t = node.text().trim();
                // var t = node.text();
                // t.replace(/\s*$/,'');
                if (t !== '') {
                    // console.log("text: "+t);
                    RST+=t;
                }
            }
        } else {
            // remove answer node
            if (node.is('span.answerfont')){
                return;
            }
            // remove dialog for task 4
            if (node.is('div#textlayer1')){
                return;
            }

            node.contents().each(function(i, elem){
                getContent($(this));
            });

            if (node.is('p') || node.is('tr')){
                RST+='\n\n';
            }
        }
    }

    return RST;
}

// var N[8][5];
for(var i=1;i<=8;i++){
    var rst='';
    for(var j=3;j<=7;j++){
        name = 'Unit_'+i+'-3-1（'+j+'）.html';
        if (j == 6){
            name = 'Unit_'+i+'-3-1('+j+').html';
            rst += "Task 4:\n";
        }
        console.log(name);
        rst += parseFile('/Users/astropeak/Desktop/english/Unit_'+i+'/'+name, '');
        rst += '\n\n';
    }
    fs.writeFileSync('unit'+i+'.txt', rst);
}


// parseFile('3313.html');
// console.log(parseFile('Unit_2-3-1（3）.html', ''));
// console.log(parseFile('Unit_2-3-1（4）.html', ''));
// parseFile('Unit_2-3-1（5）.html');
// // parseFile('Unit_2-3-1（6）.html');
// parseFile('Unit_2-3-1（7）.html');

// parseFile('Unit_3-3-1（3）.html');
// parseFile('Unit_3-3-1（4）.html');
// parseFile('Unit_3-3-1（5）.html');
// // parseFile('Unit_3-3-1（6）.html');
// parseFile('Unit_3-3-1（7）.html');


// var gbk_to_utf8 = new Iconv('GBK', 'UTF8');

// var buffer = gbk_to_utf8.convert(fs.readFileSync('path/to/gbkencodefile'));

// console.log(buffer.toString());

// var myHtml = fs.readFileSync('Unit_3-3-1（7）.html');
// var str = iconv.decode(myHtml, 'gbk');

// // var myHtml = fs.readFileSync('Unit_3-3-1（7）.html', 'chinese-iso-8bit-dos');
// console.log(str);
