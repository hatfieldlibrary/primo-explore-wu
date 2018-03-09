
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
        if (vm.donor.includes("$$IWU") && vm.donor.includes("Gift of") ) { 
            vm.donor_chop = vm.donor.replace("$$IWU","");
            vm.just_donor = vm.donor_chop.replace("Gift of","");
            vm.url = "http://alliance-primo.hosted.exlibrisgroup.com/primo-explore/search?query=any,contains," + vm.donor_chop + "&tab=default_tab&search_scope=WU_Libraries_Summit&sortby=rank&vid=WU&mode=advanced&offset=0";    
            vm.show = "display:inline;";}
    }      
    }else {vm.show = "display:none;";}
});

/**** End Gift Section *****/
