fs = require('fs')
under = require('underscore')
path = require('path')

fs.watch('wrestling/static/templates', function(event, fileName) {
    if ( '.html' == path.extname(fileName) ) {
        console.log('Received a change on '+ fileName +'...');
        var templ = fs.readFileSync('wrestling/static/templates/'+ fileName).toString();
        var html_name = path.basename(fileName, '.html');
        fs.writeFileSync('wrestling/static/templates/_compiled/'+ html_name +'.js', 'var '+ html_name.replace(/-([^-]*)$/,'_'+'$1') +' = '+ under.template(templ).source);
        console.log('Recompiled the template');
    }
});
