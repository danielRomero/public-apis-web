class HomeController < ApplicationController
  LAYOUT = "home.ecr"

  def index
    render("index.ecr")
  end
end
