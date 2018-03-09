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
    template: '<div class=tiles-grid-tile><div class="layout-column tile-content"layout=column><div class="layout-column tile-header"layout=column><div class="layout-align-space-between-stretch layout-row"layout=row layout-align=space-between><h2 class="header-link light-text"role=button tabindex=0><span>Interlibrary Loan</span></h2></div></div><md-list class="layout-column md-primoExplore-theme"layout=column role=list></md-list><div class="layout-column layout-align-center-center layout-margin layout-padding message-with-icon"layout=column layout-align="center center"layout-margin=""layout-padding=""><div><span><a' +
    ' href="http://library.willamette.edu/illiad/illiad.dll?Action=10&Form=62" target="_blank">Log into your ILL account</a> to check pending requests and view articles.</span></div></div></div></div>'
});
