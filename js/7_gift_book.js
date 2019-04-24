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
         if (vm.donor.includes("$$IWU") && (vm.donor.includes("of"))) { 
             vm.donor_chop = vm.donor.replace("$$IWU","");
             vm.donor_chop_url = vm.donor_chop.split('(')[0];
             vm.just_gift = vm.donor_chop.split('of')[0];
             vm.just_donor = vm.donor_chop.split('of').pop();
             vm.url_donor = escape(vm.donor_chop_url);
             vm.url = "http://alliance-primo.hosted.exlibrisgroup.com/primo-explore/search?query=any,contains," + vm.url_donor + "&tab=default_tab&search_scope=WU_Libraries_Summit&sortby=rank&vid=WU&mode=advanced&offset=0";    
             vm.show = "display:inline;";
            }
     }      
     }else {vm.show = "display: none";}
 }])
 .component('prmBriefResultAfter', {
    bindings: { 
    parentCtrl: '<' },
    controller: 'giftBookController',
    //template: '<span ng-attr-style="{{$ctrl.show}}"><a href="{{$ctrl.url}}"> {{$ctrl.donor_chop_url}}</a></span>'
    template: '<span ng-attr-style="{{$ctrl.show}}"> {{$ctrl.just_gift}} of <a href="{{$ctrl.url}}" target="_blank"> {{$ctrl.just_donor}}</a></span>'
});
/************************************* END Chat Area ************************************/

