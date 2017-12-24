require "jasper_helpers"

class Api::V1::ApplicationController < Amber::Controller::Base
  include JasperHelpers
  LAYOUT = "application.ecr"
end
