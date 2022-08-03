/* Load JQuery */
/* JQuery required for this process */
var js = document.createElement('script') ;
js.src = "//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js";
											
document.head.appendChild(js);


(function(){
  "use strict";
  'use strict';
  
  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
  
  /***************** BEGIN Bootstrap Script ************************************/
  
  var app = angular.module('viewCustom', ['angularLoad', 'hathiTrustAvailability', 'oadoi', 'forceLogin', 'libraryh3lpWidget', 'customActions', 'smsAction', 'enlargeCover']);
  
  /* We use a CENTRAL_PACKAGE, so use the below line to bootstrap the module */
  
  
  /****************** END Bootstrap Script ************************************/
  
  
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
 
  
  /************* BEGIN Problem Report and SMS action ********/
  
  app.component('prmActionListAfter', {
    template: `<custom-action name="problem report"
      label="Report a Problem"
      index=7
      icon="ic_report_problem_24px"
      icon-set="action"
      link= "https://library.willamette.edu/external/exlibris/primonew/reportproblem/index.php?&docid={pnx.control.sourcerecordid}" ></custom-action>
      <sms-action />
    `
  })
  
  
  /********************* BEGIN Force User to Login Before Search ***********/
  
  app.component('prmUserAreaExpandableAfter', { bindings: { parentCtrl: '<' }, template: '<force-login></force-login>' });
  
  /********************** END Force User to Login Before Search ***********/
  
  
  /********************* BEGIN Show Profile Slot Dropdown ********************/
  
  app.component('prmSearchBarAfter', {
    controller: function($scope) {
      this.$onInit = function() {
          $scope.$parent.$ctrl.showTabsAndScopes = true;
      }
    }
  });
  
  /*********************** END Show Profile Slot Dropdown ********************/
  
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
  
  
  /************** BEGIN Enlarge Book Cover **********************************/
  
  app.component('prmSearchResultThumbnailContainerAfter', { template: '<enlarge-cover />' });
  
  /************* END Enlarge Book Cover ******************************/
  
    
  /*************** BEGIN Customization Variables **********************/
  
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
  
  // Librarian chat:
  
  app.constant('libraryh3lpWidgetConfig', {
    url: 'https://libraryh3lp.com/chat/hat-help@chat.libraryh3lp.com?skin=33808',
    prompt: 'Chat with Librarian',
    icon: {
      set: 'communication',
      icon: 'ic_chat_24px'
    }
  });
   
  /********************** BEGIN Chat Area *******************************/
  
  angular
  // Name our module
  .module('libraryh3lpWidget', [])
  // Add the libraryh3lp url to trusted url sources
  // so angular doesn't block it from an iframe
  .filter('trustUrl', ['$sce', function ($sce) {
    return function (url) {
      if (/^http(s)?:\/\/(.+\.)?libraryh3lp\.com.+$/.test(url)) {
        return $sce.trustAsResourceUrl(url);
      }
    };
  }])
  // Controller for the component below
  .controller('libraryh3lpWidgetController', ['libraryh3lpWidgetConfig', '$scope', function (libraryh3lpWidgetConfig, $scope) {
    var ctrl = this;
    this.$onInit = function () {
      $scope.config = libraryh3lpWidgetConfig;
      // Do facets exist?
      $scope.facetsExist = function () {
        try {
          return ctrl.parentCtrl.searchService.facetService.results.length > 0;
        } catch (e) {
          return false;
        }
      }();
      // Add the bottom padding class if there are facets
      $scope.bottomPadding = _defineProperty({}, "chat-bottom-padding", $scope.facetsExist);
    };
  }]).component('prmExploreMainAfter', {
    bindings: {
      parentCtrl: '<'
    },
    controller: 'libraryh3lpWidgetController',
    template: '\n                <div class="chat-button-container">\n                    <button class="button chat-tab ss-chat js-toggle-chat" ng-class="bottomPadding" ng-init="showChatWidget = false" ng-click="showChatWidget = !showChatWidget">\n<!--                <prm-icon style="z-index:1" icon-type="svg" svg-icon-set="{{config.icon.set}}" icon-definition="{{config.icon.icon}}"></prm-icon>-->\n                    {{config.prompt}}\n                    </button>\n                </div>\n                <div class="chat-frame-wrap" ng-class="bottomPadding" ng-show="showChatWidget">\n                    <div class="chat-container">\n                        <button class="chat-close ss-icon js-toggle-chat" title="Close chat window" ng-click="showChatWidget = !showChatWidget">&times;</button>\n                        <iframe class="chat-frame" ng-src="{{config.url | trustUrl}}" frameborder="0"></iframe>\n                    </div>\n                </div>\n              '
  });
  /******************* END Chat Area ************************************/
  
    
  })();