/************************************* BEGIN Bootstrap Script ************************************/

/* We use a CENTRAL_PACKAGE, so use the below line to bootstrap the module */

var app = angular.module('viewCustom', ['angularLoad', 'reportProblem',  'giftBooks', 'toggleInstitutions', 'oadoi', 'customActions', 'smsAction', 'hathiTrustAvailability', 'forceLogin', 'externalSearch']);

/************************************* END Bootstrap Script ************************************/

app.component('prmSearchResultAvailabilityLineAfter', {
  template: '<hathi-trust-availability hide-online="false" entity-id="https://idp.willamette.edu/idp"></hathi-trust-availability>'
});

app
.component('prmFacetAfter', {template: '<external-search-facet />'})
.component('prmPageNavMenuAfter', {template: '<external-search-pagenav />' })
.component('prmFacetExactAfter', {template: '<external-search-contents />' });
