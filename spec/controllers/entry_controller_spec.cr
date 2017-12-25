require "./spec_helper"

def entry_hash
  {}
end

def entry_params
  params = [] of String
  params.join("&")
end

def create_entry
  model = Entry.new(entry_hash)
  model.save
  model
end

class EntryControllerTest < GarnetSpec::Controller::Test
  getter handler : Amber::Pipe::Pipeline

  def initialize
    @handler = Amber::Pipe::Pipeline.new
    @handler.build :web do
      plug Amber::Pipe::Error.new
      plug Amber::Pipe::Session.new
      plug Amber::Pipe::Flash.new
    end
    @handler.prepare_pipelines
  end
end

describe EntryControllerTest do
  subject = EntryControllerTest.new

  it "renders entry index template" do
    Entry.clear
    response = subject.get "/entrys"

    response.status_code.should eq(200)
    response.body.should contain("Entrys")
  end

  it "renders entry show template" do
    Entry.clear
    model = create_entry
    location = "/entrys/#{model.id}"

    response = subject.get location

    response.status_code.should eq(200)
    response.body.should contain("Show Entry")
  end

  it "renders entry new template" do
    Entry.clear
    location = "/entrys/new"

    response = subject.get location

    response.status_code.should eq(200)
    response.body.should contain("New Entry")
  end

  it "renders entry edit template" do
    Entry.clear
    model = create_entry
    location = "/entrys/#{model.id}/edit"

    response = subject.get location

    response.status_code.should eq(200)
    response.body.should contain("Edit Entry")
  end

  it "creates a entry" do
    Entry.clear
    response = subject.post "/entrys", body: entry_params

    response.headers["Location"].should eq "/entrys"
    response.status_code.should eq(302)
    response.body.should eq "302"
  end

  it "updates a entry" do
    Entry.clear
    model = create_entry
    response = subject.patch "/entrys/#{model.id}", body: entry_params

    response.headers["Location"].should eq "/entrys"
    response.status_code.should eq(302)
    response.body.should eq "302"
  end

  it "deletes a entry" do
    Entry.clear
    model = create_entry
    response = subject.delete "/entrys/#{model.id}"

    response.headers["Location"].should eq "/entrys"
    response.status_code.should eq(302)
    response.body.should eq "302"
  end
end
