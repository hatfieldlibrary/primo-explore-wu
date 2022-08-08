(function(){
"use strict";
'use strict';

/************************************* BEGIN Bootstrap Script ************************************/

/* We use a CENTRAL_PACKAGE, so use the below line to bootstrap the module */

var app = angular.module('viewCustom', ['angularLoad', 'hathiTrustAvailability', 'oadoi', 'customActions', 'smsAction', 'enlargeCover', 'forceLogin']);

/************************************* END Bootstrap Script ************************************/

/******************  BEGIN HathiTrust Availability ******************/
  
  
app.component('prmSearchResultAvailabilityLineAfter', {
  template: '<hathi-trust-availability hide-online="false" entity-id="https://idp.willamette.edu/idp"></hathi-trust-availability>'
});

app.value('hathiTrustAvailabilityOptions', {
  msg: 'Full Text Available at HathiTrust',
  hideOnline: false,
  hideIfJournal: false,
  ignoreCopyright: false,
  entityId: 'https://idp.willamette.edu/idp'
 });

/********************  END Hathit Trust Availability ******************/

/************* BEGIN Hide 856 Links */

app.value('linksToKeep', [
  "Table of Contents",
  "Connect to the Archives West online finding aid for this collection",
  "Connect to the online finding aid for this collection",
  "Need Help? Ask Us"
]);

/************* END Hide 856 Links */

/******** begin oadoi **********/
angular
  .module('oadoi', [])
  .component('prmFullViewServiceContainerAfter', {
    bindings: { parentCtrl: '<' },
    controller: function controller($scope, $http, $element, oadoiService, oadoiOptions) {
      this.$onInit = function() {
        $scope.oaDisplay=false; /* default hides template */
        $scope.imagePath=oadoiOptions.imagePath;
        var email=oadoiOptions.email;
        var section=$scope.$parent.$ctrl.service.scrollId;
        var obj=$scope.$ctrl.parentCtrl.item.pnx.addata;
        var debug=oadoiOptions.debug;
        if (obj.hasOwnProperty("doi")){
          var doi=obj.doi[0];
          if(debug){ console.log("doi:"+doi); }
          if (doi && section=="getit_link1_0"){
            var url="https://api.oadoi.org/v2/"+doi+"?email="+email;
            var response=oadoiService.getOaiData(url).then(function(response){
            if(debug){
              console.log("response from oadoiService received:");
              console.log(response);
            }
            var oalink=response.data.best_oa_location.url;
            if(oalink===null){
              $scope.oaDisplay=false;
              if(debug){ console.log("oaDisplay set to false (no link returned)"); }
              $scope.oaClass="ng-hide";
            }
            else{
              if(debug){
                console.log("oalink from response: " + oalink); }
                $scope.oalink=oalink;
                $scope.oaDisplay=true;
                $element.children().removeClass("ng-hide"); /* initially set by $scope.oaDisplay=false */
                $scope.oaClass="ng-show";
              }
            });
          }
          else{
            $scope.oaDisplay=false;
          }
        }
        else{
          $scope.oaClass="ng-hide";
        }
      };
    },
    template: '<div style="height:50px;background-color:white;padding:15px;" ng-show="{{oaDisplay}}" class="{{oaClass}}"><img src="{{imagePath}}" style="float:left;height:22px;width:22px;margin-right:10px"><p>Full text available via: <a href="{{oalink}}" target="_blank" style="font-weight:600;font-size:15px;color;#2c85d4;">Open Access</a></p></div>'
  })
  .factory('oadoiService', ['$http',function($http){
    return{
      getOaiData: function (url) {
        return $http({
          method: 'GET',
          url: url,
          cache: true
        })
      }
    }
  }]);
/****** end oadoi *********/

/******* begin oadoi local options ***********/ 
  app.constant('oadoiOptions', {
    "imagePath": "custom/01ALLIANCE_WU-WU/img/oa_50.png",
    "email": "library@willamette.edu"
  });
/******** end oadoi local options ***************/

/********** begin same tab menu links **************/

app.component('prmTopNavBarLinksAfter', {
  bindings:
  {parentCtrl: '<'}
  
  ,
  controller: function controller($document, $scope) {
  this.$onInit = function() {
  /Must wait for menu items to appear/
  var elCheck = setInterval(updateLinks, 1000);
  function updateLinks() {
  //console.log("anythihng")
  if( $document[0].querySelectorAll("div.top-nav-bar-links > div").length>0 ){
  var menuItems=$document[0].querySelectorAll("div.top-nav-bar-links > div")
  for (var i = 0; i < menuItems.length; i++)
  { var mItem = menuItems[i]; var anchor = mItem.querySelector("div > a"); anchor.target="_self" }
  
  clearInterval(elCheck);
  //return;
  }
  
  }
  
  }
  }
  });
/********** end same tab menu links **************/


/************* BEGIN Problem Report and SMS action ********/

app.component('prmActionListAfter', {
  template: `<custom-action name="problem report"
    label="Report a Problem"
    index=7
    icon="ic_report_problem_24px"
    icon-set="action"
    link= "link= "https://library.willamette.edu/external/exlibris/primonew/reportproblem/index.php?&docid={pnx.control.sourcerecordid}"></custom-action>
    <sms-action />
  `
})

/** Force User to Login Before Search **/

app.component('prmUserAreaExpandableAfter', { bindings: { parentCtrl: '<' }, template: '<force-login></force-login>' });

/**** END ****/

/** Show Profile Slot Dropdown **/

app.component('prmSearchBarAfter', {
  controller: function($scope) {
    this.$onInit = function() {
        $scope.$parent.$ctrl.showTabsAndScopes = true;
    }
  }
});

/**** END ****/

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

/************************ END Collapse Other Institutions  *******************/

/************************************* BEGIN Customization Variables ************************************/

/*
 * Here you can enter options to be passed to customization packages to configure them.
 */

// SMS Actions:
  
app.constant('smsActionOptions', {
  label: "Text Call Number",
  index: 0,
  icon: {
    icon: 'ic_textsms_24px',
    iconSet: 'communication',
    type: 'svg'
  },
  libraries: 'HAT: Hatfield Library, LAW: Law Library, PNCA: PNCA Library',
  institution: 'WU'
});


})();