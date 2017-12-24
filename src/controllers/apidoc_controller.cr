class ApidocController < ApplicationController
  def api_doc
    render("doc.ecr")
  end
end
