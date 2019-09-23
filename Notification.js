var apn = require('apn');

var options = {
    token: {
      key: "C:/Users/pragatij/Desktop/Diligent/AuthKey_MTYCJ7Q2S6.p8",
      keyId: "MTYCJ7Q2S6",
      teamId: "73V4PX9SKF"
    },
    production: false
  };
  
  var apnProvider = new apn.Provider(options);