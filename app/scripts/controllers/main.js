'use strict';

angular.module('v2App')
  .controller('MainCtrl', function ($scope, $http, $q, $timeout) {

    init();

     if($scope.query.keywords != '') { 
            $scope.noterms = false;
            $scope.search();
        };


    function init() {

        $scope.query = {
            keywords : ''
        };

        $scope.noterms = true;

        $scope.limiters = {
            type: [],
            subject: [],
            dateAfter: '',
            dateBefore: ''
            
        }

        $scope.results = {};

        var queryOpts = {
            key: '1068fc55492c7f63c961485c136ee67f',
            url: 'http://api.dp.la/v2/items?q=',
            facets: 'sourceResource.date.begin,sourceResource.subject.name,sourceResource.type,sourceResource.spatial.name&facet_size=100',
            size : 10,
            page : 1
        };

        $scope.search = function() {

            $scope.noterms = false;

            queryOpts.page = 1;

            $scope.loading = true;

            $scope.endOfResults = false;

            makeApiString();

            // console.log('apicall', apiCall);

            $http.jsonp(apiCall).
                 success(function(data, status, headers, config) {

                    $scope.loading = false;
                  
                    var d = data;
                    // console.log(d);

                    $scope.count = d.count;

                    $scope.results = d.docs;

                    console.log(d.docs);


                    $scope.aggs = {

                        type : d.facets['sourceResource.type'],
                        subject : d.facets['sourceResource.subject.name'],
                        date : d.facets['sourceResource.date.begin'].entries
                    }
                    // console.log($scope.aggs.date);

                 }).
                 error(function(data, status, headers, config) {

                    $scope.loading = false;

                    $scope.error = true;

                });
        }

        var timeout;
        $scope.loadMore = function(){
            clearTimeout(timeout);
            $scope.loadingMore = true;
            timeout = setTimeout(function(){
                if ($scope.noterms || $scope.results.length >= $scope.count){
                    $scope.loadingMore = false;
                    $scope.endOfResults = true;
                    return;
                } else {
                    loadmore();
                }
            }, 80);
        }

         $scope.addTypeFilter = function(filter) {
            if($scope.limiters.type.indexOf(filter) < 0 ){
                $scope.limiters.type.push(filter);
                $scope.search();
            }
        }

        $scope.rmTypeFilter = function(filter) {
            var i = $scope.limiters.type.indexOf(filter);
            if (i < 0) { return; } else {
                $scope.limiters.type.splice(i,1);
                $scope.search();
            }
        }

        $scope.addSubjFilter = function(filter) {
            if($scope.limiters.type.indexOf(filter) < 0 ){
                $scope.limiters.subject.push(filter);
                $scope.search();
            }
        }

        $scope.rmSubjFilter = function(filter) {
            var i = $scope.limiters.subject.indexOf(filter);
            if (i < 0) { return; } else {
                $scope.limiters.subject.splice(i,1);
                $scope.search();
            }
        }

        $scope.addDateFilter = function(start, end){
            $scope.limiters.dateAfter = start;
            $scope.limiters.dateBefore = end;
            $scope.dateFilter = start + ' to ' + end;
            $scope.search();
        }

        $scope.rmDateFilter = function(){
            $scope.limiters.dateAfter = '';
            $scope.limiters.dateBefore = '';
            $scope.dateFilter = '';
            $scope.search();
        }

        // pass data from child directives (d3)
        $scope.onClick = function(f){
            $scope.$apply(function(){
                f
            });
        }


        var apiCall;


        function makeApiString() {
            apiCall = queryOpts.url;
            apiCall += $scope.query.keywords;

            apiCall += ("&sourceResource.type=" + encodeURI($scope.limiters.type.toString())); 
            apiCall += ("&sourceResource.subject=" + encodeURI($scope.limiters.subject.toString()));

            if ($scope.limiters.dateAfter) { apiCall += ("&sourceResource.date.after=" + $scope.limiters.dateAfter)}
            if ($scope.limiters.dateBefore) { apiCall += ("&sourceResource.date.before=" + $scope.limiters.dateBefore)}

            apiCall += ("&page_size=" + queryOpts.size);
            apiCall += ('&facets=' + queryOpts.facets);
            apiCall += ('&page=' + queryOpts.page);

            apiCall += ("&callback=JSON_CALLBACK" + '&api_key=' + queryOpts.key);
        }

        function loadmore() {


            console.log($scope.results.length);

            // if($scope.results.length)

            // console.log('LOADMORE', queryOpts.page)

            $scope.loadingMore = true;

            queryOpts.page++;

            makeApiString();

            $http.jsonp(apiCall).
                 success(function(data, status, headers, config) {

                    $scope.loadingMore = false;

                    var d = data;

                    // var existingresults = $scope.results;

                    $scope.results = $scope.results.concat(d.docs);

                    // console.log($scope.results);

                 }).
                 error(function(data, status, headers, config) {

                    $scope.loadingMore = false;

                    $scope.error = true;

                });
        }
    }

  });


