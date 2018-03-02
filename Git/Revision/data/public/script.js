$(document).ready(function(){
    if(localStorage.getItem('token')){
        $('[data-use="connection"]').toggleClass('hidden');
        $('[data-use="new"]').toggleClass('hidden');
        $('[data-use="getToDo"]').toggleClass('hidden');
        $('[data-action="disconnect"]').toggleClass('hidden');
                
    }
    $('[data-action="connect"]').on('click',function(){
        var pass = $('[data-use="password"]')[0].value;
        var name = $('[data-use="name"]')[0].value;
        $.post("http://192.168.33.40:4000/api/users/connect", {name: name, password: pass}, function(data){
            if(data.currentToken)
            {
                var htmlRender = "";
                localStorage.setItem('token', data.currentToken);
                $('[data-use="connection"]').toggleClass('hidden');
                $('[data-use="result"]').html(htmlRender);
                $('[data-use="new"]').toggleClass('hidden');
                $('[data-use="getToDo"]').toggleClass('hidden');
                $('[data-action="disconnect"]').toggleClass('hidden');
                
            }
            else 
            {
                console.log('erreur');
            }
        });
    })
    $('[data-action="newTask"]').on('click', function(){
        var task = $('[data-use="newTask"]')[0].value;
        debugger;
        var token = localStorage.getItem('token');
        if (task != ""){
            $.post("http://192.168.33.40:4000/admin/api/users/newtask?task=?&token=?",{task: task, token: token},function(data){
            var htmlRender = "";
            if(data.error){
                console.log(data);
            }
            else
            {
                for (var i = 0; i < data.length; i++)
                {
                    htmlRender += data[i].task + "<br>";
                }
                $('[data-use="result"]').html(htmlRender);
            }
            })
        }
    })
    $('[data-action="subscribe"]').on('click', function(){
        var pass = $('[data-use="newpassword"]')[0].value;
        var name = $('[data-use="newname"]')[0].value;
        $.post("http://192.168.33.40:4000/api/users/new",{name: name, password: pass}, function(data){
            if(data.error){
                console.log('erreur');
            }
            else{
                var htmlRender = "Vous pouvez maintenant vous connecter";
                $('[data-use="result"]').html(htmlRender);
            }
        })
    })
    $('[data-action="disconnect"]').on('click', function(){
        localStorage.removeItem('token');
        alert("Vous etes deconnecté");
        location.reload();
    })
    $('[data-action="getToDo"]').on('click', function(){
        $.get("http://192.168.33.40:4000/admin/api/users/todo?token=" + localStorage.getItem('token'),function(data){
            var htmlRender = "";
            if(data.error){
                console.log(data);
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