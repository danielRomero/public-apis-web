require "markdown"

class HomeController < ApplicationController
  LAYOUT = "home.ecr"

  def index
    entries_grouped = Entry.all("ORDER BY category ASC").group_by { |entry| entry.category }
    render("index.ecr")
  end
end
