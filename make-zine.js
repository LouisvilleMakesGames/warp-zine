const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const pdf = require('html-pdf');


const issueName = process.argv.slice(2);
const jsonFileName = `./${issueName}.json`;
const issueData = require(`./issues/${issueName}.json`);

createHTML('layout', issueData, `./output/${issueName}.html`);

function createHTML(templateName, data, outputFileName, type) {
  var html = renderFromExternalTemplate(templateName, data);
  writeFile(html);
}

function renderFromExternalTemplate(templateName, data) {
  var templateFile = fs.readFileSync(path.join('templates', templateName + ".hbs"), "utf8");
  var css = fs.readFileSync(path.join('templates', templateName + ".css"), "utf8");
  var templateFile = templateFile.replace("{{insert-css}}",css);
  console.log(templateFile);
  var template = handlebars.compile(templateFile);
  return template(data);
}

function writeFile(html){
fs.writeFileSync(`./output/${issueName}.html`, html);

  var options = {
    "format": "Letter",
    "orientation": "portrait"
  };
  pdf.create(html, options).toFile(`./output/${issueName}.pdf`, function(err, res) {
    if (err) return console.log(err);
    console.log(res);
  });
}
