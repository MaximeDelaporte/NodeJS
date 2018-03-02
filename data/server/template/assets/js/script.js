$(function(){
    var socket =io('/a');
    $('[data-action="roomChange"]').on('click', function(){
           var socket = io('/' + this.value);
    })
 
    $('[data-action="action"]').on('click', function (){
      socket.emit('action', {
          message: this.value,
          user: $('[name="pseudo"]')[0].value
      });
  })
    socket.on('event', function(msg){
        $('[data-use="view"]').append('<p>' + msg + "</p>")
    });
});