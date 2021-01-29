(function(){
"use strict";
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/************************************* BEGIN Bootstrap Script ************************************/

/* We use a CENTRAL_PACKAGE, so use the below line to bootstrap the module */

var app = angular.module('viewCustom', ['angularLoad', 'reportProblem', 'libraryh3lpWidget', 'giftBooks', 'toggleInstitutions', 'myILL', 'oadoi', 'customActions', 'smsAction', 'hathiTrustAvailability', 'forceLogin', 'externalSearch']);

/************************************* END Bootstrap Script ************************************/

app.component('prmSearchResultAvailabilityLineAfter', {
    template: '<hathi-trust-availability hide-online="false" entity-id="https://idp.willamette.edu/idp"></hathi-trust-availability>'
});

app.component('prmFacetAfter', { template: '<external-search-facet />' }).component('prmPageNavMenuAfter', { template: '<external-search-pagenav />' }).component('prmFacetExactAfter', { template: '<external-search-contents />' });

/*
*
*	Orbis Cascade Alliance Central Package
*	Environment: Production
*	Last updated: 20200909
*
* Included customizations:
*   Hide/show Summit institutions (updated 20180701)
*   Insert custom action (updated 20181107)
*   Custom model window for peer-review and open access badges (updated 20191226)
*   Toggle advanced search in mobile display (updated 20181009)
*   Favorite signin warning (updated 20200311)
*   Enlarge Covers (Added 20200311)
*   Text a Call Number (Added 20200724)
*   External Search (Added 20200724)
*   Force Login (Added 20201022)
*   eShelf Links (Added 20201103)
*/

(function () {
    "use strict";
    'use strict';

    var app = angular.module('centralCustom', ['angularLoad']);

    /* Custom action Begins */

    angular.module('customActions', []);

    /* eslint-disable max-len */
    angular.module('customActions').component('customAction', {
        bindings: {
            name: '@',
            label: '@',
            icon: '@',
            iconSet: '@',
            link: '@',
            target: '@',
            index: '<'
        },
        require: {
            prmActionCtrl: '^prmActionList'
        },
        controller: ['customActions', function (customActions) {
            var _this = this;

            this.$onInit = function () {
                _this.action = {
                    name: _this.name,
                    label: _this.label,
                    index: _this.index,
                    icon: {
                        icon: _this.icon,
                        iconSet: _this.iconSet,
                        type: 'svg'
                    },
                    onToggle: customActions.processLinkTemplate(_this.link, _this.prmActionCtrl.item, _this.target)
                };
                customActions.removeAction(_this.action, _this.prmActionCtrl);
                customActions.addAction(_this.action, _this.prmActionCtrl);
            };
        }]
    });

    /* eslint-disable max-len */
    angular.module('customActions').factory('customActions', function () {
        return {
            /**
             * Adds an action to the actions menu, including its icon.
             * @param  {object} action  action object
             * @param  {object} ctrl    instance of prmActionCtrl
             */
            // TODO coerce action.index to be <= requiredActionsList.length
            addAction: function addAction(action, ctrl) {
                if (!this.actionExists(action, ctrl)) {
                    this.addActionIcon(action, ctrl);
                    ctrl.actionListService.requiredActionsList.splice(action.index, 0, action.name);
                    ctrl.actionListService.actionsToIndex[action.name] = action.index;
                    ctrl.actionListService.onToggle[action.name] = action.onToggle;
                    ctrl.actionListService.actionsToDisplay.unshift(action.name);
                }
            },
            /**
             * Removes an action from the actions menu, including its icon.
             * @param  {object} action  action object
             * @param  {object} ctrl    instance of prmActionCtrl
             */
            removeAction: function removeAction(action, ctrl) {
                if (this.actionExists(action, ctrl)) {
                    this.removeActionIcon(action, ctrl);
                    delete ctrl.actionListService.actionsToIndex[action.name];
                    delete ctrl.actionListService.onToggle[action.name];
                    var i = ctrl.actionListService.actionsToDisplay.indexOf(action.name);
                    ctrl.actionListService.actionsToDisplay.splice(i, 1);
                    i = ctrl.actionListService.requiredActionsList.indexOf(action.name);
                    ctrl.actionListService.requiredActionsList.splice(i, 1);
                }
            },
            /**
             * Registers an action's icon.
             * Called internally by addAction().
             * @param  {object} action  action object
             * @param  {object} ctrl    instance of prmActionCtrl
             */
            addActionIcon: function addActionIcon(action, ctrl) {
                ctrl.actionLabelNamesMap[action.name] = action.label;
                ctrl.actionIconNamesMap[action.name] = action.name;
                ctrl.actionIcons[action.name] = action.icon;
            },
            /**
             * Deregisters an action's icon.
             * Called internally by removeAction().
             * @param  {object} action  action object
             * @param  {object} ctrl    instance of prmActionCtrl
             */
            removeActionIcon: function removeActionIcon(action, ctrl) {
                delete ctrl.actionLabelNamesMap[action.name];
                delete ctrl.actionIconNamesMap[action.name];
                delete ctrl.actionIcons[action.name];
            },
            /**
             * Check if an action exists.
             * Returns true if action is part of actionsToIndex.
             * @param  {object} action  action object
             * @param  {object} ctrl    instance of prmActionCtrl
             * @return {bool}
             */
            actionExists: function actionExists(action, ctrl) {
                return ctrl.actionListService.actionsToIndex.hasOwnProperty(action.name);
            },
            /**
             * Process a link into a function to call when the action is clicked.
             * The function will open the processed link in a new tab.
             * Will replace {pnx.xxx.xxx} expressions with properties from the item.
             * @param  {string}    link    the original link string from the html
             * @param  {object}    item    the item object obtained from the controller
             * @return {function}          function to call when the action is clicked
             */
            processLinkTemplate: function processLinkTemplate(link, item, target) {
                var processedLink = link;
                var pnxProperties = link.match(/\{(pnx\..*?)\}/g) || [];
                pnxProperties.forEach(function (property) {
                    var value = property.replace(/[{}]/g, '').split('.').reduce(function (o, i) {
                        try {
                            var h = /(.*)(\[\d\])/.exec(i);
                            if (h instanceof Array) {
                                return o[h[1]][h[2].replace(/[^\d]/g, '')];
                            }
                            return o[i];
                        } catch (e) {
                            return '';
                        }
                    }, item);
                    processedLink = processedLink.replace(property, value);
                });
                return function () {
                    if (typeof target === 'undefined') {
                        target = '_blank';
                    }
                    return window.open(processedLink, target);
                };
            }
        };
    });

    /* Custom action Ends */

    /*
    * Toggle institutions (hide/show summit libraries)
    * https://github.com/alliance-pcsg/primo-explore-toggle-institutions
    */

    angular.module('toggleInstitutions', []).component('toggleInstitutions', {
        bindings: {
            startHidden: '<'
        },
        template: '<md-button class="md-raised" ng-click="$ctrl.toggleLibs()" id="summitButton" aria-controls="summitLinks" aria-expanded=false aria-label="Show/Hide Summit Libraries"> {{$ctrl.showLibs ? hide_label : show_label}} <span aria-hidden=true>{{$ctrl.showLibs ? "&laquo;" : "&raquo;"}}</span></md-button>',
        controller: ['$scope', 'showHideMoreInstOptions', function ($scope, showHideMoreInstOptions) {
            this.$onInit = function () {
                if (showHideMoreInstOptions.default_state == 'hidden') this.showLibs = this.startHidden === false ? true : false;
                if (showHideMoreInstOptions.default_state == 'visible') this.showLibs = this.startHidden === false ? true : true;
                this.button = angular.element(document.querySelector('prm-alma-more-inst-after button'));
                this.tabs = angular.element(document.querySelector('prm-alma-more-inst md-tabs'));
                this.tabs.attr('id', 'summitLinks');
                this.button.parent().after(this.tabs);
                if (!this.showLibs) this.tabs.addClass('hide');

                $scope.show_label = showHideMoreInstOptions.show_label;
                $scope.hide_label = showHideMoreInstOptions.hide_label;
            };
            this.toggleLibs = function () {
                this.showLibs = !this.showLibs;
                this.tabs.hasClass('hide') ? this.tabs.removeClass('hide') && this.button.attr('aria-expanded', true) : this.tabs.addClass('hide') && this.button.attr('aria-expanded', false);
            };
        }]
    });
    angular.module('toggleInstitutions').value('showHideMoreInstOptions', {
        default_state: 'hidden',
        show_label: 'Show Summit Libraries',
        hide_label: 'Hide Summit Libraries'
    }); /* hide/show */

    // Begin Badges modal module
    angular.module('badgesModal', []).component('badgesModal', {
        template: '<md-button ng-if="$ctrl.inBadges" ng-click="$ctrl.showBadgeInfo($event, $ctrl.view_code, $ctrl.infoFile)" class="badgeButton" aria-label="{{$ctrl.badgeTooltip}}"><md-tooltip>{{$ctrl.badgeTooltip}}</md-tooltip><md-icon md-svg-icon="{{$ctrl.infoIcon}}"></md-icon></md-button>',
        controller: function controller($scope, $mdDialog, $location, badgeOptions) {

            // Badge types
            this.badgeTypes = [{
                definition: 'peer-reviewed',
                file: 'peer_review.html',
                options: badgeOptions.peer_review
            }, {
                definition: 'open-access',
                file: 'open_access.html',
                options: badgeOptions.open_access
            }];

            // Initialization
            this.$onInit = function () {
                this.view_code = $location.search().vid;
                this.infoIcon = badgeOptions.info_icon;
                this.inBadges = false;
                var icon_definition = $scope.$parent.$parent.$ctrl.iconDefinition;
                angular.forEach($scope.$ctrl.badgeTypes, function (badge) {
                    if (icon_definition == badge.definition && badge.options.show_icon) {
                        $scope.$ctrl.inBadges = true;
                        $scope.$ctrl.badgeTooltip = badge.options.tooltip;
                        $scope.$ctrl.infoFile = badge.file;
                    }
                });
            };

            // Badge info dialog
            this.showBadgeInfo = function showBadgeInfo($event, view_code, info_file) {
                $mdDialog.show({
                    templateUrl: 'custom/' + view_code + '/html/' + info_file,
                    controller: badgeDialogController
                });
                function badgeDialogController($scope, $mdDialog) {
                    $scope.closeBadgeInfo = function () {
                        $mdDialog.hide();
                    };
                }
                $event.stopPropagation();
            };
        }
    }).value('badgeOptions', {
        info_icon: 'primo-ui:help-circle-outline',
        peer_review: {
            show_icon: true,
            tooltip: 'What is peer review?'
        },
        open_access: {
            show_icon: true,
            tooltip: 'What is open access?'
        }
    });

    // END Badges modal module


    // Begin Toggle Advanced Fields module //
    angular.module('toggleAdvancedFields', []).component('toggleAdvancedFields', {
        template: '<md-button class="md-raised" ng-click="$ctrl.toggleFields()" id="advancedFieldsButton" aria-controls="advancedFields" aria-expanded=false aria-label="Show/Hide Advanced Fields">{{$ctrl.advancedFieldsButtonLabel}}</md-button>',
        controller: function controller($scope, $window, advancedFieldsOptions) {
            this.$onInit = function () {

                // Declare button and field variables
                this.button = angular.element(document.getElementById('advancedFieldsButton'));
                this.fields = angular.element(document.querySelector('prm-advanced-search md-card:nth-child(2)'));
                this.fields.attr('id', 'advancedFields');

                // Show/hide button and fields on initialization and window resize
                this.setInitDisplay();
                if (advancedFieldsOptions.show_button_for == 'mobile') {
                    angular.element($window).bind('resize', function () {
                        $scope.$ctrl.setInitDisplay();
                    });
                }
            };

            // Set initial display of button and fields based on default options and window size
            this.setInitDisplay = function () {
                if (advancedFieldsOptions.show_button_for == 'all' || $window.innerWidth < 600) {
                    this.showHideFields('hide');
                    this.button.removeClass('hide');
                } else {
                    this.showHideFields('show');
                    this.button.addClass('hide');
                }
            };

            // Toggle fields on button click
            this.toggleFields = function () {
                this.fields.hasClass('hide') ? this.showHideFields('show') : this.showHideFields('hide');
            };

            // Show or hide fields
            this.showHideFields = function (show_hide) {
                switch (show_hide) {
                    case 'show':
                        this.fields.removeClass('hide');
                        this.advancedFieldsButtonLabel = advancedFieldsOptions.hide_label;
                        this.button.attr('aria-expanded', true);
                        break;
                    case 'hide':
                        this.fields.addClass('hide');
                        this.advancedFieldsButtonLabel = advancedFieldsOptions.show_label;
                        this.button.attr('aria-expanded', false);
                        break;
                }
            };
        }
    });
    // Set default values for toggleAdvancedFields module
    // show_button_for can be 'mobile' or 'all'
    angular.module('toggleAdvancedFields').value('advancedFieldsOptions', {
        show_button_for: 'mobile',
        show_label: 'Show Additional Fields',
        hide_label: 'Hide Additional Fields'
    });

    /* End toggle advanced fields */

    //* Begin Favorites Warning module  *//
    angular.module('showFavoritesWarning', []).run(["$rootScope", function ($rootScope) {
        $rootScope.view = false;
    }]).value('globalFavVars', {
        favWarnBarTxt: 'Sign in to make your favorites list permanent',
        favWarnModalTitleText: 'Sign in to make your favorites list permanent',
        favWarnModalContentText: 'You can create a favorites list as a Guest, but to save a list permanently you must be signed in.'
    }).factory("favSession", function ($window, $rootScope) {
        angular.element($window).on('storage', function (event) {
            if (event.key === 'showFavWarning') {
                $rootScope.$apply();
            }
        });
        /*Functions for setting and getting session data*/
        return {
            setData: function setData(val) {
                $window.sessionStorage && $window.sessionStorage.setItem('showFavWarning', val);
                return this;
            },
            getData: function getData() {
                return $window.sessionStorage && $window.sessionStorage.getItem('showFavWarning');
            }
        };
    }).controller('favOverlayCtrl', function ($scope, $mdDialog, $rootScope, favSession, globalFavVars) {
        $scope.status = ' ';
        $scope.customFullscreen = false;
        $scope.favWarning = favSession.getData(); //Pull session data to determine if favorites warning modal should be displayed
        var icon_definition = $scope.$parent.$parent.$ctrl.iconDefinition;
        this.isPinIcon = false;
        if (icon_definition === 'prm_pin') {
            this.isPinIcon = true;
        }

        /*Upon initialization of the app the favSession value will be null, so we need to give it a value
        based on global variables set by the institution in their custom.js file*/
        if ($scope.favWarning === null) {
            favSession.setData('true');
            $scope.favWarning = favSession.getData();
        }
        /*If the user is a guest then the isLoggedIn variable is set to 'false'*/
        var rootScope = $scope.$root;
        var uSMS = rootScope.$$childHead.$ctrl.userSessionManagerService;
        var jwtData = uSMS.jwtUtilService.getDecodedToken();
        if (jwtData.userGroup === "GUEST") {
            $scope.isLoggedIn = 'false';
        } else {
            $scope.isLoggedIn = 'true';
        }
        /*Set the rootScope view variable depending on session data, if the user is logged in*/
        if ($scope.favWarning === 'true' && $scope.isLoggedIn === 'false') {
            $rootScope.view = true;
        }

        $scope.favWarningOnClick = function () {
            favSession.setData('false');
            $scope.favWarning = favSession.getData();
            $rootScope.view = false;
        };
        /*Function to display favorites warning modal when favorites icon is clicked*/
        $scope.showFavWarningModal = function (ev) {
            $mdDialog.show({
                template: '<md-dialog>' + '<md-dialog-content>' + '<md-toolbar id="fav-modal-header">' + '<div class="md-toolbar-tools">' + '<h2 class="flex"><p id="fav-modal-header-text" ng-bind-html="favWarnModalTitleDisplay"></p></h2>' + '</div>' + '</md-toolbar>' + '<div id="fav-modal-content" class="md-dialog-content">' + '<p id="fav-modal-content-text" ng-bind-html="favWarnModalContentDisplay"></p>' + '<p style="text-align: center">' + '<prm-authentication>' + '<button class="button-with-icon zero-margin md-button md-primoExplore-theme md-ink-ripple" type="button" ng-transclude="">' + '<prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="sign-in">' + '<md-icon md-svg-icon="primo-ui:sign-in" alt="" class="md-primoExplore-theme" aria-hidden="true"></md-icon>' + '</prm-icon>' + '<span translate="eshelf.signin.title">Sign in</span>' + '</button>' + '</prm-authentication>' + '<button class="dismiss-alert-button zero-margin md-button md-primoExplore-theme md-ink-ripple button-with-icon" ng-click="favModalClose(); favWarningOnClick()">' + '<prm-icon icon-type="svg" svg-icon-set="navigation" icon-definition="ic_close_24px">' + '<md-icon md-svg-icon="navigation:ic_close_24px" alt="" class="md-primoExplore-theme" aria-hidden="true"></md-icon>' + '</prm-icon>' + 'DISMISS' + '</button></p>' + '</div>' + '</md-dialog-content>' + '</md-dialog>',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen,
                controller: function favModalDialogCtrl($scope, $mdDialog, $state, favSession, globalFavVars) {
                    $scope.favModalClose = function () {
                        $mdDialog.hide();
                    };
                    $scope.favWarnModalTitleDisplay = globalFavVars.favWarnModalTitleText;
                    $scope.favWarnModalContentDisplay = globalFavVars.favWarnModalContentText;
                }
            });
        };
    }).component('favOverlay', { //This component is an element that sits over the favorites icon when the modal warning functionality is enabled.
        controller: 'favOverlayCtrl',
        template: '<div>' + '<button style="cursor: pointer; background: transparent; border: none; width: 41px; height: 41px; margin: -31px 0px 0px -21px; position: absolute" ng-if="$ctrl.isPinIcon" ng-disabled="$ctrl.isFavoritesDisabled()" ng-show="$root.view" ng-click="showFavWarningModal($event); favWarningOnClick()">' + '</button>' + '</div>'
    });

    //* End Favorites signin warning  *//


    //*  Begin Enlarge covers   *//
    angular.module('enlargeCover', []).component('enlargeCover', {
        // Template
        template: '<md-button ng-if="$ctrl.show_cover" ng-click="$ctrl.showLargeCover($event)" title="View Larger" />',
        controller: function controller($scope, $location, enlargeCoverOptions) {
            this.$onInit = function () {
                this.cover_url = '';
                this.show_cover = false;
                if (angular.isDefined($scope.$parent.$parent.$ctrl.item)) {
                    var resource_type = $scope.$parent.$parent.$ctrl.item.pnx.display.type[0];
                    if ($location.path() == '/fulldisplay' && enlargeCoverOptions.resource_types.indexOf(resource_type) != -1) {
                        this.show_cover = true;
                    }
                }
            };

            this.showLargeCover = function showLargeCover($event) {
                // Prevent page submission
                $event.preventDefault();

                // Get thumbnail URL and modify for large image
                if (angular.isDefined($scope.$parent.$parent.$ctrl.selectedThumbnailLink)) {
                    var thumbnail_url = $scope.$parent.$parent.$ctrl.selectedThumbnailLink.linkURL;
                    if (thumbnail_url.indexOf('syndetics.com') != -1) {
                        this.cover_url = thumbnail_url.replace('SC.JPG', 'LC.JPG');
                    } else if (thumbnail_url.indexOf('books.google.com')) {
                        this.cover_url = thumbnail_url.replace('zoom=5', 'zoom=1');
                    }
                    window.open(this.cover_url, '_blank');
                }
            };
        }
    }).value('enlargeCoverOptions', {
        resource_types: ['book', 'pbook', 'dvdvideo', 'videocassette']
    });

    //* End Enlarge covers  *//

    //* Begin Text a Call Number *//

    // SMS action
    angular.module('smsAction', []).component('smsAction', {
        require: {
            prmActionCtrl: '^prmActionList'
        },
        controller: function controller($scope, $location, $http, $mdDialog, customActions, smsActionOptions) {
            var _this = this;
            this.$onInit = function () {
                // Set defaults;
                var vid = '';
                var mms_id = '';
                var show_sms = false;
                var pnx = $scope.$parent.$parent.$ctrl.item.pnx;
                if (!angular.isUndefined(pnx)) {
                    // Get available institutions
                    var availinstitution = pnx.display.availinstitution;
                    if (!angular.isUndefined(availinstitution)) {

                        // Get vid
                        var vid = angular.uppercase($location.search().vid);

                        // Get institution code
                        var institution = vid;
                        if (angular.isDefined(smsActionOptions.institution) && smsActionOptions.institution != '') {
                            institution = smsActionOptions.institution;
                        }

                        // Continue if this institution has availability
                        var available = false;
                        for (var i = 0; i < availinstitution.length; i++) {
                            if (availinstitution[i].indexOf('$$I' + institution + '$$') != -1) {
                                available = true;
                            }
                        }
                        if (available == true) {

                            // Get title
                            var title = encodeURIComponent(pnx.display.title[0]);

                            // Get MMS ID
                            var mms_id = '';
                            var lds04 = pnx.display.lds04;
                            if (!angular.isUndefined(lds04)) {
                                var loc_start = 0;
                                var loc = '';
                                for (var m = 0; m < lds04.length; m++) {
                                    loc_start = lds04[m].indexOf('$$I');
                                    loc = lds04[m].substr(loc_start);
                                    if (loc == '$$I' + vid) {
                                        mms_id = lds04[m].substr(0, loc_start);
                                    }
                                }
                            }

                            // Get holdings
                            var holdings = new Array();
                            var availlibrary = pnx.display.availlibrary;
                            for (var h = 0; h < availlibrary.length; h++) {
                                var holding = availlibrary[h];
                                if (holding.indexOf('$$I' + institution + '$$') != -1) {
                                    var split_holding = holding.split('$$');
                                    for (var s = 0; s < split_holding.length; s++) {
                                        var sub = split_holding[s];
                                        var sub_value = sub.substring(1);
                                        switch (sub.charAt(0)) {
                                            case '1':
                                                var library_location = sub_value;
                                                break;
                                            case '2':
                                                var call_number = sub_value;
                                                break;
                                            case 'Y':
                                                var library_code = sub_value;
                                                break;
                                            default:
                                            // Do nothing
                                        }
                                    }
                                    holdings.push(library_code + ';' + library_location + ';' + call_number);
                                }
                            }
                            var joined_holdings = encodeURIComponent(holdings.join('|'));

                            // If holdings were set successfully, set show_sms to true
                            if (holdings.length > 0) {
                                show_sms = true;
                            }
                        }
                    }
                    // Define action
                    _this.sms_action = {
                        name: 'sms_action',
                        label: smsActionOptions.label,
                        index: smsActionOptions.index,
                        icon: smsActionOptions.icon,
                        onToggle: _this.showSmsForm(vid, title, mms_id, joined_holdings)
                    };
                    // Add action if show_sms is true, otherwise remove it
                    if (show_sms) {
                        customActions.removeAction(_this.sms_action, _this.prmActionCtrl);
                        customActions.addAction(_this.sms_action, _this.prmActionCtrl);
                    } else {
                        customActions.removeAction(_this.sms_action, _this.prmActionCtrl);
                    }
                };
            };

            // SMS dialog
            this.showSmsForm = function showSmsForm(vid, title, mms_id, joined_holdings) {
                return function () {

                    // Get form asynchronously
                    $http({
                        method: "GET",
                        url: 'https://cloud9.orbiscascade.org/sms/form.php?vid=' + vid + '&title=' + title + '&holdings=' + joined_holdings + '&libraries=' + smsActionOptions.libraries
                    }).then(function (response) {
                        // Show dialog
                        $mdDialog.show({
                            controller: smsFormController,
                            template: '<md-dialog aria-label="' + smsActionOptions.label + '"><md-dialog-content><md-toolbar><div class="md-toolbar-tools"><h2 class="flex">' + smsActionOptions.label + '</h2><md-button class="md-icon-button" ng-click="closeSmsForm()"><md-tooltip>Close Window</md-tooltip><md-icon md-svg-icon="primo-ui:close" aria-label="Close form window"></md-button></div></md-toolbar><div id="smsFormContent" class="md-dialog-content">' + response.data + '</div></md-dialog-content></md-dialog>',
                            clickOutsideToClose: true,
                            escapeToClose: true
                        });
                    }, function (error_response) {
                        console.log(error_response);
                    });

                    function smsFormController($scope, $mdDialog) {

                        // Submit form asynchronously
                        $scope.sendText = function () {
                            if (!angular.isUndefined($scope.smsPhone) && !angular.isUndefined($scope.smsProvider)) {
                                // Get note
                                var smsNote = $scope.smsNote;
                                if (angular.isUndefined(smsNote)) {
                                    smsNote = '';
                                }
                                // Get link option
                                var smsLink = document.getElementById('smsLink').checked;
                                // Get details
                                var smsItemDetails = document.getElementById('smsItemDetails').value;
                                // Send request
                                $http({
                                    method: 'GET',
                                    url: 'https://cloud9.orbiscascade.org/sms/send.php?vid=' + vid + '&title=' + title + '&mms_id=' + mms_id + '&details=' + smsItemDetails + '&phone=' + $scope.smsPhone + '&provider=' + $scope.smsProvider + '&note=' + smsNote + '&include_link=' + smsLink
                                }).then(
                                // Display confirmation
                                function (response) {
                                    document.getElementById('smsFormContent').innerHTML = response.data;
                                }, function (error_response) {
                                    console.log(error_response);
                                });
                            } else {
                                document.getElementById('smsError').style.display = "block";
                            }
                        };

                        // Close form
                        $scope.closeSmsForm = function () {
                            $mdDialog.hide();
                        };
                    }
                };
            };
        }
    }).value('smsActionOptions', {
        label: 'Text Call Number',
        index: 0,
        icon: {
            icon: 'ic_textsms_24px',
            iconSet: 'communication',
            type: 'svg'
        },
        libraries: '',
        institution: ''
    });

    //* End Text a Call Number  *//

    //* Begin External Search *//

    angular.module('externalSearch', []).component('externalSearchFacet', {
        controller: function controller($scope, externalSearchService, externalSearchOptions) {
            externalSearchService.controller = $scope.$parent.$parent.$ctrl;
            externalSearchService.externalSearchOptions = externalSearchOptions;
            externalSearchService.addExtSearch();
        }
    }).component('externalSearchPagenav', {
        controller: function controller(externalSearchService) {
            if (externalSearchService.controller) {
                externalSearchService.addExtSearch();
            }
        }
    }).component('externalSearchContents', {
        template: '<div ng-if="$ctrl.checkName()"><div ng-hide="$ctrl.checkCollapsed()"><div class="section-content animate-max-height-variable"><div class="md-chips md-chips-wrap"><div ng-repeat="target in targets" aria-live="polite" class="md-chip animate-opacity-and-scale facet-element-marker-local4"><div class="md-chip-content layout-row" role="button" tabindex="0"><strong dir="auto" title="{{ target.name }}"><a ng-href="{{ target.url + target.mapping(queries, filters) }}" target="_blank"><img ng-src="{{ target.img }}" width="22" height="22" alt="{{ target.alt }}" style="vertical-align:middle;"> {{ target.name }}</a></strong></div></div></div></div></div></div>',
        controller: function controller($scope, $location, externalSearchOptions) {
            $scope.facetName = externalSearchOptions.facetName;
            $scope.targets = externalSearchOptions.searchTargets;
            var query = $location.search().query;
            var filter = $location.search().pfilter;
            $scope.queries = Array.isArray(query) ? query : query ? [query] : false;
            $scope.filters = Array.isArray(filter) ? filter : filter ? [filter] : false;
            this.parentCtrl = $scope.$parent.$parent.$ctrl;
            this.checkName = function () {
                return this.parentCtrl.facetGroup.name == externalSearchOptions.facetName ? true : false;
            };
            this.checkCollapsed = function () {
                return this.parentCtrl.facetGroup.facetGroupCollapsed;
            };
        }
    }).factory('externalSearchService', function (externalSearchOptions) {
        return {
            get controller() {
                return this.prmFacetCtrl || false;
            },
            set controller(controller) {
                this.prmFacetCtrl = controller;
            },
            addExtSearch: function addExtSearch() {
                var xx = this;
                var checkExist = setInterval(function () {
                    if (xx.prmFacetCtrl.facetService.results[0] && xx.prmFacetCtrl.facetService.results[0].name != xx.externalSearchOptions.facetName) {
                        if (xx.prmFacetCtrl.facetService.results.name !== xx.externalSearchOptions.facetName) {
                            xx.prmFacetCtrl.facetService.results.unshift({
                                name: externalSearchOptions.facetName,
                                displayedType: 'exact',
                                limitCount: 0,
                                facetGroupCollapsed: false,
                                values: undefined
                            });
                        }
                        clearInterval(checkExist);
                    }
                }, 100);
            }
        };
    }).value('externalSearchOptions', {
        facetName: 'External Search',
        searchTargets: [{ // WorldCat
            "name": "Worldcat",
            "url": "https://www.worldcat.org/search?q=",
            "img": "/primo-explore/custom/CENTRAL_PACKAGE/img/worldcat-logo.png",
            "alt": "Worldcat Logo",
            mapping: function mapping(queries, filters) {
                var query_mappings = {
                    'any': 'kw',
                    'title': 'ti',
                    'creator': 'au',
                    'subject': 'su',
                    'isbn': 'bn',
                    'issn': 'n2'
                };
                try {
                    return queries.map(function (part) {
                        var terms = part.split(',');
                        var type = query_mappings[terms[0]] || 'kw';
                        var string = terms[2] || '';
                        var join = terms[3] || '';
                        return type + ':' + string + ' ' + join + ' ';
                    }).join('');
                } catch (e) {
                    return '';
                }
            }
        }, { // Google Scholar
            "name": "Google Scholar",
            "url": "https://scholar.google.com/scholar?q=",
            "img": "/primo-explore/custom/CENTRAL_PACKAGE/img/google-logo.png",
            "alt": "Google Scholar Logo",
            mapping: function mapping(queries, filters) {
                try {
                    return queries.map(function (part) {
                        return part.split(",")[2] || "";
                    }).join(' ');
                } catch (e) {
                    return '';
                }
            }
        }]
    });

    //* End External Search *//

    //* Begin Force Login *//

    angular.module('forceLogin', [])
    // Create and handle session storage variable
    .factory('forceLoginSession', function ($window, $rootScope) {
        angular.element($window).on('storage', function (event) {
            if (event.key === 'forceLogin') {
                $rootScope.$apply();
            }
        });
        // Functions for setting and getting session data
        return {
            setData: function setData(val) {
                $window.sessionStorage && $window.sessionStorage.setItem('forceLogin', val);
                return this;
            },
            getData: function getData() {
                return $window.sessionStorage && $window.sessionStorage.getItem('forceLogin');
            }
        };
    })
    // Drop code into element added in local package
    .component('forceLogin', {
        controller: function controller($scope, $rootScope, forceLoginSession) {
            this.$onInit = function () {
                // Access the control with the loginService
                var parentCtrl = $scope.$parent.$parent.$ctrl;

                // Put results of isSignedIn() into a variable
                var checkLogin = false;
                if (parentCtrl.isSignedIn() && !angular.isUndefined(parentCtrl.userName())) {
                    checkLogin = true;
                }

                // Get variable from session storage
                $scope.forceLogin = forceLoginSession.getData();

                // If the session variable is still null because user is not logged in and has not dismissed the login dialog
                if ($scope.forceLogin == null && checkLogin == false) {
                    // Open the login dialog box
                    parentCtrl.loginService.handleLoginClick();
                    // And set the session variable
                    forceLoginSession.setData('true');
                }
                // Handle opening a new browser tab when logged in: the page loads with userName undefined, then later populates
                // so this will close the dialog box once the page finishes loading
                else if (checkLogin == true) {
                        parentCtrl.loginService.$mdDialog.destroy();
                    }
            };
        }
    });

    //* End Force Login *//

    //* Begin eshelf.menu link module *//
    angular.module('eShelfLinks', []).controller('DirectiveController', function ($scope, $window, eShelfOptions) {
        $scope.data = eShelfOptions;
        $scope.openLink = function (url) {
            $window.open(url);
        };
    }).directive('mdMenuContent', function ($compile) {
        return {
            restrict: "E",
            link: function link($scope, $element) {
                var customEl = angular.element('<custom-directive></custom-directive>');
                $element.append(customEl);
                $compile(customEl)($scope);
            }
        };
    }).directive('customDirective', function ($window, $compile) {
        return {
            restrict: "E",
            controller: 'DirectiveController',
            scope: { data: '=?' },
            link: function link($scope, $element, $attr, ctrl) {
                if ($scope.data.items.length > 0) {
                    angular.forEach($scope.data.items, function (value, index) {
                        var directiveName = "md-menu-item",
                            directiveLabel = value.label,
                            directiveClass = "menu-custom-link",
                            directiveText = value.text,
                            directiveLink = value.link,
                            directiveIcon = value.icon;
                        var el = '<' + directiveName + ' class="' + directiveClass + '">' + '<button class="button-with-icon md-button md-primoExplore-theme md-ink-ripple" type="button" aria-label="' + directiveLabel + '" ng-click="openLink(\'' + directiveLink + '\')">' + '<md-icon md-svg-icon="' + directiveIcon + '"></md-icon>' + '<span class="custom-link">' + directiveText + '</span>' + '</button>' + '</' + directiveName + '">';
                        var compiledEl = angular.element($compile(el)($scope));
                        var menu = document.querySelector('custom-directive');
                        menu.appendChild(compiledEl[0]);
                    });
                }
            }
        };
    }).value('eShelfOptions', {
        items: []
    });
    //* End eshelf.menu link module *//

})();

/************************************* BEGIN Reserve Request ************************************/

angular.module('reservesRequest', []).component('prmLoginAlmaMashupAfter', {
    bindings: { parentCtrl: '<' },
    controller: function controller($scope, $http, $element, dataService, $mdDialog, reserveRequestOptions) {

        var formatBlacklist = reserveRequestOptions.formatBlacklist;
        $scope.instCode = reserveRequestOptions.instCode;
        $scope.primoDomain = reserveRequestOptions.primoDomain;
        $scope.primoVid = reserveRequestOptions.primoVid;
        $scope.primoScope = reserveRequestOptions.primoScope;
        $scope.successMessage = reserveRequestOptions.successMessage;
        $scope.failureMessage = reserveRequestOptions.failureMessage;

        this.$onInit = function () {
            $scope.displayRequestLink = false;
            $scope.required = true;
            $scope.format = dataService.getFormat($scope);

            var formatCheck = formatBlacklist.indexOf($scope.format);
            if (formatCheck >= 0) {
                var okFormat = false;
            } else {
                var okFormat = true;
            }

            var userGroup = dataService.getUserGroup($scope);
            var valid = dataService.doesLibraryOwn($scope);
            var userGroupWhitelist = reserveRequestOptions.userGroupWhitelist;
            var userCheck = userGroupWhitelist.indexOf(userGroup);
            if (userCheck >= 0 && valid == true && okFormat == true) {

                $scope.displayRequestLink = true;
                $scope.instructor = dataService.getInstructor($scope);
                $scope.delCat = dataService.getDeliveryCategory($scope);
                $scope.prop = reserveRequestOptions.selectProps;
                $scope.loanRule = reserveRequestOptions.selectProps.loanRule;
            }
        };
        $scope.showSelectValue = function (mySelect) {
            console.log(mySelect);
            $scope.loanRule = mySelect;
        };

        $scope.checkFormVals = function () {
            if (sessionStorage.course && sessionStorage.course != "undefined") {
                $scope.course = sessionStorage.course;
            };
            if (sessionStorage.courseTitle && sessionStorage.courseTitle != "undefined") {
                $scope.courseTitle = sessionStorage.courseTitle;
            };
        };

        $scope.submitRequest = function () {
            sessionStorage.course = $scope.course;
            sessionStorage.courseTitle = $scope.courseTitle;
            console.log("request");
            $scope.title = dataService.getTitle($scope);
            $scope.author = dataService.getAuthor($scope);
            $scope.callNumber = dataService.getCallNumber($scope);
            $scope.location = dataService.getLocation($scope);
            $scope.url = dataService.getUrl($scope);
            $scope.availability = dataService.getAvailability($scope);

            //console.log($scope);
            //console.log($element);
            var title = $scope.title;
            var req = {
                method: 'POST',
                url: reserveRequestOptions.targetUrl,
                headers: {
                    'Content-Type': undefined
                },
                data: {
                    title: $scope.title,
                    loanRule: $scope.loanRule,
                    callNumber: $scope.callNumber,
                    instructor: $scope.instructor,
                    author: $scope.author,
                    course: $scope.course,
                    courseTitle: $scope.courseTitle,
                    location: $scope.location,
                    url: $scope.url,
                    availability: $scope.availability,
                    comments: $scope.comments
                }
            };

            $http(req).then(function successCallback(response) {
                $element.find('md-card').html($scope.successMessage);
                // this callback will be called asynchronously
                // when the response is available
            }, function errorCallback(response) {

                $element.find('md-card').html($scope.failureMessage);
            });
        };
    },
    template: '<div ng-init="checkFormVals()" ng-click="isReplyFormOpen = !isReplyFormOpen" ng-show=\'{{displayRequestLink}}\' style=\'margin-bottom:10px;\'>\n    <span style=\'color: #883300;font-weight: bold;font-size: 100%;font-size:15px;margin-left: 10px;margin-right:15px;\'>COURSE RESERVES: </span>\n    <a     style=\'font-weight: bold;\n    font-size: 100%;\n    color: #1c62a8;\n    padding: 5px 7px;\n    -moz-border-radius: 1em;\n    border-radius: 1em;\n    line-height: 1.3em;\n    background: #f5f5f5;\n    border: solid 1px #ddd;\n    height: 30px;\n    margin-left: 5px;\n    margin-right: 5px;\'\'>Place on Reserve</a></div>\n\n     <md-card style=\'background-color:#e6e6e6;margin-bottom:50px;\' ng-init="isReplyFormOpen = false" ng-show="isReplyFormOpen" id="replyForm">\n        <md-card-title>\n          <md-card-title-text>\n            <span class="md-headline">Place item on reserve</span>\n          </md-card-title-text>\n        </md-card-title>\n\n        <md-content md-theme="docs-dark" layout-gt-sm="row">\n\t\t\t<div layout="column" layout-padding>\n\t\t\t\t<div flex>Course: <input type=\'text\' ng-model=\'course\' style=\'border-bottom: 1px solid gray\' size=\'50\' placeholder=\'e.g. ART 101\' ng-value="course" required> </div>\n\t\t\t\t<div flex>Course Title: <input type=\'text\' ng-model=\'courseTitle\' style=\'border-bottom: 1px solid gray\' size=\'50\' placeholder=\'e.g. Intro to Art\' required></div>\n\t\t\t\t<div flex>Loan Period:  <span >\n\t\t\t\t  <select ng-model="prop.value" ng-change="showSelectValue(prop.value)" ng-options="v for v in prop.values">\n\t\t\t\t  </select>\n\t\t\t\t</span>\n\t\t\t\t</div>\n        <div flex>Comments: <textarea ng-model=\'comments\'></textarea></div>\n\t\t\t</div>\n\n         </md-content>\n        <md-card-actions layout="row" layout-align="left center">\n          <md-button ng-click=\'submitRequest(mySelect)\' class="rreq md-raised">Place item on reserve</md-button>\n\n        </md-card-actions>\n      </md-card>'
}).factory('dataService', ['$http', function ($http) {
    return {
        getMMSid: function getMMSid($scope) {
            var mms = $scope.$parent.$parent.$parent.$ctrl.item.pnx.display.lds04;
            //console.log("MMSID: "+mms);
            for (var i = 0; i < mms.length; i++) {
                //console.log(mms[i]);
                var pieces = mms[i].split("$$I");
                if (pieces[1] == $scope.instCode) {
                    var mmsid = pieces[0];
                    $scope.mmsid = mmsid;
                }
            }
            return mmsid;
        },
        doesLibraryOwn: function doesLibraryOwn($scope) {

            var insts = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.delivery.institution;
            var check = insts.indexOf($scope.instCode);
            console.log(check);
            var second = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.browse.institution;
            var check2 = second.indexOf($scope.instCode);
            console.log(check2);
            if (check == "-1" && check2 == "-1") {
                return false;
            } else {
                return true;
            }
        },
        getCallNumber: function getCallNumber($scope) {
            // var calls=$scope.$root.$$childHead.$$childHead.$$childHead.$$childHead.$ctrl.fullViewPageService._currentItem.pnx.browse.callnumber;
            if ($scope.delCat == "Alma-E") {
                var callNumber = "N/A";
            } else {
                var calls = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.browse.callnumber;
                for (var i = 0; i < calls.length; i++) {
                    var parts = calls[i].split("$$");
                    console.log("parts:");
                    console.log(parts);
                    var partCheck = "I" + $scope.instCode;
                    if (parts[1] == partCheck) {
                        var callNumber = parts[2].substring(1);
                        console.log("exception");
                    }
                }
            }

            return callNumber;
        },
        getTitle: function getTitle($scope) {
            var title = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.addata.btitle[0];
            return title;
        },
        getAuthor: function getAuthor($scope) {

            var obj = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.addata;
            if (obj.hasOwnProperty("aulast")) {
                var author = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.addata.aulast[0];
            } else {
                var author = "N/A";
            }
            return author;
        },
        getFormat: function getFormat($scope) {
            var format = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.addata.format[0];
            return format;
        },
        getDeliveryCategory: function getDeliveryCategory($scope) {
            var delCat = $scope.$parent.$parent.$parent.$parent.$ctrl.item.delivery.deliveryCategory[0];
            return delCat;
        },
        getLocation: function getLocation($scope) {

            if ($scope.delCat == "Alma-E") {
                var location = "Electronic Resource";
            } else {
                var mainLocation = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.delivery.bestlocation.mainLocation;
                var subLocation = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.delivery.bestlocation.subLocation;

                var location = mainLocation + " " + subLocation;
            }
            return location;
        },
        getUrl: function getUrl($scope) {

            var docid = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.control.recordid[0];
            var url = "http://" + $scope.primoDomain + "/primo-explore/fulldisplay?docid=" + docid + "&context=L&vid=" + $scope.primoVid + "&search_scope=" + $scope.primoScope + "&tab=default_tab&lang=en_US";
            return url;
        },
        getAvailability: function getAvailability($scope) {
            if ($scope.delCat == "Alma-E") {
                var availability = "Electronic";
            } else {
                var availability = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.delivery.bestlocation.availabilityStatus;
            }
            return availability;
        },
        getInstructor: function getInstructor($scope) {
            var rootScope = $scope.$root;
            var uSMS = rootScope.$$childHead.$ctrl.userSessionManagerService;
            var jwtData = uSMS.jwtUtilService.getDecodedToken();
            console.log(jwtData);
            var instructor = jwtData.userName;
            return instructor;
        },
        getUserGroup: function getUserGroup($scope) {

            var rootScope = $scope.$root;
            var uSMS = rootScope.$$childHead.$ctrl.userSessionManagerService;
            var jwtData = uSMS.jwtUtilService.getDecodedToken();
            console.log(jwtData);
            var userGroup = jwtData.userGroup;
            return userGroup;
        }
    };
}]);

/* edit these below to fit your local environment */
app.constant('reserveRequestOptions', {
    instCode: "WU", /* code of your library  */
    formatBlacklist: ["journal", "ebook"], /* formats for which this will not appear  */
    userGroupWhitelist: ["CLAFACULTY"], /* array of whitelisted group members who will see this when authenticated    */
    selectProps: {
        "value": "2 hours", /* initial default text display in select menu  */
        "values": ["2 hours", "4 hours", "1 day", "3 days"], /* pulldown menu options for loan periods*/
        "loanRule": "2 hours" /* defaut select value for <option> value*/
    },
    targetUrl: "https://library.willamette.edu/scripts/reserve-process.php", /* URL to send data to, for emailing, etc.*/
    successMessage: "<md-card style='background-color:#e6e6e6;'><md-card-content><p>Your request has been placed. The Library Access Services staff will aim to place the item on reserve within 24 hours. Items that are checked out will be recalled and placed on reserves as soon as possible. If you have questions, please email circadm@willamette.edu, or contact the Circulation Desk at 503-370-6018.</p></md-card-content></md-card>",
    failureMessage: "<md-card style='background-color:#e6e6e6;'><md-card-content><p>Your request has been placed. The Library Access Services staff will aim to place the item on reserve within 24 hours. Items that are checked out will be recalled and placed on reserves as soon as possible. If you have questions, please email circadm@willamette.edu, or contact the Circulation Desk at 503-370-6018.</p></md-card-content></md-card>", /* We're sorry, an error occurred. Please let us know at  bkelm@willamette.edu, or contact the Circulation Desk at 503-370-6312. */
    primoDomain: "alliance-primo.hostd.exlibrisgroup.com",
    primoVid: "WU_TEST",
    primoScope: "WU_Libraries_Summit"
});

/************************************* END Report Problem ************************************/

/************************************* BEGIN myILL ************************************/
angular.module('myILL', []).component('prmLoansOverviewAfter', {
    bindings: { parentCtrl: '<' },
    controller: function controller($scope, $element, $q, $http, illService, illiadOptions) {
        var whitelistGroups = illiadOptions.groups;
        $scope.illBox = false;
        this.$onInit = function () {
            /* from: https://github.com/mehmetc/primo-explore-dom/blob/master/js/primo/explore/helper.js */
            var rootScope = $scope.$root;
            var uSMS = rootScope.$$childHead.$ctrl.userSessionManagerService;
            var jwtData = uSMS.jwtUtilService.getDecodedToken();
            //console.log(jwtData);
            //var userGroup=jwtData.userGroup;
            var user = jwtData.user;
            //var check = whitelistGroups.indexOf(jwtData.userGroup);
            //console.log(userGroup);
            if (whitelistGroups.indexOf(jwtData.userGroup) > 0) {
                $scope.illBox = true;
                $scope.showGlobe = true;
                $scope.boxTitle = illiadOptions.boxTitle;
                $scope.illiadURL = illiadOptions.illiadURL;
                console.log($scope.boxTitle);
                var url = illiadOptions.remoteScript;
                var response = illService.getILLiadData(url, user).then(function (response) {
                    console.log(response);
                    $scope.articles = response.data.Articles;
                    $scope.requests = response.data.Requests;
                    if ($scope.requests || $scope.articles) {
                        $scope.showGlobe = false;
                    }
                });
            }
        };
    },
    template: '<div class=tiles-grid-tile ng-show={{illBox}}>\n              <div class="layout-column tile-content"layout=column>\n                <div class="layout-column tile-header"layout=column>\n                  <div class="layout-align-space-between-stretch layout-row"layout=row layout-align=space-between>\n                    <h2 class="header-link light-text"role=button tabindex=0>\n                      <span>{{boxTitle}}</span>\n                    </h2>\n                  </div>\n                </div>\n                <md-list class="layout-column md-primoExplore-theme"layout=column role=list>\n                </md-list>\n                <div class="layout-column layout-align-center-center layout-margin layout-padding message-with-icon"layout=column layout-align="center center"layout-margin=""layout-padding="">\n                  <!-- <img ng-if="showGlobe" src="custom/LCC/img/globe.png">-->\n                  <div>\n                    <p style=\'font-size: 18px;font-weight: 400;\'>Pending Requests</p>\n                    <illrequest ng-if="requests" ng-repeat="y in requests" item="y"></illrequest>\n                    <div ng-if="!requests">You have no requests.</div>\n                      <div style="text-align:center;">----</div>\n                    <p style=\'font-size: 18px;font-weight: 400;\'\'>My Articles</p>\n                    <illarticle ng-if="articles" ng-repeat="x in articles" item="x"></illarticle>\n                    <div ng-if="!articles">You have no articles.</div>\n                    <div style="text-align:center;">----</div>\n                    <span>\n                      <a href="{{illiadURL}}" target="_blank">Log into your ILL account</a>\n                       for more information and to place requests.\n                      </span>\n                    </div>\n                  </div>\n                </div>\n              </div>'
}).component('illarticle', {
    bindings: { item: '<' },
    controller: function controller($scope) {

        console.log(this.item);
        //console.log(this.item.index);

        $scope.url = this.item.url;
        $scope.title = this.item.title;
        $scope.item = this.item;
        $scope.jtitle = this.item.jtitle;
        $scope.author = this.item.author;
        $scope.count = this.item.count;
        $scope.expires = this.item.expires;
    },
    template: '<div class=\'md-list-item-inner\' style=\'padding-bottom:10px;\'>\n              <div class=\'md-list-item-text\'>\n                <p style=\'font-size: 16px;font-weight: 400;letter-spacing: .01em;margin: 0;line-height: 1.2em;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;\'><a href=\'{{url}}\' target=\'_blank\'>{{title}}</a></p>\n                <p style=\'font-size: 14px;letter-spacing: .01em;margin: 3px 0 1px;font-weight: 400;line-height: 1.2em;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;\'>{{author}}</p>\n                <p style=\'font-size: 14px;letter-spacing: .01em;margin: 3px 0 1px;font-weight: 400;line-height: 1.2em;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;\'>Expires {{expires}}.</p>\n              </div>\n            </div>'

}).component('illrequest', {
    bindings: { item: '<' },
    controller: function controller($scope) {
        $scope.title = this.item.title;
        $scope.author = this.item.author;
        $scope.count = this.item.count;
    },
    //template:"<p>{{count}}) {{title}}/ {{author}}. </p>"
    template: '<div class=\'md-list-item-inner\' style=\'padding-bottom:10px;\'>\n              <div class=\'md-list-item-text\'>\n                <p style=\'font-size: 16px;font-weight: 400;letter-spacing: .01em;margin: 0;line-height: 1.2em;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;\'>{{title}}</p>\n                <p style=\'font-size: 14px;letter-spacing: .01em;margin: 3px 0 1px;font-weight: 400;line-height: 1.2em;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;\'>{{author}}</p>\n              </div>\n            </div>'
}).factory('illService', ['$http', function ($http) {
    return {
        getILLiadData: function getILLiadData(url, user) {
            return $http({
                method: 'GET',
                url: url,
                params: { 'user': user },
                cache: true
            });
        }
    };
}]);

/************************************* END My ILL ************************************/

/************************************* BEGIN oadoi-link ************************************/
angular.module('oadoi', []).component('prmFullViewServiceContainerAfter', {
    bindings: { parentCtrl: '<' },
    controller: function controller($scope, $http, $element, oadoiService, oadoiOptions) {
        this.$onInit = function () {
            $scope.oaDisplay = false; /* default hides template */
            $scope.imagePath = oadoiOptions.imagePath;
            var email = oadoiOptions.email;
            var section = $scope.$parent.$ctrl.service.scrollId;
            var obj = $scope.$ctrl.parentCtrl.item.pnx.addata;
            var debug = oadoiOptions.debug;

            if (obj.hasOwnProperty("doi")) {
                var doi = obj.doi[0];
                if (debug) {
                    console.log("doi:" + doi);
                }

                if (doi && section == "getit_link1_0") {
                    var url = "https://api.oadoi.org/v2/" + doi + "?email=" + email;

                    var response = oadoiService.getOaiData(url).then(function (response) {
                        if (debug) {
                            console.log("response from oadoiService received:");
                            console.log(response);
                        }
                        var oalink = response.data.best_oa_location.url;
                        if (oalink === null) {
                            $scope.oaDisplay = false;
                            if (debug) {
                                console.log("oaDisplay set to false (no link returned)");
                            }
                            $scope.oaClass = "ng-hide";
                        } else {
                            if (debug) {
                                console.log("oalink from response: " + oalink);
                            }
                            $scope.oalink = oalink;
                            $scope.oaDisplay = true;
                            $element.children().removeClass("ng-hide"); /* initially set by $scope.oaDisplay=false */
                            $scope.oaClass = "ng-show";
                        }
                    });
                } else {
                    $scope.oaDisplay = false;
                }
            } else {
                $scope.oaClass = "ng-hide";
            }
        };
    },
    template: '<div style="height:50px;background-color:white;padding:15px;" ng-show="{{oaDisplay}}" class="{{oaClass}}"><img src="{{imagePath}}" style="float:left;height:22px;width:22px;margin-right:10px"><p >Full text available via: <a href="{{oalink}}" target="_blank" style="font-weight:600;font-size:15px;color;#2c85d4;">Open Access</a></p></div>'
}).factory('oadoiService', ['$http', function ($http) {
    return {
        getOaiData: function getOaiData(url) {
            return $http({
                method: 'GET',
                url: url,
                cache: true
            });
        }
    };
}]).run(function ($http) {
    // Necessary for requests to succeed...not sure why
    $http.defaults.headers.common = { 'X-From-ExL-API-Gateway': undefined };
});

/************************************* END oadoi-link ************************************/
/************************************* BEGIN HathiTrust ************************************/
angular.module('hathiTrustAvailability', []).constant('hathiTrustBaseUrl', 'https://catalog.hathitrust.org/api/volumes/brief/json/').config(['$sceDelegateProvider', 'hathiTrustBaseUrl', function ($sceDelegateProvider, hathiTrustBaseUrl) {
    var urlWhitelist = $sceDelegateProvider.resourceUrlWhitelist();
    urlWhitelist.push(hathiTrustBaseUrl + '**');
    $sceDelegateProvider.resourceUrlWhitelist(urlWhitelist);
}]).factory('hathiTrust', ['$http', '$q', 'hathiTrustBaseUrl', function ($http, $q, hathiTrustBaseUrl) {
    var svc = {};

    var lookup = function lookup(ids) {
        if (ids.length) {
            var hathiTrustLookupUrl = hathiTrustBaseUrl + ids.join('|');
            return $http.jsonp(hathiTrustLookupUrl, {
                cache: true,
                jsonpCallbackParam: 'callback'
            }).then(function (resp) {
                return resp.data;
            });
        } else {
            return $q.resolve(null);
        }
    };

    // find a HT record URL for a given list of identifiers (regardless of copyright status)
    svc.findRecord = function (ids) {
        return lookup(ids).then(function (bibData) {
            for (var i = 0; i < ids.length; i++) {
                var recordId = Object.keys(bibData[ids[i]].records)[0];
                if (recordId) {
                    return $q.resolve(bibData[ids[i]].records[recordId].recordURL);
                }
            }
            return $q.resolve(null);
        }).catch(function (e) {
            console.error(e);
        });
    };

    // find a public-domain HT record URL for a given list of identifiers
    svc.findFullViewRecord = function (ids) {
        var handleResponse = function handleResponse(bibData) {
            var fullTextUrl = null;
            for (var i = 0; !fullTextUrl && i < ids.length; i++) {
                var result = bibData[ids[i]];
                for (var j = 0; j < result.items.length; j++) {
                    var item = result.items[j];
                    if (item.usRightsString.toLowerCase() === 'full view') {
                        fullTextUrl = result.records[item.fromRecord].recordURL;
                        break;
                    }
                }
            }
            return $q.resolve(fullTextUrl);
        };
        return lookup(ids).then(handleResponse).catch(function (e) {
            console.error(e);
        });
    };

    return svc;
}]).controller('hathiTrustAvailabilityController', ['hathiTrust', function (hathiTrust) {
    var self = this;

    self.$onInit = function () {
        if (!self.msg) self.msg = 'Full Text Available at HathiTrust';

        // prevent appearance/request iff 'hide-online'
        if (self.hideOnline && isOnline()) {
            return;
        }

        // prevent appearance/request iff 'hide-if-journal'
        if (self.hideIfJournal && isJournal()) {
            return;
        }

        // prevent appearance/request if item is unavailable
        if (self.ignoreCopyright && !isAvailable()) {
            //allow links for locally unavailable items that are in the public domain
            self.ignoreCopyright = false;
        }

        // look for full text at HathiTrust
        updateHathiTrustAvailability();
    };

    var isJournal = function isJournal() {
        var format = self.prmSearchResultAvailabilityLine.result.pnx.addata.format[0];
        return !(format.toLowerCase().indexOf('journal') == -1); // format.includes("Journal")
    };

    var isAvailable = function isAvailable() {
        var available = self.prmSearchResultAvailabilityLine.result.delivery.availability[0];
        return available.toLowerCase().indexOf('unavailable') == -1;
    };

    var isOnline = function isOnline() {
        var delivery = self.prmSearchResultAvailabilityLine.result.delivery || [];
        if (!delivery.GetIt1) return delivery.deliveryCategory.indexOf('Alma-E') !== -1;
        return self.prmSearchResultAvailabilityLine.result.delivery.GetIt1.some(function (g) {
            return g.links.some(function (l) {
                return l.isLinktoOnline;
            });
        });
    };

    var formatLink = function formatLink(link) {
        return self.entityId ? link + '?signon=swle:' + self.entityId : link;
    };

    var isOclcNum = function isOclcNum(value) {
        return value.match(/^(\(ocolc\))?\d+$/i);
    };

    var updateHathiTrustAvailability = function updateHathiTrustAvailability() {
        var hathiTrustIds = (self.prmSearchResultAvailabilityLine.result.pnx.addata.oclcid || []).filter(isOclcNum).map(function (id) {
            return 'oclc:' + id.toLowerCase().replace('(ocolc)', '');
        });
        hathiTrust[self.ignoreCopyright ? 'findRecord' : 'findFullViewRecord'](hathiTrustIds).then(function (res) {
            if (res) self.fullTextLink = formatLink(res);
        });
    };
}]).component('hathiTrustAvailability', {
    require: {
        prmSearchResultAvailabilityLine: '^prmSearchResultAvailabilityLine'
    },
    bindings: {
        entityId: '@',
        ignoreCopyright: '<',
        hideIfJournal: '<',
        hideOnline: '<',
        msg: '@?'
    },
    controller: 'hathiTrustAvailabilityController',
    template: '<span ng-if="$ctrl.fullTextLink" class="umnHathiTrustLink">\
                <md-icon alt="HathiTrust Logo">\
                  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 16 16" enable-background="new 0 0 16 16" xml:space="preserve">  <image id="image0" width="16" height="16" x="0" y="0"\
                  xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJN\
                  AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACNFBMVEXuegXvegTsewTveArw\
                  eQjuegftegfweQXsegXweQbtegnsegvxeQbvegbuegbvegbveQbtegfuegbvegXveQbvegbsfAzt\
                  plfnsmfpq1/wplPuegXvqFrrq1znr2Ptok/sewvueQfuegbtegbrgRfxyJPlsXDmlTznnk/rn03q\
                  pVnomkjnlkDnsGnvwobsfhPveQXteQrutHDqpF3qnUnpjS/prmDweQXsewjvrWHsjy7pnkvqqGDv\
                  t3PregvqhB3uuXjusmzpp13qlz3pfxTskC3uegjsjyvogBfpmkHpqF/us2rttXLrgRjrgBjttXDo\
                  gx/vtGznjzPtfhHqjCfuewfrjCnwfxLpjC7wtnDogBvssmjpfhLtegjtnEjrtnTmjC/utGrsew7s\
                  o0zpghnohB/roUrrfRHtsmnlkTbrvH3tnEXtegXvegTveQfqhyHvuXjrrGTpewrsrmXqfRHogRjt\
                  q2Dqewvqql/wu3vqhyDueQnwegXuegfweQPtegntnUvnt3fvxI7tfhTrfA/vzJvmtXLunEbtegrw\
                  egTregzskjbsxI/ouoPsqFzniyrz2K3vyZnokDLpewvtnkv30J/w17XsvYXjgBbohR7nplnso1L0\
                  1Kf40Z/um0LvegXngBnsy5juyJXvsGftrGTnhB/opVHoew7qhB7rzJnnmErkkz3splbqlT3smT3t\
                  tXPqqV7pjzHvunjrfQ7vewPsfA7uoU3uqlruoEzsfQ/vegf///9WgM4fAAAAFHRSTlOLi4uLi4uL\
                  i4uLi4uLi4tRUVFRUYI6/KEAAAABYktHRLvUtndMAAAAB3RJTUUH4AkNDgYNB5/9vwAAAQpJREFU\
                  GNNjYGBkYmZhZWNn5ODk4ubh5WMQERUTl5CUEpWWkZWTV1BUYlBWUVVT19BUUtbS1tHV0zdgMDQy\
                  NjE1MzRXsrC0sraxtWOwd3B0cnZxlXZz9/D08vbxZfDzDwgMCg4JdQsLj4iMio5hiI2LT0hMSk5J\
                  TUvPyMzKzmHIzcsvKCwqLiktK6+orKquYZCuratvaGxqbmlta+8QNRBl6JQ26Oru6e3rnzBx0uQ8\
                  aVGGvJopU6dNn1E8c9bsOXPniYoySM+PXbBw0eIlS5fl1C+PFRFlEBUVXbFy1eo1a9fliQDZYIHY\
                  9fEbNm7avEUUJiC6ddv2HTt3mSuBBfhBQEBQSEgYzOIHAHtfTe/vX0uvAAAAJXRFWHRkYXRlOmNy\
                  ZWF0ZQAyMDE2LTA5LTEzVDE0OjA2OjEzLTA1OjAwNMgVqAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAx\
                  Ni0wOS0xM1QxNDowNjoxMy0wNTowMEWVrRQAAAAASUVORK5CYII=" />\
                  </svg> \
                </md-icon>\
                <a target="_blank" ng-href="{{$ctrl.fullTextLink}}">\
                {{ ::$ctrl.msg }}\
                  <prm-icon external-link="" icon-type="svg" svg-icon-set="primo-ui" icon-definition="open-in-new"></prm-icon>\
                </a>\
              </span>'
});

/************************************* END HathiTrust ************************************/

/** Force User to Login Before Search **/

app.component('prmUserAreaExpandableAfter', { bindings: { parentCtrl: '<' }, template: '<force-login></force-login>' });

/**** END ****/

/************************************* BEGIN Customization Variables ************************************/

/*
 * Here you can enter options to be passed to customization packages to configure them.
 */

// Report a Problem:

app.constant('reportProblemOptions', {
    message: "See something that doesn't look right?",
    button: "Report a Problem",
    base: "https://library.willamette.edu/external/exlibris/primonew/reportproblem/index.php?"
});

app.constant('smsActionOptions', {
    label: "Text Call Number",
    index: 0,
    icon: {
        icon: 'ic_textsms_24px',
        iconSet: 'communication',
        type: 'svg'
    },
    libraries: 'HAT: Hatfield Library, LAW: Law Library',
    institution: 'WU'
});

// Librarian chat:

app.constant('libraryh3lpWidgetConfig', {
    url: 'https://libraryh3lp.com/chat/hat-help@chat.libraryh3lp.com?skin=33808',
    prompt: 'Chat with Librarian',
    icon: {
        set: 'communication',
        icon: 'ic_chat_24px'
    }
});

// Hide institutions:

app.constant('showHideMoreInstOptions', {
    default_state: "hidden",
    show_label: "Show libraries",
    hide_label: "Hide libraries"
});

// oadoi-links:
app.constant('oadoiOptions', {
    "imagePath": "custom/WU/img/oa_50.png",
    "email": "library@willamette.edu"
});

// My ILL
app.constant('illiadOptions', {
    "groups": ["CLAFACULTY", "CLASTUDENT", "ATKFACULTY", "ADMIN", "LIBRARY", "EXTDCHECK", "EMERITUS", "ATKSTUDENT", "TIUAFACULTY", "ATKPORTLAND", "WUSTAFF", "LIBSTAFF", "CSTSTUDENT", "CSTFACULTY", "CSTSTAFF"],
    "remoteScript": "https://library.willamette.edu/scripts/my-ill/illiad.php",
    "boxTitle": "Hatfield Interlibrary Loan",
    "illiadURL": "https://illiad.willamette.edu/illiad/illiad.dll?Action=10&Form=10",
    "apiURL": "https://illiad.willamette.edu/ILLiadWebPlatform/Transaction/UserRequests/"

});

/************************************* BEGIN Chat Area ************************************/

angular
// Name our module
.module('libraryh3lpWidget', [])
// Add the libraryh3lp url to trusted url sources
// so angular doesn't block it from an iframe
.filter('trustUrl', ['$sce', function ($sce) {
    return function (url) {
        if (/^http(s)?:\/\/(.+\.)?libraryh3lp\.com.+$/.test(url)) {
            return $sce.trustAsResourceUrl(url);
        }
    };
}])
// Controller for the component below
.controller('libraryh3lpWidgetController', ['libraryh3lpWidgetConfig', '$scope', function (libraryh3lpWidgetConfig, $scope) {
    var ctrl = this;
    this.$onInit = function () {
        $scope.config = libraryh3lpWidgetConfig;
        // Do facets exist?
        $scope.facetsExist = function () {
            try {
                return ctrl.parentCtrl.searchService.facetService.results.length > 0;
            } catch (e) {
                return false;
            }
        }();
        // Add the bottom padding class if there are facets
        $scope.bottomPadding = _defineProperty({}, "chat-bottom-padding", $scope.facetsExist);
    };
}]).component('prmExploreMainAfter', {
    bindings: {
        parentCtrl: '<'
    },
    controller: 'libraryh3lpWidgetController',
    template: '\n                <div class="chat-button-container">\n                    <button class="button chat-tab ss-chat js-toggle-chat" ng-class="bottomPadding" ng-init="showChatWidget = false" ng-click="showChatWidget = !showChatWidget">\n<!--                <prm-icon style="z-index:1" icon-type="svg" svg-icon-set="{{config.icon.set}}" icon-definition="{{config.icon.icon}}"></prm-icon>-->\n                    {{config.prompt}}\n                    </button>\n                </div>\n                <div class="chat-frame-wrap" ng-class="bottomPadding" ng-show="showChatWidget">\n                    <div class="chat-container">\n                        <button class="chat-close ss-icon js-toggle-chat" title="Close chat window" ng-click="showChatWidget = !showChatWidget">&times;</button>\n                        <iframe class="chat-frame" ng-src="{{config.url | trustUrl}}" frameborder="0"></iframe>\n                    </div>\n                </div>\n              '
});
/************************************* END Chat Area ************************************/

/** Show search scopes by default on basic searches **/

app.controller('SearchBarAfterController', ['angularLoad', function (angularLoad) {
    var vm = this;
    vm.parentCtrl.showTabsAndScopes = true;
}]);

/**** END ****/
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
            if (vm.donor.includes("$$IWU") && vm.donor.includes("Gift of")) {
                vm.donor_chop = vm.donor.replace("$$IWU", "");
                vm.donor_chop_url = vm.donor_chop.split('(')[0];
                vm.just_donor_i = vm.donor_chop.replace("Gift of", "");
                vm.url_i = "https://alliance-primo.hosted.exlibrisgroup.com/primo-explore/search?query=any,contains," + vm.donor_chop_url + "&tab=default_tab&search_scope=WU_Libraries_Summit&sortby=rank&vid=WU&mode=advanced&offset=0";
                vm.show = "display:inline;";
            }
        }
    } else {
        vm.show = "display:none";
    }
}]).component('prmBriefResultAfter', {
    bindings: {
        parentCtrl: '<' },
    controller: 'giftBookController',
    template: '<div><span ng-attr-style="{{$ctrl.show}}" ng-click="d(); $event.stopPropagation();">A gift of <a href="{{$ctrl.url_i}}" target="_blank"> {{$ctrl.just_donor_i}}</a></span></div>'
});
/************************************* END Chat Area ************************************/

