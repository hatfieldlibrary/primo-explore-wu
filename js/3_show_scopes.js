
/** Show search scopes by default on basic searches **/
app.component('prmSearchBarAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'SearchBarAfterController',
    template: '<div class="covidBanner"><p>Summit and ILL books and videos are unavailable until further notice. However, you can still request articles through <a href="https://libguides.willamette.edu/interlibraryloan">ILL</a>. For all changes see the <a href="https://library.willamette.edu/wordpress/blog/2020/03/20/update-on-library-services/" target="_blank">Update on Library Services</a>.</div>'
});

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