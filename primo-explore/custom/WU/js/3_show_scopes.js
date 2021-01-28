
/** Show search scopes by default on basic searches **/

app.controller('SearchBarAfterController', ['angularLoad', function (angularLoad) {
var vm = this;
vm.parentCtrl.showTabsAndScopes = true;
}]);
 
/**** END ****/