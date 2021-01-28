/************************************* BEGIN Gift Book Area ************************************/

angular
  // Name our module
  .module('giftBooks', [])
 
  // Controller for the component below
  .controller('giftBookController', ['$scope', function ($scope) {
    var vm = this;
    vm.donor = {};
    vm.show = "display:none";
    if (this.parentCtrl.item.pnx.display.lds06 != null) {
     vm.array = this.parentCtrl.item.pnx.display.lds06;
     
     for (var i = 0, len = vm.array.length; i < len; i++) {
         vm.donor = vm.array[i];
         if (vm.donor.includes("$$IWU") && vm.donor.includes("Gift of") ) { 
             vm.donor_chop = vm.donor.replace("$$IWU","");
             vm.donor_chop_url = vm.donor_chop.split('(')[0];
             vm.just_donor_i = vm.donor_chop.replace("Gift of","");
             vm.url_i = "https://alliance-primo.hosted.exlibrisgroup.com/primo-explore/search?query=any,contains," + vm.donor_chop_url + "&tab=default_tab&search_scope=WU_Libraries_Summit&sortby=rank&vid=WU&mode=advanced&offset=0";    
             vm.show = "display:inline;";}
     }      
     }else {vm.show = "display:none";}
 }])
 .component('prmBriefResultAfter', {
    bindings: { 
    parentCtrl: '<' },
    controller: 'giftBookController',
    template: '<div><span ng-attr-style="{{$ctrl.show}}" ng-click="d(); $event.stopPropagation();">A gift of <a href="{{$ctrl.url_i}}" target="_blank"> {{$ctrl.just_donor_i}}</a></span></div>'
});
/************************************* END Chat Area ************************************/

