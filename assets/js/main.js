// @codekit-prepend vendor/angular-marked.js
// @codekit-prepend vendor/wizzy.js
// @codekit-prepend vendor/infinite-scroll.js
// @codekit-prepend vendor/ui-bootstrap-tpls-0.14.3.min.js
// @codekit-prepend vendor/angular-facebook.js
// @codekit-prepend vendor/angular-jwt.min.js
// @codekit-prepend vendor/ng-file-upload-all.min.js
// @codekit-prepend vendor/smart-area.js
// @codekit-prepend vendor/elastic.js
// @codekit-prepend vendor/mentio.min.js
// @codekit-prepend vendor/angular-ui-switch.min.js
// @codekit-prepend vendor/angular-acl.min.js
// @codekit-prepend vendor/angular-timeago.js
// @codekit-prepend vendor/algoliasearch.angular.min.js
// @codekit-prepend vendor/ngGeolocation.js
// @codekit-prepend vendor/emoji.config.js
// @codekit-prepend vendor/emoji.min.js
// @codekit-prepend vendor/jquery.knob.min.js
// @codekit-prepend vendor/socket.min.js
// @codekit-prepend vendor/country-picker.min.js
// @codekit-prepend vendor/sidebar.js

// @codekit-prepend common/directives.js
// @codekit-prepend common/filters.js
// @codekit-prepend common/active_reader.js
// @codekit-prepend common/services.js

// @codekit-prepend modules/feed/init.js
// @codekit-prepend modules/categories/init.js
// @codekit-prepend modules/reader/init.js
// @codekit-prepend modules/publisher/init.js
// @codekit-prepend modules/user/init.js
// @codekit-prepend modules/rank/init.js
// @codekit-prepend modules/badges/init.js
// @codekit-prepend modules/top/init.js
// @codekit-prepend modules/search/search.js
// @codekit-prepend modules/events/event.js

var version = '106';
var boardApplication = angular.module('board', [
    'ngRoute',
    'ui.bootstrap',
    'directivesModule',
    'filtersModule',
    'sg.services',
    'activeReader',
    'hc.marked',
    'infinite-scroll',
    'feedModule',
    'categoryModule',
    'readerModule',
    'publisherModule',
    'userModule',
    'rankModule',
    'sg.module.badges',
    'sg.module.top',
    'sg.module.events',
    'angular-jwt',
    'firebase',
    'ngFileUpload',
    'monospaced.elastic',
    'mentio',
    'uiSwitch',
    'mm.acl',
    'yaru22.angular-timeago',
    'searchBar',
    'btford.socket-io',
    'ngGeolocation',
]);

