(function(){
"use strict";
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/************************************* BEGIN Bootstrap Script ************************************/

/* We use a CENTRAL_PACKAGE, so use the below line to bootstrap the module */

var app = angular.module('viewCustom', ['angularLoad', 'reportProblem', 'libraryh3lpWidget', 'giftBooks', 'reservesRequest', 'toggleInstitutions']);

/************************************* END Bootstrap Script ************************************/

/************************************* BEGIN Customization Variables ************************************/

/*
 * Here you can enter options to be passed to customization packages to configure them.
 */

// Report a Problem:

app.constant('reportProblemOptions', {
  message: "See something that doesn't look right?",
  button: "Report a Problem",
  base: "https://library.willamette.edu/external/exlibris/primonew/reportproblem/index.php?"
});

// Librarian chat:

app.constant('libraryh3lpWidgetConfig', {
  url: 'https://libraryh3lp.com/chat/hat-help@chat.libraryh3lp.com',
  prompt: 'Chat with Librarian',
  icon: {
    set: 'communication',
    icon: 'ic_chat_24px'
  }
});

// Hide institutions:

app.constant('showHideMoreInstOptions', {
  default_state: "hidden",
  show_label: "Show libraries",
  hide_label: "Hide libraries"
});

/************************************* BEGIN Reserve Request ************************************/

angular.module('reservesRequest', []).component('prmLoginAlmaMashupAfter', {
  bindings: { parentCtrl: '<' },
  controller: function controller($scope, $http, $element, dataService, $mdDialog, reserveRequestOptions) {

    var formatBlacklist = reserveRequestOptions.formatBlacklist;
    $scope.instCode = reserveRequestOptions.instCode;
    $scope.primoDomain = reserveRequestOptions.primoDomain;
    $scope.primoVid = reserveRequestOptions.primoVid;
    $scope.primoScope = reserveRequestOptions.primoScope;
    $scope.successMessage = reserveRequestOptions.successMessage;
    $scope.failureMessage = reserveRequestOptions.failureMessage;

    this.$onInit = function () {
      $scope.displayRequestLink = false;
      $scope.required = true;
      $scope.format = dataService.getFormat($scope);

      var formatCheck = formatBlacklist.indexOf($scope.format);
      if (formatCheck >= 0) {
        var okFormat = false;
      } else {
        var okFormat = true;
      }

      var userGroup = dataService.getUserGroup($scope);
      var valid = dataService.doesLibraryOwn($scope);
      var userGroupWhitelist = reserveRequestOptions.userGroupWhitelist;
      var userCheck = userGroupWhitelist.indexOf(userGroup);
      if (userCheck >= 0 && valid == true && okFormat == true) {

        $scope.displayRequestLink = true;
        $scope.instructor = dataService.getInstructor($scope);
        $scope.delCat = dataService.getDeliveryCategory($scope);
        $scope.prop = reserveRequestOptions.selectProps;
        $scope.loanRule = reserveRequestOptions.selectProps.loanRule;
      }
    };
    $scope.showSelectValue = function (mySelect) {
      console.log(mySelect);
      $scope.loanRule = mySelect;
    };

    $scope.checkFormVals = function () {
      if (sessionStorage.course && sessionStorage.course != "undefined") {
        $scope.course = sessionStorage.course;
      };
      if (sessionStorage.courseTitle && sessionStorage.courseTitle != "undefined") {
        $scope.courseTitle = sessionStorage.courseTitle;
      };
    };

    $scope.submitRequest = function () {
      sessionStorage.course = $scope.course;
      sessionStorage.courseTitle = $scope.courseTitle;
      console.log("request");
      $scope.title = dataService.getTitle($scope);
      $scope.author = dataService.getAuthor($scope);
      $scope.callNumber = dataService.getCallNumber($scope);
      $scope.location = dataService.getLocation($scope);
      $scope.url = dataService.getUrl($scope);
      $scope.availability = dataService.getAvailability($scope);

      //console.log($scope);
      //console.log($element);
      var title = $scope.title;
      var req = {
        method: 'POST',
        url: reserveRequestOptions.targetUrl,
        headers: {
          'Content-Type': undefined
        },
        data: {
          title: $scope.title,
          loanRule: $scope.loanRule,
          callNumber: $scope.callNumber,
          instructor: $scope.instructor,
          author: $scope.author,
          course: $scope.course,
          courseTitle: $scope.courseTitle,
          location: $scope.location,
          url: $scope.url,
          availability: $scope.availability,
          comments: $scope.comments
        }
      };

      $http(req).then(function successCallback(response) {
        $element.find('md-card').html($scope.successMessage);
        // this callback will be called asynchronously
        // when the response is available
      }, function errorCallback(response) {

        $element.find('md-card').html($scope.failureMessage);
      });
    };
  },
  template: '<div ng-init="checkFormVals()" ng-click="isReplyFormOpen = !isReplyFormOpen" ng-show=\'{{displayRequestLink}}\' style=\'margin-bottom:10px;\'>\n    <span style=\'color: #883300;font-weight: bold;font-size: 100%;font-size:15px;margin-left: 10px;margin-right:15px;\'>COURSE RESERVES: </span>\n    <a     style=\'font-weight: bold;\n    font-size: 100%;\n    color: #1c62a8;\n    padding: 5px 7px;\n    -moz-border-radius: 1em;\n    border-radius: 1em;\n    line-height: 1.3em;\n    background: #f5f5f5;\n    border: solid 1px #ddd;\n    height: 30px;\n    margin-left: 5px;\n    margin-right: 5px;\'\'>Place on Reserve</a></div>\n\n     <md-card style=\'background-color:#e6e6e6;margin-bottom:50px;\' ng-init="isReplyFormOpen = false" ng-show="isReplyFormOpen" id="replyForm">\n        <md-card-title>\n          <md-card-title-text>\n            <span class="md-headline">Place item on reserve</span>\n          </md-card-title-text>\n        </md-card-title>\n\n        <md-content md-theme="docs-dark" layout-gt-sm="row">\n\t\t\t<div layout="column" layout-padding>\n\t\t\t\t<div flex>Course: <input type=\'text\' ng-model=\'course\' style=\'border-bottom: 1px solid gray\' size=\'50\' placeholder=\'e.g. ART 101\' ng-value="course" required> </div>\n\t\t\t\t<div flex>Course Title: <input type=\'text\' ng-model=\'courseTitle\' style=\'border-bottom: 1px solid gray\' size=\'50\' placeholder=\'e.g. Intro to Art\' required></div>\n\t\t\t\t<div flex>Loan Period:  <span >\n\t\t\t\t  <select ng-model="prop.value" ng-change="showSelectValue(prop.value)" ng-options="v for v in prop.values">\n\t\t\t\t  </select>\n\t\t\t\t</span>\n\t\t\t\t</div>\n        <div flex>Comments: <textarea ng-model=\'comments\'></textarea></div>\n\t\t\t</div>\n\n         </md-content>\n        <md-card-actions layout="row" layout-align="left center">\n          <md-button ng-click=\'submitRequest(mySelect)\' class="rreq md-raised">Place item on reserve</md-button>\n\n        </md-card-actions>\n      </md-card>'
}).factory('dataService', ['$http', function ($http) {
  return {
    getMMSid: function getMMSid($scope) {
      var mms = $scope.$parent.$parent.$parent.$ctrl.item.pnx.display.lds04;
      //console.log("MMSID: "+mms);
      for (var i = 0; i < mms.length; i++) {
        //console.log(mms[i]);
        var pieces = mms[i].split("$$I");
        if (pieces[1] == $scope.instCode) {
          var mmsid = pieces[0];
          $scope.mmsid = mmsid;
        }
      }
      return mmsid;
    },
    doesLibraryOwn: function doesLibraryOwn($scope) {

      var insts = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.delivery.institution;
      var check = insts.indexOf($scope.instCode);
      console.log(check);
      var second = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.browse.institution;
      var check2 = second.indexOf($scope.instCode);
      console.log(check2);
      if (check == "-1" && check2 == "-1") {
        return false;
      } else {
        return true;
      }
    },
    getCallNumber: function getCallNumber($scope) {
      // var calls=$scope.$root.$$childHead.$$childHead.$$childHead.$$childHead.$ctrl.fullViewPageService._currentItem.pnx.browse.callnumber;
      if ($scope.delCat == "Alma-E") {
        var callNumber = "N/A";
      } else {
        var calls = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.browse.callnumber;
        for (var i = 0; i < calls.length; i++) {
          var parts = calls[i].split("$$");
          console.log("parts:");
          console.log(parts);
          var partCheck = "I" + $scope.instCode;
          if (parts[1] == partCheck) {
            var callNumber = parts[2].substring(1);
            console.log("exception");
          }
        }
      }

      return callNumber;
    },
    getTitle: function getTitle($scope) {
      var title = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.addata.btitle[0];
      return title;
    },
    getAuthor: function getAuthor($scope) {

      var obj = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.addata;
      if (obj.hasOwnProperty("aulast")) {
        var author = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.addata.aulast[0];
      } else {
        var author = "N/A";
      }
      return author;
    },
    getFormat: function getFormat($scope) {
      var format = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.addata.format[0];
      return format;
    },
    getDeliveryCategory: function getDeliveryCategory($scope) {
      var delCat = $scope.$parent.$parent.$parent.$parent.$ctrl.item.delivery.deliveryCategory[0];
      return delCat;
    },
    getLocation: function getLocation($scope) {

      if ($scope.delCat == "Alma-E") {
        var location = "Electronic Resource";
      } else {
        var mainLocation = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.delivery.bestlocation.mainLocation;
        var subLocation = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.delivery.bestlocation.subLocation;

        var location = mainLocation + " " + subLocation;
      }
      return location;
    },
    getUrl: function getUrl($scope) {

      var docid = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.control.recordid[0];
      var url = "http://" + $scope.primoDomain + "/primo-explore/fulldisplay?docid=" + docid + "&context=L&vid=" + $scope.primoVid + "&search_scope=" + $scope.primoScope + "&tab=default_tab&lang=en_US";
      return url;
    },
    getAvailability: function getAvailability($scope) {
      if ($scope.delCat == "Alma-E") {
        var availability = "Electronic";
      } else {
        var availability = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.delivery.bestlocation.availabilityStatus;
      }
      return availability;
    },
    getInstructor: function getInstructor($scope) {
      var rootScope = $scope.$root;
      var uSMS = rootScope.$$childHead.$ctrl.userSessionManagerService;
      var jwtData = uSMS.jwtUtilService.getDecodedToken();
      console.log(jwtData);
      var instructor = jwtData.userName;
      return instructor;
    },
    getUserGroup: function getUserGroup($scope) {

      var rootScope = $scope.$root;
      var uSMS = rootScope.$$childHead.$ctrl.userSessionManagerService;
      var jwtData = uSMS.jwtUtilService.getDecodedToken();
      console.log(jwtData);
      var userGroup = jwtData.userGroup;
      return userGroup;
    }
  };
}]);

/* edit these below to fit your local environment */
app.constant('reserveRequestOptions', {
  instCode: "WU", /* code of your library  */
  formatBlacklist: ["journal", "ebook"], /* formats for which this will not appear  */
  userGroupWhitelist: ["CLAFACULTY"], /* array of whitelisted group members who will see this when authenticated    */
  selectProps: {
    "value": "2 hours", /* initial default text display in select menu  */
    "values": ["2 hours", "4 hours", "1 day", "3 days"], /* pulldown menu options for loan periods*/
    "loanRule": "2 hours" /* defaut select value for <option> value*/
  },
  targetUrl: "https://library.willamette.edu/scripts/reserve-process.php", /* URL to send data to, for emailing, etc.*/
  successMessage: "<md-card style='background-color:#e6e6e6;'><md-card-content><p>Your request has been placed. The Library Access Services staff will aim to place the item on reserve within 24 hours. Items that are checked out will be recalled and placed on reserves as soon as possible. If you have questions, please email circadm@willamette.edu, or contact the Circulation Desk at 503-370-6018.</p></md-card-content></md-card>",
  failureMessage: "<md-card style='background-color:#e6e6e6;'><md-card-content><p>Your request has been placed. The Library Access Services staff will aim to place the item on reserve within 24 hours. Items that are checked out will be recalled and placed on reserves as soon as possible. If you have questions, please email circadm@willamette.edu, or contact the Circulation Desk at 503-370-6018.</p></md-card-content></md-card>", /* We're sorry, an error occurred. Please let us know at  bkelm@willamette.edu, or contact the Circulation Desk at 503-370-6312. */
  primoDomain: "alliance-primo.hostd.exlibrisgroup.com",
  primoVid: "WU_TEST",
  primoScope: "WU_Libraries_Summit"
});

/************************************* END Report Problem ************************************/

/************************************* BEGIN Chat Area ************************************/

angular
// Name our module
.module('libraryh3lpWidget', []
// Add the libraryh3lp url to trusted url sources
// so angular doesn't block it from an iframe
).filter('trustUrl', ['$sce', function ($sce) {
  return function (url) {
    if (/^http(s)?:\/\/(.+\.)?libraryh3lp\.com.+$/.test(url)) {
      return $sce.trustAsResourceUrl(url);
    }
  };
}]
// Controller for the component below
).controller('libraryh3lpWidgetController', ['libraryh3lpWidgetConfig', '$scope', function (libraryh3lpWidgetConfig, $scope) {
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
  template: '\n              <button class="button chat-tab ss-chat js-toggle-chat" ng-class="bottomPadding" ng-init="showChatWidget = false" ng-click="showChatWidget = !showChatWidget">\n                <prm-icon style="z-index:1" icon-type="svg" svg-icon-set="{{config.icon.set}}" icon-definition="{{config.icon.icon}}"></prm-icon>\n                {{config.prompt}}\n              </button>\n              <div class="chat-frame-wrap" ng-class="bottomPadding" ng-show="showChatWidget">\n                <button class="chat-close ss-icon js-toggle-chat" title="Close chat window" ng-click="showChatWidget = !showChatWidget">&times;</button>\n                <iframe class="chat-frame" ng-src="{{config.url | trustUrl}}" frameborder="0"></iframe>\n              </div>\n              '
});
/************************************* END Chat Area ************************************/

/** Show search scopes by default on basic searches **/
app.component('prmSearchBarAfter', {
  bindings: { parentCtrl: '<' },
  controller: 'SearchBarAfterController'
});

app.controller('SearchBarAfterController', ['angularLoad', function (angularLoad) {
  var vm = this;
  vm.parentCtrl.showTabsAndScopes = true;
}]);

/**** END ****/

/** Show worldcat and scholar search option **/

app.controller('prmFacetRangeAfterController', [function () {
  //	console.log(this);
  try {
    this.query = this.parentCtrl.facetService.$location.$$search.query.split(",")[2];
  } catch (e) {
    this.query = "";
  }
}]);

app.component('prmFacetRangeAfter', {
  bindings: { parentCtrl: '<' },
  controller: 'prmFacetRangeAfterController',
  template: '<hr/><p style="font-weight: 600; color: black;">Other Places to Search</p><p><a href="https://willamette.on.worldcat.org/search?queryString={{$ctrl.query}}" target="_blank">Worldcat Discovery</a><br/><a href="https://scholar.google.com/scholar?q={{$ctrl.query}}" target="_blank">Google Scholar</a></p><hr/>'
});

/**** END ****/
app.component('prmLoansOverviewAfter', {
  bindings: { parentCtrl: '<' },
  controller: function controller($scope, $element) {

    /*
      vm.$onInit = function() {
            var deets=$scope.$root.$$childHead.$ctrl.userSessionManagerService.$http.get('/primo_library/libweb/webservices/rest/v1/usersettings?vid=LCC');
                //console.log(deets);
      }
    */

  },
  template: '<div class=tiles-grid-tile><div class="layout-column tile-content"layout=column><div class="layout-column tile-header"layout=column><div class="layout-align-space-between-stretch layout-row"layout=row layout-align=space-between><h2 class="header-link light-text"role=button tabindex=0><span>Interlibrary Loan</span></h2></div></div><md-list class="layout-column md-primoExplore-theme"layout=column role=list></md-list><div class="layout-column layout-align-center-center layout-margin layout-padding message-with-icon"layout=column layout-align="center center"layout-margin=""layout-padding=""><div><span><a' + ' href="http://library.willamette.edu/illiad/illiad.dll?Action=10&Form=62" target="_blank">Log into your ILL account</a> to check pending requests and view articles.</span></div></div></div></div>'
});

/************************************* BEGIN Gift Book Area ************************************/

angular
// Name our module
.module('giftBooks', []

// Controller for the component below
).controller('giftBookController', ['$scope', function ($scope) {
  var vm = this;
  vm.donor = {};
  vm.show = "display:none";
  if (this.parentCtrl.item.pnx.display.lds06 != null) {
    vm.array = this.parentCtrl.item.pnx.display.lds06;

    for (var i = 0, len = vm.array.length; i < len; i++) {
      vm.donor = vm.array[i];
      if (vm.donor.includes("$$IWU") && vm.donor.includes("Gift of")) {
        vm.donor_chop = vm.donor.replace("$$IWU", "");
        vm.donor_chop_url = vm.donor_chop.split('(')[0];
        vm.just_donor_i = vm.donor_chop.replace("Gift of", "");
        vm.url_i = "https://alliance-primo.hosted.exlibrisgroup.com/primo-explore/search?query=any,contains," + vm.donor_chop_url + "&tab=default_tab&search_scope=WU_Libraries_Summit&sortby=rank&vid=WU&mode=advanced&offset=0";
        vm.show = "display:inline;";
      }
    }
  } else {
    vm.show = "display:none";
  }
}]).component('prmBriefResultAfter', {
  bindings: {
    parentCtrl: '<' },
  controller: 'giftBookController',
  template: '<div><span ng-attr-style="{{$ctrl.show}}" ng-click="d(); $event.stopPropagation();">A gift of <a href="{{$ctrl.url_i}}" target="_blank"> {{$ctrl.just_donor_i}}</a></span></div>'
});
/************************************* END Chat Area ************************************/

/************************************* Begin Central Package Hide Institutions ************************************/

app.component('prmAlmaMoreInstAfter', { template: '<toggle-institutions />' });

/************************************* END Call Central Package Hide Institutions ************************************/

/************************************* BEGIN Report Problem ************************************/

angular.module('reportProblem', []).component('prmActionListAfter', {
  template: '<div ng-if="show" class="bar filter-bar layout-align-center-center layout-row margin-top-medium" layout="row" layout-align="center center">\
          <span class="margin-right-small">{{ message }}</span>\
          <a ng-href="{{ link }}" target="_blank">\
              <button class="button-with-icon zero-margin md-button md-button-raised md-primoExplore-theme md-ink-ripple" type="button" aria-label="Report a Problem" style="color: #5c92bd;">\
                  <prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="open-in-new"></prm-icon>\
                  <span style="text-transform: none;">{{ button }}</span>\
                  <div class="md-ripple-container"></div>\
              </button>\
          </a>\
      </div>\
      ',
  controller: ['$scope', '$location', '$httpParamSerializer', 'reportProblemOptions', function ($scope, $location, $httpParamSerializer, reportProblemOptions) {
    $scope.message = reportProblemOptions.message;
    $scope.button = reportProblemOptions.button;
    $scope.show = $location.path() === '/fulldisplay';
    $scope.link = reportProblemOptions.base + $httpParamSerializer($location.search());
  }]
});

/************************************* END Report Problem ************************************/
})();