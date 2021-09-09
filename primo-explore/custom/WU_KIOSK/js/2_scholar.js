
/** Show worldcat and scholar search option **/

app.controller('prmFacetRangeAfterController', [function(){
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