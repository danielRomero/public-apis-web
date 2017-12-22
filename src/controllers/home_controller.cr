class HomeController < ApplicationController
  LAYOUT = "home.ecr"

  def index
    entries = Entry.all
    render("index.ecr")
  end
end