boardApplication.config(['$httpProvider', 'jwtInterceptorProvider', '$routeProvider', '$locationProvider', 'markedProvider', 'AclServiceProvider', function($httpProvider, jwtInterceptorProvider, $routeProvider, $locationProvider, markedProvider, AclServiceProvider) {
    $routeProvider.when('/home', {
        templateUrl: '/app/partials/home.html?v=' + version
    });
    $routeProvider.when('/terminos-y-condiciones', {
        templateUrl: '/app/partials/terms.html?v=' + version
    });
    $routeProvider.when('/aviso-de-privacidad', {
        templateUrl: '/app/partials/privacy.html?v=' + version
    });
    $routeProvider.when('/reglamento', {
        templateUrl: '/app/partials/rules.html?v=' + version
    });
    $routeProvider.when('/about', {
        templateUrl: '/app/partials/about.html?v=' + version
    });
    $routeProvider.when('/rangos', {
        templateUrl: '/app/partials/ranks.html?v=' + version,
        controller: 'RanksController'
    });
    $routeProvider.when('/medallas', {
        templateUrl: '/app/partials/badges.html?v=' + version,
        controller: 'BadgeController'
    });

    $routeProvider.when('/top-ranking', {
        templateUrl: '/app/partials/tops.html?v=' + version,
        controller: 'TopController'
    });

    $routeProvider.when('/signup/confirm/:code', {
        templateUrl: '/app/partials/validate.html?v=' + version,
        controller: 'UserValidationController'
    });

    $routeProvider.when('/c/:slug', {
        templateUrl: '/app/partials/main.html?v=' + version,
        controller: 'CategoryListController'
    });
    $routeProvider.when('/p/:slug/:id/edit', {
        templateUrl: '/app/partials/edit.html?v=' + version,
        controller: 'EditPostController'
    });
    $routeProvider.when('/p/:slug/:id/:comment_position?', {
        templateUrl: '/app/partials/main.html?v=' + version,
        controller: 'CategoryListController'
    });
    $routeProvider.when('/u/:username/:id', {
        templateUrl: '/app/partials/profile.html?v=' + version,
        controller: 'UserController'
    });

    $routeProvider.when('/user/lost_password/:token', {
        templateUrl: '/app/partials/recovery.html?v=' + version,
        controller: 'UserRecoveryController'
    });
    $routeProvider.when('/eventos', {
        templateUrl: '/app/partials/events.html?v=' + version,
        controller: 'EventController'
    });
    $routeProvider.when('/post/create/:cat_slug?', {
        templateUrl: '/app/partials/publish.html?v=' + version,
        controller: 'PublishController',
        onEnter: function() {
            if (!$scope.user.isLogged) {
                window.location = '/';
            }
        }
    });

    $routeProvider.when('/entrar', {
        templateUrl: '/app/partials/account/login.html',
        controller: loginController,
        controllerAs: 'vm'
    });

    $routeProvider.when('/unete', {
        templateUrl: '/app/partials/account/signup.html',
        controller: signupController,
        controllerAs: 'vm'
    });

    $routeProvider.when('/', {
        templateUrl: '/app/partials/main.html?v=' + version,
        controller: 'CategoryListController',
        resolveRedirectTo: function() {
            if (!$scope.user.isLogged) {
                return '/unete';
            }

            return undefined;
        }
    });

    $routeProvider.otherwise({
        redirectTo: '/'
    });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);

    // Marked
    markedProvider.setRenderer({
        link: function(href, title, text) {
            console.log("href before", href);
            var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
            var regex = new RegExp(expression);

            if (href.match(regex)) {
                return "<a href='" + href + "' title='" + title + "' target='_blank'>" + href + "</a>";
            } else {
                return "" + href;
            }
        }
    });

    // Please note we're annotating the function so that the $injector works when the file is minified
    jwtInterceptorProvider.tokenGetter = ['config', 'jwtHelper', function(config, jwtHelper) {
        // Skip authentication for any requests ending in .html
        if (config.url.substr(config.url.length - 5) == '.html') {
            return null;
        }

        if (localStorage.signed_in == 'false')
            return null;

        var idToken = localStorage.getItem('id_token');
        if (idToken === null) {
            return null;
        }

        if (jwtHelper.isTokenExpired(idToken)) {
            localStorage.signed_in = false
        } else {
            return idToken;
        }
    }];

    $httpProvider.interceptors.push('jwtInterceptor');

    // ACL Configuration
    AclServiceProvider.config({
        storage: false
    });
}]);

