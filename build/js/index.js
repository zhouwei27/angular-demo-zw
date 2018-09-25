'use strict';

angular.module('app',['ui.router','ngCookies']);
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
    });
    $urlRouterProvider.otherwise('main');
}])


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
            data: '='
        }//接口
    };
}]);
'use strict';

angular.module('app').directive('appSheet',[function(){
    return{
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/sheet.html'
    };
}])
'use strict';

angular.module('app').directive('appTab',[function(){
    return{
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/tab.html'
    };
}])
'use strict';

angular.module('app').controller('companyCtrl',['$http','$state','$scope',function($http,$state,$scope){
  $http.get('data/company.json?id='+$state.params.id).then(function(resp){
    $scope.company = resp.data;
  });
}]);
'use strict';

angular.module('app').controller('mainCtrl',['$http','$scope',function($http,$scope){
    $http.get('data/positionList.json').then(function(resp){
        $scope.list = resp.data;
    })
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

angular.module('app').controller('searchCtrl',['$http','$scope',function($http,$scope){
   $http.get('data/positionList.json').then(function(resp){
    $scope.positionList = resp.data;
   });
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