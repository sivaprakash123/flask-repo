const express = require('express');
app = express();

app.get("/", (req, res)=> {
   res.send("<html><body>Hello world!</body></html>");
});

app.listen(8000, function() {
   console.log("listening on 8000");
});
