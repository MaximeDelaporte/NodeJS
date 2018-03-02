$(document).ready(function(){
    if(localStorage.getItem('token')){
        $('[data-use="connection"]').toggleClass('hidden');
        $('[data-use="getToDo"]').toggleClass('hidden');
        $('[data-action="disconnect"]').toggleClass('hidden');
                
    }
    $('[data-action="connect"]').on('click',function(){
        var pass = $('[data-use="password"]')[0].value;
        var name = $('[data-use="name"]')[0].value;
        $.post("http://192.168.33.10:4000/api/users/connect", {name: name, password: pass}, function(data){
            if(data.currentToken)
            {
                localStorage.setItem('token', data.currentToken);
                $('[data-use="connection"]').toggleClass('hidden');
                $('[data-use="getToDo"]').toggleClass('hidden');
                $('[data-action="disconnect"]').toggleClass('hidden');
                
            }
            else 
            {
                console.log('erreur');
            }
        });
    })
    $('[data-action="disconnect"]').on('click', function(){
        localStorage.removeItem('token');
        alert("Vous etes deconnecté");
        location.reload();
    })
    $('[data-action="getToDo"]').on('click', function(){
        $.get("http://192.168.33.10:4000/admin/api/users/todo?token=" + localStorage.getItem('token'),function(data){
            var htmlRender = "";
            if(data.error){
                console.log(data.message);
            }
            else
            {
                for (var i = 0; i < data.length; i++)
                {
                    htmlRender += data[i].task + "<br>";
                }
                $('[data-use="result"]').html(htmlRender);
            }
        });
    })
    
});