/************************************* BEGIN Bootstrap Script ************************************/

/* We use a CENTRAL_PACKAGE, so use the below line to bootstrap the module */

var app = angular.module('viewCustom', ['angularLoad', 'reportProblem', 'libraryh3lpWidget', 'giftBooks', 'toggleInstitutions', 'myILL', 'oadoi', 'customActions', 'smsAction', 'hathiTrustAvailability']);

/************************************* END Bootstrap Script ************************************/

app.component('prmSearchResultAvailabilityLineAfter', {
  template: '<hathi-trust-availability hide-online="false" entity-id="https://idp.willamette.edu/idp"></hathi-trust-availability>'
});