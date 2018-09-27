'use strict';

angular.module('app').directive('appPositionList',['$http',function($http){
    return{
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/positionList.html',
        //表示当前scope与控制器的scope是共享的
        scope: {
            data: '=',
            filterObj: '=',
            isFavorite: '='
        },//接口
        link: function($scope){
            $scope.select = function(item){
                $http.post('data/favorite.json',{
                    id: item.id,
                    select: !item.select
                }).success(function(resp){
                    item.select = !item.select;
                });
            };
        }
    };
}]);