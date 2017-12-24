Amber::Server.configure do |app|
  pipeline :web do
    # Plug is the method to use connect a pipe (middleware)
    # A plug accepts an instance of HTTP::Handler
    plug Amber::Pipe::Error.new
    plug Amber::Pipe::Logger.new
    plug Amber::Pipe::Session.new
    plug Amber::Pipe::Flash.new
    plug Amber::Pipe::CSRF.new
  end

  pipeline :api do
    # Plug is the method to use connect a pipe (middleware)
    # A plug accepts an instance of HTTP::Handler
    plug Amber::Pipe::Error.new
    plug Amber::Pipe::Logger.new
  end

  # All static content will run these transformations
  pipeline :static do
    plug Amber::Pipe::Error.new
    plug Amber::Pipe::Static.new("./public")
    plug HTTP::CompressHandler.new
  end

  routes :static do
    # Each route is defined as follow
    # verb resource : String, controller : Symbol, action : Symbol
    get "/*", Amber::Controller::Static, :index
  end

  routes :web do
    # resources "/entries", EntryController
    get "/entries/search", EntryController, :search
    get "/entries", EntryController, :index
    get "/", HomeController, :index
    get "/api-docs/v1", ApidocController, :api_doc
  end

  routes :api, "/api/v1" do
    get "/entries/search", Api::V1::EntryController, :search
    get "/entries/index", Api::V1::EntryController, :index
    get "/entries/categories", Api::V1::EntryController, :categories
    get "/entries/by_category", Api::V1::EntryController, :by_category
  end
end
