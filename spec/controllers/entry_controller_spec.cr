require "./spec_helper"

def entry_hash
  {"api" => "Fake", "auth" => "Fake", "category" => "Fake", "description" => "Fake", "https" => "true", "link" => "Fake"}
end

def entry_params
  params = [] of String
  params << "api=#{entry_hash["api"]}"
  params << "auth=#{entry_hash["auth"]}"
  params << "category=#{entry_hash["category"]}"
  params << "description=#{entry_hash["description"]}"
  params << "https=#{entry_hash["https"]}"
  params << "link=#{entry_hash["link"]}"
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
      plug Amber::Pipe::Logger.new
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
    response = subject.get "/entries"

    response.status_code.should eq(200)
    response.body.should contain("entries")
  end

  it "renders entry show template" do
    Entry.clear
    model = create_entry
    location = "/entries/#{model.id}"

    response = subject.get location

    response.status_code.should eq(200)
    response.body.should contain("Show Entry")
  end

  it "renders entry new template" do
    Entry.clear
    location = "/entries/new"

    response = subject.get location

    response.status_code.should eq(200)
    response.body.should contain("New Entry")
  end

  it "renders entry edit template" do
    Entry.clear
    model = create_entry
    location = "/entries/#{model.id}/edit"

    response = subject.get location

    response.status_code.should eq(200)
    response.body.should contain("Edit Entry")
  end

  it "creates a entry" do
    Entry.clear
    response = subject.post "/entries", body: entry_params

    response.headers["Location"].should eq "/entries"
    response.status_code.should eq(302)
    response.body.should eq "302"
  end

  it "updates a entry" do
    Entry.clear
    model = create_entry
    response = subject.patch "/entries/#{model.id}", body: entry_params

    response.headers["Location"].should eq "/entries"
    response.status_code.should eq(302)
    response.body.should eq "302"
  end

  it "deletes a entry" do
    Entry.clear
    model = create_entry
    response = subject.delete "/entries/#{model.id}"

    response.headers["Location"].should eq "/entries"
    response.status_code.should eq(302)
    response.body.should eq "302"
  end
end
