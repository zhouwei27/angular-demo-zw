'use strict';

angular.module('app',['ui.router']);
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
    });
    $urlRouterProvider.otherwise('main');
}])


'use strict';

angular.module('app').controller('companyCtrl',['$scope',function($scope){
  
}]);
'use strict';

angular.module('app').controller('mainCtrl',['$http','$scope',function($http,$scope){
    $http.get('data/positionList.json').then(function(resp){
        $scope.list = resp.data;
    })
}]);
'use strict';

angular.module('app').controller('positionCtrl',['$q','$http','$scope','$state',function($q,$http,$scope,$state){
  $scope.isLogin = false;
  function getPosition () {
    var def = $q.defer();
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
        templateUrl: 'view/template/positionClass.html'
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