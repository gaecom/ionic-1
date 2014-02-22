angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('PetService', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var pets = [
    { id: 0, title: 'Cats', description: 'Furry little creatures. Obsessed with plotting assassination, but never following through on it.' },
    { id: 1, title: 'Dogs', description: 'Lovable. Loyal almost to a fault. Smarter than they let on.' },
    { id: 2, title: 'Turtles', description: 'Everyone likes turtles.' },
    { id: 3, title: 'Sharks', description: 'An advanced pet. Needs millions of gallons of salt water. Will happily eat you.' }
  ];

  return {
    all: function() {
      return pets;
    },
    get: function(petId) {
      // Simple index lookup
      return pets[petId];
    }
  }
});




angular.module('services.sockjs').factory
    ( 'socketService'
        , [ '$rootScope'
        , '$log'
        , function
            ( $rootScope
                , $log
                ){
            var createSocket = function(){

                // Get reference to port.
                var port = (location.port != 80) ? ':' + location.port : '';

                socket = new SockJS
                ( '//' + document.domain + '' + port + '/api'
                    , ''
                    , { 'debug':true
                        , 'devel' : true
                        , 'protocols_whitelist':
                            [ 'xdr-streaming'
                                , 'xdr-polling'
                                , 'xhr-streaming'
                                , 'iframe-eventsource'
                                , 'iframe-htmlfile'
                                , 'xhr-polling'
                                , 'websocket'
                            ]
                    }
                );

                /**
                 * ## Data interaction hooks
                 *
                 * Passes off core SockJS data interaction hooks to rest of application so
                 * callbacks can be cleanly defined externally for each event.
                 */
                socket.onopen = function(){
                    var args = arguments;
                    service.open = true;
                    service.timesOpened++;
                    // Attempted to connect. Note timestamp.
                    connectTimeStamps.push( new Date().getTime() );

                    $rootScope.$broadcast( 'SOCKET_CLOSED' );

                    if( service.handlers.onopen ){
                        $rootScope.$apply
                        ( function(){
                                service.handlers.onopen.apply( socket, args )
                            }
                        )
                    }
                }

                socket.onmessage = function( data ){
                    var args = arguments;
                    try{
                        args[0].data = JSON.parse(args[0].data);
                    } catch(e){
                        // there should be a better way to do this
                        // but it is fast
                    }

                    if( service.handlers.onmessage ){
                        $rootScope.$apply(
                            function(){
                                service.handlers.onmessage.apply(socket, args);
                            }
                        )
                    }
                }

                socket.onclose = function(){
                    service.open = false;
                    setTimeout( function(){ socket = createSocket(service); } , 3000 );
                    var args = arguments;
                    $rootScope.$broadcast( 'SOCKET_OPEN' );

                    if( service.handlers.onclose ){
                        $rootScope.$apply(
                            function(){
                                service.handlers.onclose.apply(socket,args);
                            }
                        )
                    }
                }

                return socket;
            }

            var service =
            { handlers : {}
                , onopen:
                function( callback ){
                    this.handlers.onopen = callback;
                }
                , onmessage:
                function( callback ){
                    this.handlers.onmessage = callback;
                }
                , onclose:
                function( callback ){
                    this.handlers.onclose = callback;
                }
                , send:
                function( data ){
                    var msg = typeof(data) == "object" ? JSON.stringify(data) : data;
                    var status = socket.send(msg);
                }
                , open: false
            };

            var socket = createSocket();
            return service;
        }
    ]
    );
