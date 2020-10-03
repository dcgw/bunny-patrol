const config = require("@softwareventures/webpack-config");

module.exports = config({
    title: "Bunny Patrol",
    vendor: "dcgw",
    html: {
        template: "index.html.template"
    }
});
