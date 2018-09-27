'use strict';

angular.module('app',['ui.router','ngCookies','validation']);
'use strict';

angular.module('app').value('dict',{}).run(['dict','$http',function(dict,$http){
    $http.get('data/city.json').then(function(resp){
        dict.city = resp.data;
    });
    $http.get('data/salary.json').then(function(resp){
        dict.salary = resp.data;
    });
    $http.get('data/scale.json').then(function(resp){
        dict.scale = resp.data;
    });
}]);
'use strict';

angular.module('app').config(['$provide',function($provide){
    $provide.decorator('$http',['$delegate','$q',function($delegate,$q){
        $delegate.post = function(url,data,config){
            var def = $q.defer();
            $delegate.get(url).then(function(resp){
                def.resolve(resp)
            }).catch(function(err){
                def.reject(err);
            });
            return {
                success: function(cb){
                    def.promise.then(cb);
                },
                error: function(cb){
                    def.promise.then(null,cb);
                }
            }
        }
        return $delegate;
    }]);
}])
'use strict';

angular.module('app').config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
    $stateProvider.state('main',{
        url: '/main',
        templateUrl: 'view/main.html',
        controller: 'mainCtrl'
    }).state('position',{
        url: '/position/:id',
        templateUrl: 'view/position.html',
        controller: 'positionCtrl'
    }).state('company',{
        url: '/company/:id',
        templateUrl: 'view/company.html',
        controller: 'companyCtrl'
    }).state('search',{
        url: '/search',
        templateUrl: 'view/search.html',
        controller: 'searchCtrl'
    }).state('login',{
        url: '/login',
        templateUrl: 'view/login.html',
        controller: 'loginCtrl'
    }).state('register',{
        url: '/register',
        templateUrl: 'view/register.html',
        controller: 'registerCtrl'
    }).state('me',{
        url: '/me',
        templateUrl: 'view/me.html',
        controller: 'meCtrl'
    }).state('post',{
        url: '/post',
        templateUrl: 'view/post.html',
        controller: 'postCtrl'
    }).state('favorite',{
        url: '/favorite',
        templateUrl: 'view/favorite.html',
        controller: 'favoriteCtrl'
    });
    $urlRouterProvider.otherwise('main');
}])


'use strict';

angular.module('app').config(['$validationProvider',function($validationProvider){
    var expression = {
        phone: /^1[\d]{10}$/,  //正则表达式  表示以1开头后面接10位数字
        password: function(value){
            var str = value + '';
            return str.length > 5;
        },
        required: function(value){
            return !!value;
        }
    };
    var defaultMsg = {
        phone: {
            success: '',
            error: '必须是11位手机号'
        },
        password: {
            success: '',
            error: '长度至少6位'
        },
        required: {
            success: '',
            error: '不能为空'
        }
    };
    $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
}]);
'use strict';

angular.module('app').controller('companyCtrl',['$http','$state','$scope',function($http,$state,$scope){
  $http.get('data/company.json?id='+$state.params.id).then(function(resp){
    $scope.company = resp.data;
  });
}]);
'use strict';

angular.module('app').controller('favoriteCtrl',['$http','$scope',function($http,$scope){
}]);
'use strict';

angular.module('app').controller('loginCtrl',['cache','$http','$scope','$state',function(cache,$http,$scope,$state){
    $scope.submit = function(){
        $http.post('data/login.json',$scope.user).success(function(resp){
            cache.put('id',resp.data.id);
            cache.put('name',resp.data.name);
            cache.put('image',resp.data.image);
            $state.go('main');
        });
    }
}]);
'use strict';

angular.module('app').controller('mainCtrl',['$http','$scope',function($http,$scope){
    $http.get('data/positionList.json').then(function(resp){
        $scope.list = resp.data;
    })
}]);
'use strict';

angular.module('app').controller('meCtrl',['$http','$scope','cache','$state',function($http,$scope,cache,$state){
    if(cache.get('name')){
        $scope.name = cache.get('name');
        $scope.image = cache.get('image');
    }
    $scope.logout = function(){
        cache.remove('id');
        cache.remove('name');
        cache.remove('image');
        $state.go('main');
    }
}]);
'use strict';

angular.module('app').controller('positionCtrl',['$q','$http','$scope','$state','cache',function($q,$http,$scope,$state,cache){
  // cache.remove('to');
  $scope.isLogin = false;
  function getPosition () {
    var def = $q.defer();//创建一个延迟加载对象
    $http.get('data/position.json?id='+$state.params.id).then(function(resp){
        $scope.position = resp.data;
        def.resolve(resp);
    }).catch(function(err){
        def.reject(err);
    });
    return def.promise;
  }
  function getCompany(id){
    $http.get('data/company.json?id='+id).then(function(resp){
        $scope.company = resp.data;
    })
  }
  getPosition().then(function(obj){
    getCompany(obj.companyId);
  })
}]);
'use strict';

angular.module('app').controller('postCtrl',['$http','$scope',function($http,$scope){
    $scope.tabList = [{
        id: 'all',
        name: '全部'
    },{
        id: 'pass',
        name: '面试邀请'
    },{
        id: 'fail',
        name: '不合适'
    }];
    $http.get('data/myPost.json').then(function(resp){
        $scope.positionList = resp.data;
    });
    $scope.filterObj = {};
    $scope.tClick = function(id,name){
        switch (id) {
            case 'all':
                delete $scope.filterObj.state;
                break;
            case 'pass':
                $scope.filterObj.state = '1';
                break;
            case 'fail':
                $scope.filterObj.state = '-1';
                break;   
            default:
                break;
        }
    }
}]);
'use strict';

