$(document).ready(function(){

$('#my-nuggets-table').on('click', 'a.nugget-source-link', function(event) {
  chrome.tabs.create({url: $(this).attr('href')});
  return false;
});

function initialize() {
  Parse.initialize("F1fRCfIIYQzvft22ckZd5CdrOzhVecTXkwfgWflN", "DUoWr9lIjQME2MmqgMApFmWFdzMcl7B6mKfj8AAc");
  validateLogin();
}

function goToLoginPage()
{
  window.location.replace('login.html');
}

function runQuery()
{
  var Nugget_User = Parse.Object.extend("Nugget_User");
  var query = new Parse.Query(Nugget_User);
  query.equalTo("user", Parse.User.current()).descending("updatedAt");
  query.notEqualTo("isDeleted", true);
  query.include("nugget");
  query.find({
    success: function(results_nugget_user) {
      if (results_nugget_user.length == 0)
      {
        $('#my-nuggets-table').html('<p>none</p>');
      }
      else
      {
        var my_nuggets = [];
        var results = $.map(results_nugget_user, function(nugget_user) {
          var nugget = nugget_user.get("nugget");
          var return_object = new Object();
          return_object.id = nugget.id;
          return_object.text = nugget.get("text");
          return_object.tags = nugget.get("tags");
          return_object.url = nugget.get("url");
          return_object.source = nugget.get("source");
          return_object.isOwner = nugget_user.get("isOwner");
          return_object.updatedAt = nugget_user.updatedAt;
          return return_object;
        });
        for(i=0;i<results.length;i++)
        {
          var markup_to_push = '<tr><td><div id="' + results[i].id + '" class="nugget-wrapper"><p>' + results[i].text;
          var tags = results[i].tags;
          if (tags)
          {
            for (j=0;j<tags.length;j++)
            {
              markup_to_push += ' <span class="nugget-tag">#' + tags[j] + '</span>';
            }
          }
          markup_to_push += '</p>'
          if (results[i].url && results[i].url != "")
          {
            markup_to_push += '<p><a href="' + results[i].url + '" class="nugget-source-link">' + results[i].source + '</a></p>';
          }
          else if (results[i].source != "")
          {
            markup_to_push += '<p class="gray">' + results[i].source + '</p>';
          }
          var timeAgo = moment(results[i].updatedAt).fromNow();
          if (moment().diff(results[i].updatedAt) < 0)  // Parse seems to set updatedAt a couple seconds into the future, so preventing the time-ago tag from saying "in a few seconds"
          {
            timeAgo = moment().fromNow();
          }
          markup_to_push += '<div class="row-fluid"><span class="nugget-time-ago span10">' + timeAgo + '</span>';
          markup_to_push += '<span class="span1 pull-right nugget-action-icons" style="display: none;"><i class="icon-trash nugget-action-icon"></i></span>';
          markup_to_push += '</div></div></td></tr>';
          my_nuggets.push(markup_to_push);
        }
        $('#my-nuggets-table').html(my_nuggets.join(''));
      }
    }
  });
}

$('#my-nuggets-table').on('mouseenter', 'tr', function()
{
  $(this).find('.nugget-action-icons').css('display','block');
});

$('#my-nuggets-table').on('mouseleave', 'tr', function()
{
  $(this).find('.nugget-action-icons').css('display','none');
});

$('#my-nuggets-table').on('click', '.icon-trash', function()
{
  var nugget_div = $(this).parents('.nugget-wrapper');
  var nugget_id = nugget_div.attr('id');
  var Nugget = Parse.Object.extend("Nugget");
  var query = new Parse.Query(Nugget);
  query.get(nugget_id).then(function(nugget) {
    var Nugget_User = Parse.Object.extend("Nugget_User");
    var query2 = new Parse.Query(Nugget_User);
    query2.equalTo("nugget", nugget);
    query2.notEqualTo("isDeleted", true);
    query2.find().then(function(nugget_users) {
      if (nugget_users.length == 1 && nugget_users[0].get("user").id == Parse.User.current().id) // last person to lose connection with this nugget, set nugget as deleted
      {
        nugget.set("isDeleted", true);
        nugget.save().then(function() {
          runQuery();
        });
      }
      for (i=0;i<nugget_users.length;i++)
      {
        if (nugget_users[i].get("user").id == Parse.User.current().id)
        {
          nugget_users[i].set("isDeleted", true);
          nugget_users[i].save().then(function() {
            runQuery();
          });
        }
      }
    }, function(error) {
    });
  }).then(function() { // in case nugget gets deleted and the query.get(nugget_id) fails, should refresh my nuggets
    runQuery();
  });
});

function validateLogin() {
  var currentUser = Parse.User.current();
  if (!currentUser)
  {
    goToLoginPage();
  }
  else
  {
    $('#extension-container').css('display','block');
    runQuery();
  }
}

initialize();

$('#logout-button').click(function()
{
  Parse.User.logOut();
  goToLoginPage();
});

});
