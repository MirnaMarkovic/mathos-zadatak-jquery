$(document).ready(function(){
	var API='http://193.246.33.24/data';
	var todo=$("#todo");
	$.get(API, {user:10}, function(data){
		$.each(data,function(i,td){
           addTodo(td);
		});
	});

	function addTodo(td){
    todo.append('<div class="col-sm-6 col-md-4"><div class="thumbnail" data-id="'+td.id+'"><div class="caption"><h3 class="naslov">'+td.naslov+'</h3><p class="datum">'+td.datum+'</p><p class="opis">'+td.opis+'</p><p><button class="btn btn-warning edit">Edit</button> <button class="btn btn-danger delete">Delete</button> <button class="btn btn-success done">Done</button></p></div></div></div>');
	};
  
  $("#datepicker").datepicker();
  $("#edit-datepicker").datepicker();

//Dodavanje novih zadataka preko dijaloga
  var dialog=$("#dialog").dialog({
    autoOpen:false,
    modal:true,
    buttons:{
      'Dodaj zadatak': function(){
          form.submit();
      },
      Cancel:function(){
        dialog.dialog('close');
      }
    }
  });

  $("#addNew").click(function(){
    dialog.dialog('open');
  });

  var form=dialog.find('form');
  form.on('submit',function(e){
    e.preventDefault();
    $.post(API + '/create', form.serialize()).done(function(data){
      addTodo(data);
      dialog.dialog('close');
    }).fail(function(error){
      console.log(error.responseText);
    });
  });

//Brisanje zadataka pomoću dijaloga
  var deleteTodo;
  todo.on('click','.delete',function(){
    deleteDialog.dialog('open');
    deleteTodo=$(this).closest(".thumbnail");
    $.get(API+'/?id='+deleteTodo.data('id'),{},function(data){
       $(".delete-confirm").html('<h2>'+data.naslov+'</h2>');
    });
  });


  var deleteDialog=$("#deleteDialog").dialog({
    autoOpen:false,
    modal:true,
    buttons:{
      Obriši:function(){
        $.post(API + '/destroy/' + deleteTodo.data('id'), {}, function(data){
        deleteTodo.remove();
        deleteDialog.dialog('close');
      });
      },
      Odustani:function(){
        deleteDialog.dialog('close');
      }
    }
  });

//Editiranje zadataka pomoću dijaloga
  var editTodo;
  todo.on('click','.edit',function(){
    editTodo=$(this).closest(".thumbnail");
    $.get(API+'/?id='+editTodo.data('id'),{},function(data){
      $("#editnaslov").val(data.naslov);
      $("#edit-datepicker").val(data.datum);
      $("#editopis").val(data.opis);
      editDialog.dialog("open");
     });
  });

  var editDialog=$("#editDialog").dialog({
      autoOpen:false,
      modal:true,
      buttons:{
        'Prihvati':function(){
           editForm.submit();
        },
        Cancel: function(){
          editDialog.dialog('close');
        }
      }
    });

  var editForm=editDialog.find('form');
   editForm.on('submit',function(e){
    e.preventDefault();
    $.post(API +'/update/'+ editTodo.data('id') + '/', editForm.serialize()).done(function(data){
      editTodo.html('<div class="caption"><h3>'+data.naslov+'</h3><p>'+data.datum+'</p><p>'+data.opis+'</p><p><button class="btn btn-warning edit">Edit</button> <button class="btn btn-danger delete">Delete</button> <button class="btn btn-success done">Done</button></p></div>');
      editDialog.dialog('close');
    }).fail(function(error){
      console.log(error.responseText);
    });
  });
  
$(".sortable").sortable();
$(".sortable").disableSelection();

todo.on('click','.done',function(){
  var done=$(this).closest(".thumbnail");
  done.find(".edit").detach();
  done.find(".done").html('<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>');
});

});