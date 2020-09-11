
/** Show search scopes by default on basic searches **
app.component('prmSearchBarAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'SearchBarAfterController',
    template: '<div class="covidBanner"><p>Summit and Interlibrary Loan books and videos are unavailable until further notice. However, you can still request articles through <a href="https://libguides.willamette.edu/interlibraryloan">ILL</a>. For all changes see the <a href="https://libguides.willamette.edu/c.php?g=1016697&p=7475598" target="_blank">Update on Library Services</a>.</div>'
});
*/
/*
app.component('prmSearchBarAfter', {
    bindings: {parentCtrl: '<'},
    controller: 'SearchBarAfterController'
    
});
*/
app.controller('SearchBarAfterController', ['angularLoad', function (angularLoad) {
var vm = this;
vm.parentCtrl.showTabsAndScopes = true;
}]);
 
/**** END ****/