boardApplication.controller('SignInController', ['$scope', '$rootScope', '$http', '$uibModalInstance', '$location',
    function($scope, $rootScope, $http, $uibModalInstance, $location) {
        $scope.form = {
            email: '',
            password: '',
            error: false
        };

        $scope.current_url = $location.absUrl();
        $scope.fb_loading = false;
        $scope.pass_recovery = {
            show: false,
            form: {
                email: '',
                message: false
            }
        };

        $scope.sendEmail = function() {
            $http.get(layer_path + 'auth/lost-password', {
                params: {
                    'email': $scope.pass_recovery.form.email
                }
            }).then(function success(response) {
                $scope.pass_recovery.form.message = {
                    content: 'Se te ha envíado un correo con instrucciones.'
                };
            });
        };

        $scope.signIn = function() {
            if ($scope.form.email === '' || $scope.form.password === '') {
                $scope.form.error = {
                    message: 'Ambos campos son necesarios'
                };
                return;
            }

            // Post credentials to the auth rest point
            $http.post(layer_path + 'auth/get-token', {}, {
                    params: {
                        email: $scope.form.email,
                        password: $scope.form.password
                    },
                    skipAuthorization: true
                })
                .then(function success(response) {
                    var data = response.data;
                    localStorage.setItem('id_token', data.token);
                    localStorage.setItem('firebase_token', data.firebase);
                    localStorage.setItem('signed_in', true);

                    $rootScope.$broadcast('login');
                    $uibModalInstance.dismiss('logged');
                }, function(error) {
                    $scope.form.error = {
                        message: 'Usuario o contraseña incorrecta.'
                    };
                });
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);

boardApplication.controller('SignUpController', ['$scope', '$rootScope', '$http', '$uibModalInstance', '$location',
    function($scope, $rootScope, $http, $uibModalInstance, $location) {
        $scope.form = {
            email: '',
            password: '',
            username: '',
            username_error: false,
            error: false
        };
        $scope.fb_loading = false;
        $scope.current_url = $location.absUrl();

        $scope.check_username = function() {
            if (/^[a-zA-Z][a-zA-Z0-9\-]{1,30}[a-zA-Z0-9]$/.test($scope.form.username)) {
                $scope.form.username_error = false;
            } else {
                $scope.form.username_error = true;
            }
        };

        $scope.signUp = function() {
            if ($scope.form.email === '' || $scope.form.password === '' || $scope.form.username === '') {
                $scope.form.error = {
                    message: 'Todos los campos son necesarios.'
                };
                return;
            }

            // Post credentials to the UserRegisterAction endpoint
            var payload = {
                email: $scope.form.email,
                password: $scope.form.password,
                username: $scope.form.username
            };
            var ref = localStorage.getItem('ref');
            if (ref) {
                payload.ref = ref;
            }

            $http.post(layer_path + 'user', payload, {
                skipAuthorization: true
            })
            .then(function success(response) {
                var data = response.data;
                localStorage.setItem('id_token', data.token);
                localStorage.setItem('firebase_token', data.firebase);
                localStorage.setItem('signed_in', true);
                $uibModalInstance.dismiss('signed');
                $rootScope.$broadcast('login');
            }, function(error) {
                $scope.form.error = {
                    message: 'El usuario o correo elegido ya existe.'
                };
            });
        };

        $scope.ok = function() {
            $uibModalInstance.close($scope.selected.item);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);

/**
 *  Login controller.
 *  @since 1.0
 */

loginController.$inject = ['$rootScope', '$http', '$location'];
function loginController($rootScope, $http, $location) {
    var vm = this;

    vm.currentUrl = $location.absUrl().substr(0, $location.absUrl().length - $location.url().length);
    vm.form = {
        email: '',
        password: '',
        error: false
    };
    vm.error = false;
    vm.loading = false;
    vm.send = send;

    function send() {
        if (vm.loading == true) {
            return;
        }

        vm.loading = true;
        vm.form.error = false;

        // TODO: mover estos fragmentos a un servicio dedicado. (auth service maybe?)
        $http.post(layer_path + 'auth/get-token', {}, {
            params: {
                email: vm.form.email,
                password: vm.form.password
            },
            skipAuthorization: true
        })
        .then(success, failed);

        function success(response) {
            var data = response.data;
            localStorage.setItem('id_token', data.token);
            localStorage.setItem('firebase_token', data.firebase);
            localStorage.setItem('signed_in', true);

            $rootScope.$broadcast('login');
            $location.path('/');
        }

        function failed(error) {
            vm.form.error = true;
            vm.loading = false;
        }
    }
}

signupController.$inject = ['$rootScope', '$http', '$location'];
function signupController($rootScope, $http, $location) {
    var vm = this;
    var ref = localStorage.getItem('ref') || false;

    vm.currentUrl = $location.absUrl().substr(0, $location.absUrl().length - $location.url().length);;
    vm.form = {
        email: '',
        password: '',
        username: ''
    };
    vm.error = false;
    vm.loading = false;
    vm.send = send;

    function send() {
        if (vm.loading == true) {
            return;
        }

        vm.loading = true;
        vm.error = false;

        // Construct and copy payload.
        var payload = Object.assign({}, vm.form);
        if (ref) {
            payload = Object.assign({}, payload, {ref: ref});
        }

        // TODO: mover estos fragmentos a un servicio dedicado. (auth service maybe?)
        $http.post(layer_path + 'user', payload, {
            skipAuthorization: true
        }).then(success, failed);

        function success(response) {
            var data = response.data;
            localStorage.setItem('id_token', data.token);
            localStorage.setItem('firebase_token', data.firebase);
            localStorage.setItem('signed_in', true);
            $rootScope.$broadcast('login');
            $location.path('/');
        }

        function failed(error) {
            vm.error = true;
            vm.loading = false;
        }
    }
}

boardApplication.controller('MainController', [
    '$scope',
    '$rootScope',
    '$http',
    '$uibModal',
    '$timeout',
    '$firebaseObject',
    '$firebaseArray',
    'AclService',
    '$location',
    '$q',
    function($scope, $rootScope, $http, $uibModal, $timeout, $firebaseObject, $firebaseArray, AclService, $location, $q) {
        $scope.user = {
            isLogged: false,
            resolving: false,
            info: null,
            notifications: {
                count: 0,
                list: null
            },
            gaming: {
                coins: 0,
                shit: 0,
                tribute: 0
            }
        }
        $scope.status = {
            post_selected: false,
            selected_post: null,
            last_action: null,
            viewing: 'all',
            pending: 0,
            newer_post_date: null,
            show_categories: false,
            menuCollapsed: true
        }
        $scope.user.isLogged = localStorage.getItem('signed_in') === 'true' ? true : false;
        $scope.misc = {
            gaming: null,
            badges: null,
            role_labels: {
                'developer': 'Software Developer',
                'spartan-girl': 'Spartan Girl',
                'editor': 'Editor',
                'child-moderator': 'Moderador Jr',
                'category-moderator': 'Moderador',
                'super-moderator': 'Super Moderador',
                'administrator': 'Admin'
            }
        };
        $scope.promises = {
            'gaming': null,
            'board_stats': null,
            'self': null
        }
        $scope.update = {
            available: false,
            show: false
        };
        $scope.show_search = function() {
            $rootScope.$broadcast('open_search');
        }
        $scope.logUser = function() {
            $scope.user.resolving = true;
            $scope.promises.self = $q(function(resolve, reject) {
                $http.get(layer_path + 'user/my', {
                    withCredentials: true
                }).then(function success(response) {
                    var data = response.data;
                    $scope.user.resolving = false;
                    $scope.user.info = data;
                    $scope.user.isLogged = true;

                    // Attach the member roles to the current user
                    for (var i in data.roles) {
                        AclService.attachRole(data.roles[i].name);
                    }

                    // Match badges
                    $scope.promises.gaming.then(function() {
                        $timeout(function() {
                            // Match owned badges with current badge info
                            for (var i in data.gaming.badges) {
                                for (var j in $scope.misc.gaming.badges) {
                                    if (data.gaming.badges[i].id === $scope.misc.gaming.badges[j].id) {
                                        $scope.misc.gaming.badges[j].owned = true;
                                        break;
                                    }
                                }
                            }

                            // We check if a required badge is still needed
                            for (var i in $scope.misc.gaming.badges) {
                                if ($scope.misc.gaming.badges[i].required_badge) {
                                    for (var j in $scope.misc.gaming.badges) {
                                        if ($scope.misc.gaming.badges[i].required_badge.id === $scope.misc.gaming.badges[j].id) {
                                            if (!$scope.misc.gaming.badges[j].owned) {
                                                $scope.misc.gaming.badges[i].badge_needed = true;
                                            }
                                        }
                                    }
                                }
                            }
                        }, 0);
                    });

                    // FIREBASE PREPARATION
                    var fbRef = new Firebase(firebase_url);
                    fbRef.onAuth(function onComplete(authData) {
                        if (authData) {
                            //if($scope.can('debug')) console.log("Authenticated to Firebase", authData);
                        } else {
                            console.log("Client unauthenticated.");
                            //$scope.signOut();
                        }
                    });
                    fbRef.authWithCustomToken(/*localStorage.firebase_token*/"W6Y5Yp1xarJgugsmkQYiSFwdICb7f08haTzgqi5Y", function(error, authData)  {
                        if (error) {
                            console.log("Login to Firebase failed!", error);
                        } else {
                            var amOnline = fbRef.child(".info/connected");
                            var userRef = fbRef.child("users").child(data.id);
                            var presenceRef = userRef.child("presence");

                            // We generate a random string to use as a client id
                            var client_id = (0 | Math.random() * 9e6).toString(36);
                            amOnline.on('value', function(snapshot) {
                                if (snapshot.val()) {
                                    presenceRef.child(client_id).onDisconnect().remove();
                                    presenceRef.child(client_id).set(true);
                                }
                            });

                            // Personal info
                            var image = $scope.user.info.image || "";
                            userRef.child("info").set({
                                username: $scope.user.info.username,
                                image: image
                            });

                            // Gamification attributes
                            var gamingRef = userRef.child("gaming");
                            $scope.user.gaming = $firebaseObject(gamingRef);
                            //$scope.user.gaming.$loaded(function() {});

                            // download the data into a local object
                            var notificationsCountRef = userRef.child("notifications/count");
                            var count = $firebaseObject(notificationsCountRef)
                                // synchronize the object with a three-way data binding
                            count.$bindTo($scope, "user.notifications.count");
                            count.$loaded(function() {
                                var to_show = 15;
                                if (count.$value > 15) {
                                    to_show = count.$value;
                                }
                                var list_ref = userRef.child("notifications/list");
                                $scope.user.notifications.list = $firebaseArray(list_ref.limitToLast(to_show));

                                // We wait till notifications list is loaded
                                $scope.user.notifications.list.$loaded()
                                    .then(function(x) {
                                        x.$watch(function(event) {
                                            // Notification sound
                                            if (event.event === "child_added") {
                                                var audio = new Audio('/sounds/notification.mp3');
                                                audio.play();
                                            }
                                        });
                                    });
                            });
                        }
                    });

                    if ($location.path() == '/home') {
                        window.location.href = "/";
                    }

                    // Warn everyone
                    $timeout(function() {
                        $scope.$broadcast('userLogged');
                        $scope.$broadcast('changedContainers');
                        resolve();
                    }, 100);
                }, function(response) {
                    // If error while getting personal info, just log him out
                    $scope.signOut();
                    reject();
                });
            });
        }

        $scope.signUp = function() {
            var modalInstance = $uibModal.open({
                templateUrl: '/app/partials/sign-up.html',
                controller: 'SignUpController',
                size: 'sm'
            });

            modalInstance.result.then(function() {}, function() {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.signOut = function() {
            //$http.get(layer_path + 'auth/logout').then(function success(response) {
            localStorage.signed_in = false;
            $scope.user.isLogged = false;
            localStorage.removeItem('id_token');
            localStorage.removeItem('firebase_token');
            window.location = $location.absUrl();;
            //});
        };

        $scope.toggle_notifications = function() {
            $scope.user.notifications.count.$value = 0;
            $timeout(function()  {
                var arrayLength = $scope.user.notifications.list.length;
                for (var i = 0; i < arrayLength; i++) {
                    if (!$scope.user.notifications.list[i].seen) {
                        $scope.user.notifications.list[i].seen = true;
                        $scope.user.notifications.list.$save(i);
                    }
                }
            }, 50);
        };

        $scope.toggle_notification = function(elem) {
            if (!elem.seen) {
                $scope.user.notifications.count.$value = $scope.user.notifications.count.$value - 1;
                if ($scope.user.notifications.count.$value < 0) {
                    $scope.user.notifications.count.$value = 0;
                }
                elem.seen = true;
                $scope.user.notifications.list.$save(elem);
            }
        };

        $scope.total_notifications = function() {
            var user = $scope.user || {};
            var info = $scope.user.info || {};

            return parseInt(user.notifications.count.$value || 0) + (info.validated ? 0 : 1);
        };

        $scope.reloadPost = function() {
            $scope.$broadcast('reloadPost');
        };

        // Used for updating platform
        $scope.reloadPage = function() {
            window.location.reload(true);
        };

        // If login action sucessfull anywhere, sign in the user
        $scope.$on('login', function(e) {
            $scope.logUser();
        });

        // Board updates notification
        var fbRef = new Firebase(firebase_url);
        var updatesRef = fbRef.child('version');
        updatesRef.on('value', function(ss) {
            $scope.$apply(function() {
                if (parseInt(ss.val()) > parseInt(version)) {
                    $scope.update.available = true;
                    $timeout(function() {
                        $scope.update.show = true;
                    }, 100);
                    $timeout(function() {
                        $scope.reloadPage();
                    }, 30 * 1000);
                } else {
                    $scope.update.show = false;
                    $scope.update.available = false;
                }
            });
        });

        // If already signed in, sign in the user
        if (localStorage.signed_in === 'true') {
            $scope.logUser();
        }

        // Load platform stats
        $scope.promises.board_stats = $http.get(layer_path + 'stats/board').
        then(function success(response) {
            $scope.status.stats = response.data;
        });

        // Load gamification data
        $scope.promises.gaming = $http.get(layer_path + 'gamification').
        then(function success(response) {
            var data = response.data;
            for (var i in data.badges) {
                if (data.badges[i].required_badge !== null) {
                    for (var j in data.badges) {
                        if (data.badges[j].id == data.badges[i].required_badge) {
                            data.badges[i].required_badge = data.badges[j];
                            break;
                        }
                    }
                }
            }
            $scope.misc.gaming = data;
        });

        // Friends invitations
        var ref = $location.search().ref;
        if (ref != undefined) {
            localStorage.setItem('ref', ref);
        }
    }
]);

boardApplication.run(['$rootScope', '$http', 'AclService', 'AdvancedAcl', '$location', function($rootScope, $http, AclService, AdvancedAcl, $location) {
    $rootScope.location = $location;

    $rootScope.rolesMap = {
        'user': 'Legión buldar',
        'developer': 'Dev team',
        'administrator': 'Admin',
        'category-moderator': 'Mod',
        'super-moderator': 'Smod'
    };

    $rootScope.componentsMap = {
        cpu: 'Procesador (CPU)',
        motherboard: 'Tarjeta madre (motherboard)',
        ram: 'Memoría RAM',
        storage: 'Almacenamiento',
        cooler: 'Cooler del CPU',
        power: 'Fuente de poder',
        cabinet: 'Gabinete',
        screen: 'Pantalla',
        videocard: 'Tarjeta de video'
    };

    // Initialize the local storage
    if (!localStorage.signed_in) {
        localStorage.signed_in = false;
    }

    var location = $location.path();

    if ($location.search().fbToken && $location.search().token) {
        localStorage.setItem('signed_in', 'true');
        localStorage.setItem('id_token', $location.search().token);
        localStorage.setItem('firebase_token', $location.search().fbToken);
        $location.search('fbToken', null);
        $location.search('token', null);
    }

    $rootScope.page = {
        title: "Buldar | Comunidad de tecnología, geeks y más",
        description: "Creamos el mejor contenido para Geeks, y lo hacemos con pasión e irreverencia de Spartanos."
    };

    // Set the ACL data.
    // The data should have the roles as the property names,
    // with arrays listing their permissions as their value.
    var aclData = {};
    $http.get(layer_path + 'permissions')
        .then(function success(response) {
            data = response.data;
            // Proccess de roles and permissions iteratively
            for (var r in data.rules) {
                aclData[r] = data.rules[r].permissions;
                var current = data.rules[r];
                while (current.parents.length > 0) {
                    aclData[r] = aclData[r].concat(data.rules[current.parents[0]].permissions);
                    current = data.rules[current.parents[0]];
                }
            }
            AclService.setAbilities(aclData);
        }, function(error) {
            // How should we proceed if no data?
        });
    $rootScope.can = AclService.can;
    $rootScope.aacl = AdvancedAcl;

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        var signedIn = localStorage.getItem('signed_in') === 'true';

        if ($location.path() == '/' && signedIn == false) {
            $location.path('/unete');
        }
    });
}]);