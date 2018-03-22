(function(){
"use strict";
'use strict';

/************************************* BEGIN Bootstrap Script ************************************/

/* We use a CENTRAL_PACKAGE, so use the below line to bootstrap the module */

var app = angular.module('viewCustom', ['angularLoad', 'reportProblem']);

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

/************************************* END Chat Area ************************************/

/************************************* BEGIN Chat Area ************************************/

app.component('prmSearchBookmarkFilterAfter', {
    template: '<a href="http://library.willamette.edu/ref/ask"><img src="custom/WU/img/ic_forum_gray_24px.svg" </a>'
});

/************************************* END Chat Area ************************************/

/************************************* BEGIN Open Access Area ************************************/

app.constant('oadoiOptions', {
    "imagePath": "custom/LCC/img/oa_50.png",
    "email": "bkelm@willamette.edu"
}

/************************************* END Open Access Area ************************************/

/** Show search scopes by default on basic searches **/
);app.component('prmSearchBarAfter', {
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

/** Force Login to the Services Page **/

app.component('prmAuthenticationAfter', {
    bindings: { parentCtrl: '<' },
    controller: function controller($location) {
        this.$onInit = function () {
            if (($location.search().isSerivcesPage || $location.search().isServicesPage) && !this.parentCtrl.isLoggedIn) {
                this.parentCtrl.loginService.handleLoginClick();
            }
        };
    }
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

/**** Begin Gift Book Section *****/

app.component('prmBriefResultAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmBriefResultAfterController',
    template: '<span style="{{$ctrl.show}}">A gift of <a href="{{$ctrl.url}}"> {{$ctrl.just_donor}}</a></span>'
});
app.controller('prmBriefResultAfterController', function () {
    var vm = this;
    vm.donor = {};
    vm.show = "display:none;";
    if (this.parentCtrl.item.pnx.display.lds06 != null) {
        vm.array = this.parentCtrl.item.pnx.display.lds06;

        for (var i = 0, len = vm.array.length; i < len; i++) {
            vm.donor = vm.array[i];
            if (vm.donor.includes("$$IWU") && vm.donor.includes("Gift of")) {
                vm.donor_chop = vm.donor.replace("$$IWU", "");
                vm.just_donor = vm.donor_chop.replace("Gift of", "");
                vm.url = "http://alliance-primo.hosted.exlibrisgroup.com/primo-explore/search?query=any,contains," + vm.donor_chop + "&tab=default_tab&search_scope=WU_Libraries_Summit&sortby=rank&vid=WU&mode=advanced&offset=0";
                vm.show = "display:inline;";
            }
        }
    } else {
        vm.show = "display:none;";
    }
});

/**** End Gift Section *****/

/************************************* Begin Central Package Hide Institutions ************************************/

angular.element(document).ready(function () {
    hide_show_other_institutions();
});

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