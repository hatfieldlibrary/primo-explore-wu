(function(){
  "use strict";
  'use strict';
  
  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
  
  /***************** BEGIN Bootstrap Script ************************************/
  
  var app = angular.module('viewCustom', ['angularLoad', /*'hathiTrustAvailability', 'oadoi', 'forceLogin', 'libraryh3lpWidget', 'customActions', 'smsAction', 'enlargeCover', 'eShelfLinks'*/]);
  /* We use a CENTRAL_PACKAGE, so use the below line to bootstrap the module */
  
  
  /****************** END Bootstrap Script ************************************/
  
  
  
  
  /****************** BEGIN Collapse Other Institutions *********************/
  
  app.component("prmAlmaOtherMembersAfter", {
    bindings: {
    parentCtrl: "<",
    },
    controller: [
    function () {
    var ctrl = this;
    ctrl.parentCtrl.isCollapsed = true;
    },
    ],
   });
  
  /**************** END Collapse Other Institutions  *******************/
  
  
  
  
  /*************** BEGIN Customization Variables **********************/
  
  /*
   * Here you can enter options to be passed to customization packages to configure them.
   */
  
  /************* BEGIN Hide 856 Links */

app.value('linksToKeep', [
  "Table of Contents",
  "Need Help? Ask Us"
]);

/************* END Hide 856 Links */
  
  
  })();