/************************************* Begin Central Package Hide Institutions ************************************/

app.component('prmAlmaMoreInstAfter', { template: '<toggle-institutions />' });

/************************************* END Call Central Package Hide Institutions ************************************/

/************************************* BEGIN Report Problem ************************************/

angular.module('reportProblem', []).component('prmActionListAfter', {
    template: '<sms-action /><div ng-if="show" class="bar filter-bar layout-align-center-center layout-row margin-top-medium" layout="row" layout-align="center center">\
          <span class="margin-right-small">{{ message }}</span>\
          <a ng-href="{{ link }}" target="_blank">\
              <button class="button-with-icon zero-margin md-button md-button-raised md-primoExplore-theme md-ink-ripple" type="button" aria-label="Report a Problem" style="color: #5c92bd;">\
                  <prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="open-in-new"></prm-icon>\
                  <span style="text-transform: none;">{{ button }}</span>\
                  <div class="md-ripple-container"></div>\
              </button>\
          </a>\
      </div>\
      ',
    controller: ['$scope', '$location', '$httpParamSerializer', 'reportProblemOptions', function ($scope, $location, $httpParamSerializer, reportProblemOptions) {
        $scope.message = reportProblemOptions.message;
        $scope.button = reportProblemOptions.button;
        $scope.show = $location.path() === '/fulldisplay';
        $scope.link = reportProblemOptions.base + $httpParamSerializer($location.search());
    }]
});

/************************************* END Report Problem ************************************/
})();