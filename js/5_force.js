
/** Force Login to the Services Page **/

app.component('prmAuthenticationAfter', {
    bindings: { parentCtrl: '<' },
    controller: function($location) {
        this.$onInit = function() {
            if (($location.search().isSerivcesPage || $location.search().isServicesPage) && !this.parentCtrl.isLoggedIn) {
                this.parentCtrl.loginService.handleLoginClick();
            }
        };
    }
});

/**** END ****/