angular.module('app').controller('registerCtrl',['$http','$scope','$interval','$state',function($http,$scope,$interval,$state){
    $scope.submit = function(){
        $http.post('data/regist.json',$scope.user).success(function(resp){
            $state.go('login');
        });
    }
    var count = 60;
    $scope.send = function(){
        $http.get('data/code.json').then(function(resp){
            if(resp.data.state===1){
                count = 60;
                $scope.time = '60s';
                var interval = $interval(function(){
                    if(count<=0){
                        $interval.cancel(interval);
                        $scope.time = '';
                        return ;
                    }
                    else{
                        count--;
                        $scope.time = count + 's';
                    }     
                },1000);
            }
        });
    }
}]);
'use strict';

angular.module('app').controller('searchCtrl',['dict','$http','$scope',function(dict,$http,$scope){
    $scope.search = function(){
        $scope.name = '';
        $http.get('data/positionList.json?name='+$scope.name).then(function(resp){
            $scope.positionList = resp.data;
        });
    };
    $scope.search();
    $scope.sheet = {};
    $scope.tabList = [{
        id: 'city',
        name: '城市'
    },{
        id: 'salary',
        name: '薪水'
    },{
        id: 'scale',
        name: '公司规模'
    }];
    $scope.filterObj = {};
    var tabId = '';
    $scope.tClick = function(id,name){
        tabId = id;
        $scope.sheet.list = dict[id];
        $scope.sheet.visible = true;
    };
    $scope.sClick = function(id,name){
        if(id){
            angular.forEach($scope.tabList,function(item){
                if(item.id===tabId){
                    item.name = name;
                }
            });
            $scope.filterObj[tabId + 'Id'] = id;
        }
        else{
            delete $scope.filterObj[tabId + 'Id'];
            angular.forEach($scope.tabList,function(item){
                if(item.id===tabId){
                    switch(item.id){
                        case 'city': item.name = '城市'; break;
                        case 'salary': item.name = '薪资'; break;
                        case 'scale': item.name = '公司规模'; break;
                        default: ;
                    }
                }
            })
        }
    }
}]);
'use strict';

angular.module('app').directive('appCompany',[function(){
    return{
        restrict: 'A',
        replace: true,
        scope: {
            com: '='
        },
        templateUrl: 'view/template/company.html'
    };
}]);
'use strict';

angular.module('app').directive('appFoot',[function(){
    return{
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/foot.html'
    };
}]);
'use strict';
angular.module('app').directive('appHead',[function(){
    return{
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/head.html'
    };
}]);
'use strict';
angular.module('app').directive('appHeadBar',[function(){
    return{
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/headBar.html',
        scope: {
            text: '@'
        },
        link: function($scope){
            $scope.back = function(){
                window.history.back();
            }
        }
    };
}]);
'use strict';

angular.module('app').directive('appPositionClass',[function(){
    return{
        restrict: 'A',
        replace: true,
        scope:{
            com: '='
        },
        templateUrl: 'view/template/positionClass.html',
        link: function($scope){
            $scope.showPositionList = function(idx){
               $scope.positionList = $scope.com.positionClass[idx].positionList;
               $scope.isActive = idx; 
            }
            $scope.$watch('com',function(newVal){
                if(newVal){
                    $scope.showPositionList(0);
                }
            })
        }
    };
}]);
'use strict';

angular.module('app').directive('appPositionInfo',[function(){
    return{
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/positionInfo.html',
        scope: {
            isActive: '=',
            isLogin: '=',
            pos: '='
        },
        link: function($scope){
            $scope.imagePath = $scope.isActive ? 'image/star-active.jpg' : 'image/star.jpg';
        }
    }
}]);
'use strict';

angular.module('app').directive('appPositionList',[function(){
    return{
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/positionList.html',
        //表示当前scope与控制器的scope是共享的
        scope: {
            data: '=',
            filterObj: '='
        }//接口
    };
}]);
'use strict';

angular.module('app').directive('appSheet',[function(){
    return{
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/sheet.html',
        scope: {
            list: '=',
            visible: '=',
            select: '&'
        }
    };
}])
'use strict';

angular.module('app').directive('appTab',[function(){
    return{
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/tab.html',
        scope: {
            list: '=',
            tabClick: '&'
        },
        link: function($scope){
            $scope.click = function(tab){
                $scope.selectId = tab.id;
                $scope.tabClick(tab);
            }
        }
    };
}])
'use strict';

angular.module('app').filter('filterByObj',[function(){
    return function(list,obj){
        var result = [];
        angular.forEach(list,function(item){
            var isEqual = true;
            for(var e in obj){
                if(item[e]!==obj[e]){
                    isEqual = false;
                }
            }
            if(isEqual){
                result.push(item);
            }
        });
        return result;
    };
}]);
'use strict';

angular.module('app').service('cache',['$cookies',function($cookies){
    this.put = function(key,value){
        $cookies.put(key,value);
    };
    this.get = function(key){
        return $cookies.get(key);
    };
    this.remove = function(key){
        $cookies.remove(key);
    }
}]);

// angular.module('app').factory('cache',['$cookies',function($cookies){
//     return{
//         put: function(key,value){
//             $cookies.put(key,value);
//         },
//         get: function(key){
//             return $cookies.get(key);
//         }
//     };
// }]);