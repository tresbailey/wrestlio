# A small class that allows normal backbone interaction with
# the abomination that is the facebook api
# No view included due to the individuality of each solution
# the properties for the model are: uid, name, pic_square
class exports.FacebookFriendsList extends Backbone.Collection

  #model: exports.InvitationFacebook
  
  options:
    page: 0
    search: ''
    limit: 60

  url: '/fql'

  # Generate a query for the facebook open graph
  # this uses fql for pagination and searching of users
  query : ->
    # Current users friends who are not on spling
    url = "SELECT uid, name, pic_square FROM user WHERE has_added_app=0 AND
           uid IN (SELECT uid2 FROM friend WHERE uid1 = me())"

    # Any search parameters
    unless @options.search is ''
      url += " AND strpos(lower(name), '#{@options.search.toLowerCase()}') >= 0"

    # Pagination
    url += " ORDER BY name LIMIT #{@options.limit} 
             OFFSET #{@options.page*@options.limit}"

  initialize: (appId, app_token)->
    # Initialize the facebook api 
    FB.init
      appId : appId
      app_token : app_token
      status : true

  # A custom fetch method that uses the facebook api
  # instead of backbones fetch()
  fetch: (options = {})->

    console.log 'fql query', @query()

    # This is the normal backbone behaviour
    # turn the response into models and call any 
    # user defined success callbacks
    success = (resp)=>
      @[if options.add then 'add' else 'reset'](@parse(resp), options)
      options.success(this, resp) if options.success

    # Check the login status before calling the api
    # without this expect an api error
    FB.getLoginStatus( (response)=>
      if response.status is 'connected'
        FB.api '/fql', q: @query(), success
    )

    this

  parse: (response)->
    response.data
