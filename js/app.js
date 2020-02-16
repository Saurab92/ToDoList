$(document).ready(function(){

  const config = {
    apiKey: "AIzaSyDifKtzvNb8-oUIKyxfCq-w8xgnCOyJc7A",
    authDomain: "todolist-31caf.firebaseapp.com",
    databaseURL: "https://todolist-31caf.firebaseio.com",
    projectId: "todolist-31caf",
    storageBucket: "todolist-31caf.appspot.com",
    messagingSenderId: "14641355164",
    appId: "1:14641355164:web:b77a2a4c2eaab9d85c9059",
    measurementId: "G-0FPE8B5HB4"
  };
  firebase.initializeApp(config);

  const getvalue = firebase.database().ref('to_do/');
  getvalue.on('value', function(snapshot) {
    const tbodyEl = $('tbody');
    tbodyEl.html('');
    let a = 0;
    snapshot.forEach(function(product) {
      a = a+1;
      let item = product.val().name;
      tbodyEl.append('\
      <tr>\
      <td class="id" style="display:none;">' + product.val().id + '</td>\
      <td>' + a + '</td>\
      <td><input type="text" class="form-control" id='+ product.val().id +' value= "'+item+'" readonly></td>\
      <td>\
      <button class="btn edit" id="edit'+ product.val().id +'">Edit</button>\
      <button class="btn" id="delete">Done/Delete</button>\
      </td>\
      </tr>\
      ');
    });
  });
//////todo display end ////////////////

//////add todo start ////////////////
  $( "#add" ).click(function() {
    var task = $('#todo').val();
    console.log("Product value is "+task);
    
    add_todo(task);
  
    $('#form')[0].reset();
  });

  function add_todo(name) {
      if(name!=""){
    var newPostKey = firebase.database().ref().child('to_do').push().key;
    var user = {
      id: newPostKey,
      created_at: firebase.database.ServerValue.TIMESTAMP,
      name: name
    };
    var updates = {};
    updates['/to_do/' + newPostKey] = user;
    return firebase.database().ref().update(updates);
  }
  }

  $('table').on('click', '.edit', function() {

    var rowEl = $(this).closest('tr');
    var id = rowEl.find('.id').text();
    $('#'+id).attr("readonly", false);
    $("#edit"+id).html('Update');
    $("#edit"+id).addClass('update').removeClass('edit');
    $("#edit"+id).prop('id', 'update'+id);

  });

  $('table').on('click', '.update', function() {
    var rowEl = $(this).closest('tr');
    var id = rowEl.find('.id').text();
    var name = $('#'+id).val();
    $('#'+id).attr("readonly", false);
    $('#'+id).attr("readonly", true);
    $("#update"+id).html('Edit');
    $("#update"+id).addClass('edit').removeClass('update');
    $("#update"+id).prop('id', 'edit'+id);
    update_todo(id,name);
  });

  function update_todo(id, name) {
    console.log(id, name);
    var updates = {};
    updates['to_do/' + id + "/name"] = name;
    return firebase.database().ref().update(updates);
  }

  $('table').on('click', '#delete', function() {
    var rowEl = $(this).closest('tr');
    var id = rowEl.find('.id').text();
    delete_todo(id);
  });

  function delete_todo(id) {
    var rootRef = firebase.database().ref().child('to_do');
    rootRef.child(id).remove();
  }

});
