$(document).ready(function(){
    if(localStorage.getItem('token')){
        $('[data-use="connection"]').toggleClass('hidden');
        $('[data-use="account"]').toggleClass('hidden');
        $('[data-use="books"]').toggleClass('hidden');
        $('[data-action="disconnect"]').toggleClass('hidden');
                
    }
    $('[data-use="account"]').on('click', function(){
        $('[data-use="new"]').toggleClass('hidden');
    })
    $('[data-action="connect"]').on('click',function(){
        var pass = $('[data-use="password"]')[0].value;
        var name = $('[data-use="name"]')[0].value;
        $.post("http://192.168.33.30:4000/users/connect", {name: name, password: pass}, function(data){
            if(data.currentToken)
            {
                var htmlRender = "";
                localStorage.setItem('token', data.currentToken);
                $('[data-use="connection"]').toggleClass('hidden');
                $('[data-use="result"]').html(htmlRender);
                $('[data-use="account"]').toggleClass('hidden');
                if(!($('[data-use="new"]').hasClass('hidden'))){
                    $('[data-use="new"]').toggleClass('hidden');
                } 
                $('[data-use="books"]').toggleClass('hidden');
                $('[data-action="disconnect"]').toggleClass('hidden');
                
            }
            else 
            {
                console.log('erreur');
            }
        });
    })
    $('[data-action="newBook"]').on('click', function(){
        debugger;
        var title = $('[data-use="newBookTitle"]')[0].value;
        var author = $('[data-use="newBookAuthor"]')[0].value;
        var editor = $('[data-use="newBookEditor"]')[0].value;
        var token= localStorage.getItem('token')
        var htmlRender = "";
        if (title != "" && author != "" && editor != ""){
            $.post("http://192.168.33.30:4000/admin/newbook?token=" + token ,{title:title , author: author, editor: editor},function(data){
                debugger;
                if(data == "failed"){
                    htmlRender = "<p>Book already added</p>";
                }
                else{
                     htmlRender = "<p>Book added to collection</p>";
                }
            })
        }
        else{
            htmlRender = "<p>Give all info to register this book</p>"
        }
        $('[data-use="result"]').html(htmlRender);
    })
    $('[data-action="subscribe"]').on('click', function(){
        var pass = $('[data-use="newpassword"]')[0].value;
        var name = $('[data-use="newname"]')[0].value;
        $.post("http://192.168.33.30:4000/users/new",{name: name, password: pass}, function(data){
            if(data.error){
                console.log('erreur');
            }
            else{
                var htmlRender = "<p>Vous pouvez maintenant vous connecter</p>";
                $('[data-use="result"]').html(htmlRender);
            }
        })
    })
    $('[data-action="disconnect"]').on('click', function(){
        localStorage.removeItem('token');
        alert("Vous etes deconnecté");
        location.reload();
    })
    $('[data-action="getBooks"]').on('click', function(){
        $.get("http://192.168.33.30:4000/admin/books/all?token=" + localStorage.getItem('token'),function(data){
            var htmlRender = "";
            if(data.error){
                console.log(data);
            }
            else
            {
                htmlRender +="<ul>";
                for(var i = 0; i < data.length; i++)
                {
                    htmlRender += "<li class='bookList'>" + data[i].title + "<input type='checkbox'value=" + data[i].id + "></li>"
                }
                htmlRender +="</ul>";
                $('[data-use="result"]').html(htmlRender);
            }
        });
    })
    $('body').on('click', '[data-action="delete"]',function(){
        test = $(this).parent().text()
        debugger;
    })
    $('#deleteAcc').on('click', function(){
        var checkList= $('[type="checkbox"]');
        for(var i = 0; i < checkList.length; i++){
            if(checkList[i].checked == true){
				debugger;
                $.post("http://192.168.33.30:4000/admin/books/delete?token=" + localStorage.getItem('token'), {id: checkList[i].value}, function(data){
                    if(data.error){
                        alert("Error, No book found in database")
                    }
                })
            }
        }
        $('.bookList input:checked').parent().remove();
    })
});