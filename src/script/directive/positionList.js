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